import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { theme } from '@/theme';

interface InfoBoxProps {
  icon?: LucideIcon;
  title: string;
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
}

export const InfoBox: React.FC<InfoBoxProps> = ({
  icon: Icon,
  title,
  message,
  variant = 'info',
}) => {
  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      default:
        return theme.colors.info;
    }
  };

  const color = getVariantColor();

  return (
    <View style={[styles.container, { backgroundColor: color + '15', borderLeftColor: color }]}>
      {Icon && (
        <View style={styles.iconContainer}>
          <Icon color={color} size={20} />
        </View>
      )}
      <View style={styles.content}>
        <Text style={[styles.title, { color }]}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    marginVertical: theme.spacing.sm,
  },
  iconContainer: {
    marginRight: theme.spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing.xs,
  },
  message: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.sm,
  },
});
