import { z } from 'zod';

/**
 * Email validation
 */
export const emailSchema = z.string().email('Ungültige E-Mail-Adresse');

/**
 * Password validation (min 8 characters, 1 uppercase, 1 lowercase, 1 number)
 */
export const passwordSchema = z
  .string()
  .min(8, 'Passwort muss mindestens 8 Zeichen lang sein')
  .regex(/[A-Z]/, 'Passwort muss mindestens einen Großbuchstaben enthalten')
  .regex(/[a-z]/, 'Passwort muss mindestens einen Kleinbuchstaben enthalten')
  .regex(/[0-9]/, 'Passwort muss mindestens eine Zahl enthalten');

/**
 * Transaction validation schema
 */
export const transactionSchema = z.object({
  amount: z.number().positive('Betrag muss positiv sein'),
  description: z.string().min(1, 'Beschreibung ist erforderlich'),
  category: z.string().min(1, 'Kategorie ist erforderlich'),
  date: z.string().datetime(),
});

/**
 * Event validation schema
 */
export const eventSchema = z.object({
  title: z.string().min(1, 'Titel ist erforderlich'),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  category: z.string().min(1, 'Kategorie ist erforderlich'),
});

/**
 * Validates an email address
 * @param email - Email to validate
 * @returns True if valid
 */
export const isValidEmail = (email: string): boolean => {
  return emailSchema.safeParse(email).success;
};

/**
 * Validates a password
 * @param password - Password to validate
 * @returns True if valid
 */
export const isValidPassword = (password: string): boolean => {
  return passwordSchema.safeParse(password).success;
};

/**
 * Validates if a string is not empty
 * @param value - Value to validate
 * @returns True if not empty
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validates if a number is positive
 * @param value - Value to validate
 * @returns True if positive
 */
export const isPositive = (value: number): boolean => {
  return value > 0;
};

/**
 * Validates if a value is within a range
 * @param value - Value to validate
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns True if within range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};
