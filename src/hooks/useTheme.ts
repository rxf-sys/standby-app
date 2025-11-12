import { useMemo, useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { getColors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export const useTheme = () => {
  const { activeTheme, themeMode, useDynamicColors, setThemeMode, setUseDynamicColors, initTheme } =
    useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  const theme = useMemo(() => {
    const colors = getColors(activeTheme);

    return {
      colors,
      spacing,
      borderRadius,
      typography,
      activeTheme,
      themeMode,
      useDynamicColors,

      // Shadows
      shadow: {
        sm: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: activeTheme === 'dark' ? 0.3 : 0.05,
          shadowRadius: 2,
          elevation: 1,
        },
        md: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: activeTheme === 'dark' ? 0.4 : 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        lg: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: activeTheme === 'dark' ? 0.5 : 0.15,
          shadowRadius: 8,
          elevation: 5,
        },
      },
    };
  }, [activeTheme, themeMode, useDynamicColors]);

  return {
    theme,
    setThemeMode,
    setUseDynamicColors,
  };
};
