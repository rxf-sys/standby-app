import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Transaction, ExpenseCategory } from '@/types';
import { theme } from '@/theme';
import { formatDate, formatCurrency } from '@/utils';

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: () => void;
}

const getCategoryColor = (category: ExpenseCategory): string => {
  return theme.colors.categories[category] || theme.colors.categories.other;
};

const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    food: 'Essen',
    transport: 'Transport',
    housing: 'Wohnen',
    entertainment: 'Unterhaltung',
    health: 'Gesundheit',
    education: 'Bildung',
    shopping: 'Shopping',
    other: 'Sonstiges',
    salary: 'Gehalt',
    freelance: 'Freiberuflich',
    allowance: 'Taschengeld',
    investment: 'Investition',
  };
  return labels[category] || category;
};

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onPress }) => {
  const Component = onPress ? TouchableOpacity : View as React.ComponentType<any>;

  return (
    <Component style={styles.container} onPress={onPress as any} activeOpacity={0.7}>
      <View
        style={[
          styles.categoryIndicator,
          { backgroundColor: getCategoryColor(transaction.category as ExpenseCategory) },
        ]}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.description}>{transaction.description}</Text>
          <Text
            style={[
              styles.amount,
              {
                color:
                  transaction.type === 'income'
                    ? theme.colors.success
                    : theme.colors.error,
              },
            ]}
          >
            {transaction.type === 'income' ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.category}>{getCategoryLabel(transaction.category)}</Text>
          <Text style={styles.date}>{formatDate(transaction.date)}</Text>
        </View>
      </View>
    </Component>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
    ...theme.shadow.sm,
  },
  categoryIndicator: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  description: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  amount: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  date: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textTertiary,
  },
});
