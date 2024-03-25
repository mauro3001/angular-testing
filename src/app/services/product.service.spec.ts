import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from './../../environments/environment';
import {
  CreateProductDTO,
  Product,
  UpdateProductDTO,
} from '../models/product.model';
import { ProductsService } from './products.service';
import { generateManyProducts, generateProduct } from '../models/product.mock';
import { HttpStatusCode, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { TokenService } from './token.service';

describe('ProductsService', () => {
  let productService: ProductsService;
  let httpCrontroller: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductsService,
        TokenService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        },
      ],
    });
    productService = TestBed.inject(ProductsService);
    httpCrontroller = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpCrontroller.verify();
  });

  it('should be created', () => {
    expect(productService).toBeTruthy();
  });

  describe('tests for getAllSimple', () => {
    it('should return a list of products', (doneFn) => {
      //Arrange
      const mockData: Product[] = generateManyProducts(2);
      spyOn(tokenService, 'getToken').and.returnValue('123');
      //Act
      productService.getAllSimple().subscribe((products) => {
        //Assert
        expect(products.length).toEqual(mockData.length);
        expect(products).toEqual(mockData);
        doneFn();
      });

      //http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpCrontroller.expectOne(url);
      const headers = req.request.headers;
      expect(headers.get('Authorization')).toEqual('Bearer 123');
      req.flush(mockData);
    });
  });

  describe('tests for getAll', () => {
    it('should return a list of products', (doneFn) => {
      //Arrange
      const mockData: Product[] = generateManyProducts(2);
      //Act
      productService.getAll().subscribe((products) => {
        //Assert
        expect(products.length).toEqual(mockData.length);
        doneFn();
      });

      //http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpCrontroller.expectOne(url);
      req.flush(mockData);
    });

    it('should return a list of products with taxes', (doneFn) => {
      //Arrange
      const mockData: Product[] = [
        {
          ...generateProduct(),
          price: 100, // 100 * .19 = 19
        },
        {
          ...generateProduct(),
          price: 200, // 200 * .19 = 38
        },
        {
          ...generateProduct(),
          price: 0, // 0 * .19 = 0
        },
        {
          ...generateProduct(),
          price: -100, // -100 * .19 = -19 for logic in case with negative numbers the result is 0
        },
      ];
      //Act
      productService.getAll().subscribe((products) => {
        //Assert
        expect(products.length).toEqual(mockData.length);
        expect(products[0].taxes).toEqual(19);
        expect(products[1].taxes).toEqual(38);
        expect(products[2].taxes).toEqual(0);
        expect(products[3].taxes).toEqual(0);
        doneFn();
      });

      //http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpCrontroller.expectOne(url);
      req.flush(mockData);
    });

    xit('should send query params with limit 8 and offset 2', (doneFn) => {
      //Arrange
      const mockData: Product[] = generateManyProducts(3);
      const limit = 8;
      const offset = 2;
      //Act
      productService.getAll(limit, offset).subscribe((products) => {
        //Assert
        expect(products.length).toEqual(mockData.length);
        doneFn();
      });
      //http config
      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
      const req = httpCrontroller.expectOne(url);
      req.flush(mockData);
      const params = req.request.params;
      expect(params.get('limit')).toEqual(`${limit}`);
      expect(params.get('offset')).toEqual(`${offset}`);
    });

    xit('should send query params with limit 0 and offset 0', (doneFn) => {
      // Arange
      const mockData: Product[] = generateManyProducts(3);
      const limit = 0;
      const offset = 0;
      //Act
      productService.getAll(limit, offset).subscribe((data) => {
        // Assert
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
      const req = httpCrontroller.expectOne(url);
      req.flush(mockData);
      const param = req.request.params;
      expect(param.get('limit')).toBeNull();
      expect(param.get('offset')).toBeNull();
    });

    xit('should send query params with limit 1 and offset 0', (doneFn) => {
      // Arange
      const mockData: Product[] = generateManyProducts(3);
      const limit = 1;
      const offset = 0;
      //Act
      productService.getAll(limit, offset).subscribe((data) => {
        // Assert
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
      const req = httpCrontroller.expectOne(url);
      req.flush(mockData);
      const param = req.request.params;
      expect(param.get('limit')).toEqual(limit.toString());
      expect(param.get('offset')).toBeNull();
    });
  });

  describe('tests for create', () => {
    it('should return a new product', (doneFn) => {
      //Arrange
      const mockData: Product = generateProduct();
      const dto: CreateProductDTO = {
        title: 'new product',
        price: 100,
        images: ['image1', 'image2'],
        description: 'description',
        categoryId: 12,
      };
      //Act
      productService.create({ ...dto }).subscribe((product) => {
        //Assert
        expect(product).toEqual(mockData);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpCrontroller.expectOne(url);
      req.flush(mockData);
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('POST');
    });
  });

  describe('tests for update', () => {
    it('should return the updated product', (doneFn) => {
      //Arrange
      const mockData: Product = generateProduct();
      const dto: UpdateProductDTO = {
        title: 'update product',
        price: 200,
        images: ['image3', 'image6'],
        description: 'update description',
        categoryId: 5,
      };
      const productId: Product['id'] = '1';
      //Act
      productService.update(productId, { ...dto }).subscribe((product) => {
        //Assert
        expect(product).toEqual(mockData);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpCrontroller.expectOne(url);
      req.flush(mockData);
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('PUT');
    });
  });

  describe('tests for delete', () => {
    it('should delete a product', (doneFn) => {
      //Arrange
      const mockData = true;
      const productId: Product['id'] = '1';
      //Act
      productService.delete(productId).subscribe((result) => {
        //Assert
        expect(result).toEqual(mockData);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpCrontroller.expectOne(url);
      req.flush(mockData); //mocking that information
      expect(req.request.method).toEqual('DELETE');
    });
  });

  describe('tests for get one product', () => {
    it('should return a product', (doneFn) => {
      //Arrange
      const mockData: Product = generateProduct();
      const productId: Product['id'] = '1';
      //Act
      productService.getOne(productId).subscribe((product) => {
        //Assert
        expect(product).toEqual(mockData);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpCrontroller.expectOne(url);
      req.flush(mockData);
      expect(req.request.method).toEqual('GET');
    });

    it('should return a correct message when status code is 404', (doneFn) => {
      //Arrange
      const productId: Product['id'] = '1';
      const msgError = '404 message';
      const mockError = {
        status: HttpStatusCode.NotFound,
        statusText: msgError,
      };
      //Act
      productService.getOne(productId).subscribe({
        error: (error) => {
          //error
          //Assert
          expect(error).toEqual('El producto no existe');
          doneFn();
        },
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpCrontroller.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });

    it('should return the right msg when status code is 409', (doneFn) => {
      // Arange
      const productId = '1';
      const msgError = '409 message';
      const mockError = {
        status: HttpStatusCode.Conflict,
        statusText: msgError,
      };
      // Act
      productService.getOne(productId).subscribe({
        error: (err) => {
          // Assert
          expect(err).toEqual('Algo esta fallando en el server');
          doneFn();
        },
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpCrontroller.expectOne(url);
      req.flush(msgError, mockError);
      expect(req.request.method).toEqual('GET');
    });

    it('should return the right msg when status code is 401', (doneFn) => {
      // Arange
      const productId = '1';
      const msgError = '401 message';
      const mockError = {
        status: HttpStatusCode.Unauthorized,
        statusText: msgError,
      };
      // Act
      productService.getOne(productId).subscribe({
        error: (err) => {
          // Assert
          expect(err).toEqual('No estas permitido');
          doneFn();
        },
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpCrontroller.expectOne(url);
      req.flush(msgError, mockError);
      expect(req.request.method).toEqual('GET');
    });

    it('should return the right msg when status code is 500', (doneFn) => {
      // Arange
      const productId = '1';
      const msgError = '500 error message';
      const mockError = {
        status: HttpStatusCode.InternalServerError,
        statusText: msgError,
      };
      // Act
      productService.getOne(productId).subscribe({
        error: (err) => {
          // Assert
          expect(err).toEqual('Ups algo salio mal');
          doneFn();
        },
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpCrontroller.expectOne(url);
      req.flush(msgError, mockError);
      expect(req.request.method).toEqual('GET');
    });
  });
});
