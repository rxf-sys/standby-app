export type ActiveTheme = 'light' | 'dark';

const lightColors = {
  // Primary colors
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',

  // Secondary colors
  secondary: '#10B981',
  secondaryLight: '#34D399',
  secondaryDark: '#059669',

  // Accent colors
  accent: '#F59E0B',
  accentLight: '#FBBF24',
  accentDark: '#D97706',

  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Neutral colors
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceSecondary: '#F3F4F6',

  // Text colors
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',

  // Border colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderDark: '#D1D5DB',

  // Category colors (for budget & expenses)
  categories: {
    food: '#F59E0B',
    transport: '#3B82F6',
    housing: '#8B5CF6',
    entertainment: '#EC4899',
    health: '#10B981',
    education: '#6366F1',
    shopping: '#EF4444',
    other: '#6B7280',
  },
};

const darkColors = {
  // Primary colors
  primary: '#818CF8',
  primaryLight: '#A5B4FC',
  primaryDark: '#6366F1',

  // Secondary colors
  secondary: '#34D399',
  secondaryLight: '#6EE7B7',
  secondaryDark: '#10B981',

  // Accent colors
  accent: '#FBBF24',
  accentLight: '#FCD34D',
  accentDark: '#F59E0B',

  // Status colors
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',

  // Neutral colors (dark theme)
  background: '#111827',
  backgroundSecondary: '#1F2937',
  surface: '#1F2937',
  surfaceSecondary: '#374151',

  // Text colors
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  textInverse: '#111827',

  // Border colors
  border: '#374151',
  borderLight: '#4B5563',
  borderDark: '#6B7280',

  // Category colors (same in dark mode but slightly adjusted)
  categories: {
    food: '#FBBF24',
    transport: '#60A5FA',
    housing: '#A78BFA',
    entertainment: '#F472B6',
    health: '#34D399',
    education: '#818CF8',
    shopping: '#F87171',
    other: '#9CA3AF',
  },
};

export const getColors = (theme: ActiveTheme = 'light') => {
  return theme === 'dark' ? darkColors : lightColors;
};

// Default export for backward compatibility
export const colors = lightColors;
