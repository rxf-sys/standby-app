import {
  isValidEmail,
  isValidPassword,
  isNotEmpty,
  isPositive,
  isInRange,
} from '../validation';

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should validate strong passwords', () => {
      expect(isValidPassword('Test1234')).toBe(true);
      expect(isValidPassword('MyPassword123')).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(isValidPassword('short')).toBe(false); // Too short
      expect(isValidPassword('nouppercase1')).toBe(false); // No uppercase
      expect(isValidPassword('NOLOWERCASE1')).toBe(false); // No lowercase
      expect(isValidPassword('NoNumber')).toBe(false); // No number
    });
  });

  describe('isNotEmpty', () => {
    it('should validate non-empty strings', () => {
      expect(isNotEmpty('hello')).toBe(true);
      expect(isNotEmpty(' text ')).toBe(true);
    });

    it('should reject empty strings', () => {
      expect(isNotEmpty('')).toBe(false);
      expect(isNotEmpty('   ')).toBe(false);
    });
  });

  describe('isPositive', () => {
    it('should validate positive numbers', () => {
      expect(isPositive(1)).toBe(true);
      expect(isPositive(100.5)).toBe(true);
    });

    it('should reject non-positive numbers', () => {
      expect(isPositive(0)).toBe(false);
      expect(isPositive(-5)).toBe(false);
    });
  });

  describe('isInRange', () => {
    it('should validate numbers in range', () => {
      expect(isInRange(5, 1, 10)).toBe(true);
      expect(isInRange(1, 1, 10)).toBe(true);
      expect(isInRange(10, 1, 10)).toBe(true);
    });

    it('should reject numbers out of range', () => {
      expect(isInRange(0, 1, 10)).toBe(false);
      expect(isInRange(11, 1, 10)).toBe(false);
    });
  });
});
