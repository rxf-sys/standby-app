import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_TOKEN: '@standby/user_token',
  USER_ID: '@standby/user_id',
  USER_PREFERENCES: '@standby/user_preferences',
  THEME: '@standby/theme',
  ONBOARDING_COMPLETED: '@standby/onboarding_completed',
} as const;

/**
 * Saves a value to AsyncStorage
 * @param key - Storage key
 * @param value - Value to save
 */
export const saveItem = async <T>(key: string, value: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error saving to AsyncStorage:', error);
    throw error;
  }
};

/**
 * Gets a value from AsyncStorage
 * @param key - Storage key
 * @returns Parsed value or null if not found
 */
export const getItem = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error reading from AsyncStorage:', error);
    return null;
  }
};

/**
 * Removes a value from AsyncStorage
 * @param key - Storage key
 */
export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from AsyncStorage:', error);
    throw error;
  }
};

/**
 * Clears all items from AsyncStorage
 */
export const clearAll = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
    throw error;
  }
};

// Convenience functions for common storage operations

export const saveUserToken = (token: string) => saveItem(STORAGE_KEYS.USER_TOKEN, token);
export const getUserToken = () => getItem<string>(STORAGE_KEYS.USER_TOKEN);
export const removeUserToken = () => removeItem(STORAGE_KEYS.USER_TOKEN);

export const saveUserId = (userId: string) => saveItem(STORAGE_KEYS.USER_ID, userId);
export const getUserId = () => getItem<string>(STORAGE_KEYS.USER_ID);
export const removeUserId = () => removeItem(STORAGE_KEYS.USER_ID);

export const saveUserPreferences = (preferences: Record<string, unknown>) =>
  saveItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
export const getUserPreferences = () => getItem<Record<string, unknown>>(STORAGE_KEYS.USER_PREFERENCES);

export const saveTheme = (theme: 'light' | 'dark' | 'system') => saveItem(STORAGE_KEYS.THEME, theme);
export const getTheme = () => getItem<'light' | 'dark' | 'system'>(STORAGE_KEYS.THEME);

export const setOnboardingCompleted = () => saveItem(STORAGE_KEYS.ONBOARDING_COMPLETED, true);
export const isOnboardingCompleted = () => getItem<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETED);

export { STORAGE_KEYS };
