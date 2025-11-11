import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '@/theme';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
}) => {
  const badgeStyles = [
    styles.badge,
    styles[variant],
    styles[size],
    style,
  ];

  const labelStyles = [
    styles.text,
    styles[`text_${size}`],
    textStyle,
  ];

  return (
    <View style={badgeStyles}>
      <Text style={labelStyles}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
  },

  // Variants
  primary: {
    backgroundColor: theme.colors.primary + '20',
  },
  secondary: {
    backgroundColor: theme.colors.secondary + '20',
  },
  success: {
    backgroundColor: theme.colors.success + '20',
  },
  warning: {
    backgroundColor: theme.colors.warning + '20',
  },
  error: {
    backgroundColor: theme.colors.error + '20',
  },
  info: {
    backgroundColor: theme.colors.info + '20',
  },

  // Sizes
  sm: {
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
  },
  md: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  lg: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },

  // Text styles
  text: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary,
  },
  text_sm: {
    fontSize: theme.typography.fontSize.xs,
  },
  text_md: {
    fontSize: theme.typography.fontSize.sm,
  },
  text_lg: {
    fontSize: theme.typography.fontSize.md,
  },
});
