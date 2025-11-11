import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@/theme';

interface DividerProps {
  style?: ViewStyle;
  vertical?: boolean;
  thickness?: number;
  spacing?: number;
}

export const Divider: React.FC<DividerProps> = ({
  style,
  vertical = false,
  thickness = 1,
  spacing = theme.spacing.md,
}) => {
  return (
    <View
      style={[
        styles.divider,
        vertical ? styles.vertical : styles.horizontal,
        {
          [vertical ? 'width' : 'height']: thickness,
          [vertical ? 'marginHorizontal' : 'marginVertical']: spacing,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    backgroundColor: theme.colors.border,
  },
  horizontal: {
    width: '100%',
  },
  vertical: {
    height: '100%',
  },
});
