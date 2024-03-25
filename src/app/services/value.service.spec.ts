import { TestBed } from '@angular/core/testing';
import { ValueService } from './value.service';

describe('ValueService', () => {
  let service: ValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValueService],
    });
    service = TestBed.inject(ValueService);
  });

  describe('Test for Service', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('Test for getValue', () => {
    it('should return "real value"', () => {
      expect(service.getValue()).toBe('real value');
    });
  });

  describe('Test for setValue', () => {
    it('should change the value', () => {
      expect(service.getValue()).toBe('real value');
      service.setValue('new value');
      expect(service.getValue()).toBe('new value');
    });
  });

  describe('Test for getPromiseValue', () => {
    it('should return "promise value" from a promise with then', (doneFn: DoneFn) => {
      service.getPromiseValue().then((value) => {
        // when the promise is resolved the value is checked
        expect(value).toBe('promise value');
        doneFn();
      });
    });

    it('should return "promise value" from a promise using async', async () => {
      const result = await service.getPromiseValue();
      expect(result).toBe('promise value');
    });
  });

  describe('Test for getObservableValue', () => {
    it('should return "observable value" from an observable', (doneFn: DoneFn) => {
      service.getObservableValue().subscribe((value) => {
        // when the observable emits a value, the value is checked
        expect(value).toBe('observable value');
        doneFn();
      });
    });

    it('should return "observable value" from an observable using async', async () => {
      const result = await service.getObservableValue().toPromise();
      expect(result).toBe('observable value');
    });
  });
});
