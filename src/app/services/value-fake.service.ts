export class FakeValueService {
  
  constructor() { }

  getValue() {
    return 'fake real value';
  }

  setValue(value: string) {
  }

  getPromiseValue() {
    return Promise.resolve('fake promise value');
  }
}
