/**
 * Formats a number as currency
 * @param amount - The amount to format
 * @param currency - Currency code (default: EUR)
 * @param locale - Locale for formatting (default: de-DE)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'EUR',
  locale: string = 'de-DE'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Parses a currency string to a number
 * @param value - The currency string to parse
 * @returns Parsed number or 0 if invalid
 */
export const parseCurrency = (value: string): number => {
  // Remove currency symbols and whitespace
  let cleaned = value.replace(/[^\d,.-]/g, '');

  // Handle German number format: 1.234,56 -> 1234.56
  // Remove dots (thousand separators), then replace comma with dot (decimal separator)
  cleaned = cleaned.replace(/\./g, '').replace(',', '.');

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Validates if a value is a valid currency amount
 * @param value - The value to validate
 * @returns True if valid, false otherwise
 */
export const isValidCurrency = (value: string | number): boolean => {
  if (typeof value === 'number') {
    return !isNaN(value) && value >= 0;
  }

  // Empty string is invalid
  if (!value || value.trim() === '') {
    return false;
  }

  // Check if the string contains at least one digit
  if (!/\d/.test(value)) {
    return false;
  }

  const parsed = parseCurrency(value);
  return !isNaN(parsed) && parsed >= 0;
};

/**
 * Rounds a currency amount to 2 decimal places
 * @param amount - The amount to round
 * @returns Rounded amount
 */
export const roundCurrency = (amount: number): number => {
  return Math.round(amount * 100) / 100;
};
