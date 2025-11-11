import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Target } from 'lucide-react-native';
import { Card } from '@/components/common';
import { SavingsGoal } from '@/types';
import { theme } from '@/theme';
import { formatCurrency, formatDate } from '@/utils';

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onPress?: () => void;
}

export const SavingsGoalCard: React.FC<SavingsGoalCardProps> = ({ goal, onPress }) => {
  const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const remaining = goal.targetAmount - goal.currentAmount;

  return (
    <Card style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Target color={theme.colors.primary} size={24} />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{goal.name}</Text>
          <Text style={styles.date}>Ziel: {formatDate(goal.targetDate)}</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${percentage}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.percentage}>{percentage.toFixed(0)}%</Text>
      </View>

      <View style={styles.amountsRow}>
        <View style={styles.amountItem}>
          <Text style={styles.amountLabel}>Gespart</Text>
          <Text style={styles.amountValue}>{formatCurrency(goal.currentAmount)}</Text>
        </View>
        <View style={styles.amountItem}>
          <Text style={styles.amountLabel}>Ziel</Text>
          <Text style={styles.amountValue}>{formatCurrency(goal.targetAmount)}</Text>
        </View>
        <View style={styles.amountItem}>
          <Text style={styles.amountLabel}>Noch fehlt</Text>
          <Text style={[styles.amountValue, styles.remainingAmount]}>
            {formatCurrency(remaining)}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  date: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  progressSection: {
    marginBottom: theme.spacing.md,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
  },
  percentage: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'right',
  },
  amountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amountItem: {
    flex: 1,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  amountValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  remainingAmount: {
    color: theme.colors.primary,
  },
});
