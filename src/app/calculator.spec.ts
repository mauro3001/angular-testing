import { Calculator } from './calculator';

describe('Test for calculator', () => {
  describe('Test for multiply', () => {
    it('should return a nine', () => {
      //Arrange
      const calculator = new Calculator();
      //Act
      const result = calculator.multiply(3, 3);
      //Assert
      expect(result).toBe(9);
    });

    it('should return a four', () => {
      //Arrange
      const calculator = new Calculator();
      //Act
      const result = calculator.multiply(2, 2);
      //Assert
      expect(result).toBe(4);
    });
  });

  describe('Test for divide', () => {
    it('should return a some numbers', () => {
      //Arrange
      const calculator = new Calculator();
      //Act and Assert
      expect(calculator.divide(6, 3)).toEqual(2);
      expect(calculator.divide(5, 2)).toEqual(2.5);
    });
    it('for a zero', () => {
      //Arrange
      const calculator = new Calculator();
      //Act and Assert
      expect(calculator.divide(6, 0)).toBeNull();
      expect(calculator.divide(2, 0)).toBeNull();
      expect(calculator.divide(12212121212, 0)).toBeNull();
    });
  });

  describe('Test for matchers', () => {
    it('tests matchers', () => {
      let name = 'John';
      let name2;

      expect(name).toBeDefined();
      expect(name2).toBeUndefined();

      expect(1 + 3 === 4).toBeTruthy(); //4
      expect(1 + 1 === 3).toBeFalsy();

      expect(7).toBeLessThan(10);
      expect(20).toBeGreaterThan(10);

      expect('1234567').toMatch(/123/);
      expect(['apples', 'oranges', 'pears']).toContain('oranges');
    });
  });
});
