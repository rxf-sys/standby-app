import { formatCurrency, parseCurrency, isValidCurrency, roundCurrency } from '../currency';

describe('Currency Utils', () => {
  describe('formatCurrency', () => {
    it('should format number as EUR currency', () => {
      expect(formatCurrency(100)).toBe('100,00 €');
      expect(formatCurrency(1234.56)).toBe('1.234,56 €');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('0,00 €');
    });

    it('should handle negative numbers', () => {
      expect(formatCurrency(-50.25)).toContain('-');
    });
  });

  describe('parseCurrency', () => {
    it('should parse currency string to number', () => {
      expect(parseCurrency('100,00 €')).toBe(100);
      expect(parseCurrency('1.234,56')).toBe(1234.56);
    });

    it('should handle invalid input', () => {
      expect(parseCurrency('abc')).toBe(0);
      expect(parseCurrency('')).toBe(0);
    });

    it('should handle comma as decimal separator', () => {
      expect(parseCurrency('25,50')).toBe(25.5);
    });
  });

  describe('isValidCurrency', () => {
    it('should validate positive numbers', () => {
      expect(isValidCurrency(100)).toBe(true);
      expect(isValidCurrency('100')).toBe(true);
      expect(isValidCurrency('25,50')).toBe(true);
    });

    it('should reject negative numbers', () => {
      expect(isValidCurrency(-50)).toBe(false);
    });

    it('should reject invalid strings', () => {
      expect(isValidCurrency('abc')).toBe(false);
    });
  });

  describe('roundCurrency', () => {
    it('should round to 2 decimal places', () => {
      expect(roundCurrency(25.555)).toBe(25.56);
      expect(roundCurrency(25.554)).toBe(25.55);
    });

    it('should handle whole numbers', () => {
      expect(roundCurrency(100)).toBe(100);
    });
  });
});
