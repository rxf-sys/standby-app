import { format, parseISO, isValid, differenceInDays, addDays, startOfMonth, endOfMonth } from 'date-fns';
import { de } from 'date-fns/locale';

/**
 * Formats a date string or Date object
 * @param date - Date to format
 * @param formatStr - Format string (default: 'dd.MM.yyyy')
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date, formatStr: string = 'dd.MM.yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    return format(dateObj, formatStr, { locale: de });
  } catch {
    return '';
  }
};

/**
 * Formats a date to a relative time string
 * @param date - Date to format
 * @returns Relative time string (e.g., "Heute", "Morgen", "in 3 Tagen")
 */
export const formatRelativeDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  const diff = differenceInDays(dateObj, today);

  if (diff === 0) return 'Heute';
  if (diff === 1) return 'Morgen';
  if (diff === -1) return 'Gestern';
  if (diff > 1 && diff <= 7) return `in ${diff} Tagen`;
  if (diff < -1 && diff >= -7) return `vor ${Math.abs(diff)} Tagen`;

  return formatDate(dateObj);
};

/**
 * Formats a time from a date string
 * @param date - Date to format
 * @returns Formatted time string (HH:mm)
 */
export const formatTime = (date: string | Date): string => {
  return formatDate(date, 'HH:mm');
};

/**
 * Formats a date with time
 * @param date - Date to format
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'dd.MM.yyyy HH:mm');
};

/**
 * Gets the start and end of the current month
 * @returns Object with startDate and endDate
 */
export const getCurrentMonthRange = (): { startDate: Date; endDate: Date } => {
  const now = new Date();
  return {
    startDate: startOfMonth(now),
    endDate: endOfMonth(now),
  };
};

/**
 * Checks if a date is in the past
 * @param date - Date to check
 * @returns True if date is in the past
 */
export const isPastDate = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return differenceInDays(new Date(), dateObj) > 0;
};

/**
 * Checks if a date is in the future
 * @param date - Date to check
 * @returns True if date is in the future
 */
export const isFutureDate = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return differenceInDays(dateObj, new Date()) > 0;
};

/**
 * Adds days to a date
 * @param date - Starting date
 * @param days - Number of days to add
 * @returns New date
 */
export const addDaysToDate = (date: string | Date, days: number): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return addDays(dateObj, days);
};
