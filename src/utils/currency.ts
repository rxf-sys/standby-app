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
  const cleaned = value.replace(/[^\d,.-]/g, '').replace(',', '.');
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
