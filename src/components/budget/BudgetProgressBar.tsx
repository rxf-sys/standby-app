import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import { formatCurrency } from '@/utils';

interface BudgetProgressBarProps {
  label: string;
  current: number;
  limit: number;
  color?: string;
}

export const BudgetProgressBar: React.FC<BudgetProgressBarProps> = ({
  label,
  current,
  limit,
  color = theme.colors.primary,
}) => {
  const percentage = Math.min((current / limit) * 100, 100);
  const isOverBudget = current > limit;

  const getProgressColor = () => {
    if (isOverBudget) return theme.colors.error;
    if (percentage > 80) return theme.colors.warning;
    return color;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.amount, isOverBudget && styles.overBudget]}>
          {formatCurrency(current)} / {formatCurrency(limit)}
        </Text>
      </View>
      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${percentage}%`,
              backgroundColor: getProgressColor(),
            },
          ]}
        />
      </View>
      <Text style={[styles.percentage, isOverBudget && styles.overBudget]}>
        {percentage.toFixed(0)}% {isOverBudget && '(Überschritten)'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  label: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  },
  amount: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  overBudget: {
    color: theme.colors.error,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
  percentage: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
});
