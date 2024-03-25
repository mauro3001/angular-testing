import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { Auth } from '../models/auth.model';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

describe('AuthService', () => {
  let httpCrontroller: HttpTestingController;
  let authService: AuthService;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, TokenService],
    });

    httpCrontroller = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpCrontroller.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('tests for login', () => {
    it('should return a token', (doneFn) => {
        //arrange
        const email = 'mauro@gmail.com';
        const password = '123456';
        const mockData: Auth = {
            access_token: '1222236',
        };
        //act
        authService.login(email, password).subscribe((response) => {
            //assert
            expect(response).toEqual(mockData);
            doneFn();
        });

        //http config
        const url = `${environment.API_URL}/api/v1/auth/login`;
        const req = httpCrontroller.expectOne(url);
        req.flush(mockData);
    });

     it('should call to saveToken', (doneFn) => {
        //arrange
        const email = 'mauro@gmail.com';
        const password = '123456';
        const mockData: Auth = {
            access_token: '1222236',
        };
        spyOn(tokenService, 'saveToken').and.callThrough();
        //act
        authService.login(email, password).subscribe((response) => {
            //assert
            expect(response).toEqual(mockData);
            expect(tokenService.saveToken).toHaveBeenCalledTimes(1);
            expect(tokenService.saveToken).toHaveBeenCalledOnceWith(mockData.access_token);

            doneFn();
        });

        //http config
        const url = `${environment.API_URL}/api/v1/auth/login`;
        const req = httpCrontroller.expectOne(url);
        req.flush(mockData);
    });
  });
});
