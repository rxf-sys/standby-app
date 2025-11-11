import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Plus, TrendingUp, TrendingDown, Target, BarChart3 } from 'lucide-react-native';
import { BudgetStackParamList } from '@/navigation/types';
import { Card, LoadingScreen } from '@/components/common';
import { useBudgetStore } from '@/store/budgetStore';
import { budgetService } from '@/services/budgetService';
import { theme } from '@/theme';
import { ExpenseCategory } from '@/types';

type Props = NativeStackScreenProps<BudgetStackParamList, 'BudgetOverview'>;

export const BudgetOverviewScreen: React.FC<Props> = ({ navigation }) => {
  const { transactions, setTransactions } = useBudgetStore();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Mock user ID - in production, get from auth
      const userId = 'mock-user-id';
      const data = await budgetService.getTransactions(userId);
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expenses,
      balance: income - expenses,
    };
  };

  const getCategoryColor = (category: ExpenseCategory): string => {
    return theme.colors.categories[category] || theme.colors.categories.other;
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const stats = calculateStats();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <Card style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Aktueller Saldo</Text>
          <Text style={[
            styles.balanceAmount,
            { color: stats.balance >= 0 ? theme.colors.success : theme.colors.error }
          ]}>
            {stats.balance.toFixed(2)} €
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <TrendingUp color={theme.colors.success} size={20} />
              <Text style={styles.statLabel}>Einnahmen</Text>
              <Text style={styles.statValue}>{stats.income.toFixed(2)} €</Text>
            </View>
            <View style={styles.statItem}>
              <TrendingDown color={theme.colors.error} size={20} />
              <Text style={styles.statLabel}>Ausgaben</Text>
              <Text style={styles.statValue}>{stats.expenses.toFixed(2)} €</Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
            onPress={() => navigation.navigate('AddTransaction', { type: 'income' })}
          >
            <Plus color={theme.colors.textInverse} size={24} />
            <Text style={styles.actionButtonText}>Einnahme</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
            onPress={() => navigation.navigate('AddTransaction', { type: 'expense' })}
          >
            <Plus color={theme.colors.textInverse} size={24} />
            <Text style={styles.actionButtonText}>Ausgabe</Text>
          </TouchableOpacity>
        </View>

        {/* Savings Goals Button */}
        <TouchableOpacity
          style={styles.savingsGoalsButton}
          onPress={() => navigation.navigate('SavingsGoals')}
        >
          <Target color={theme.colors.primary} size={20} />
          <Text style={styles.savingsGoalsText}>Meine Sparziele</Text>
        </TouchableOpacity>

        {/* Statistics Button */}
        <TouchableOpacity
          style={styles.statisticsButton}
          onPress={() => navigation.navigate('BudgetStatistics')}
        >
          <BarChart3 color={theme.colors.secondary} size={20} />
          <Text style={styles.statisticsText}>Statistiken</Text>
        </TouchableOpacity>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Letzte Transaktionen</Text>
          {transactions.length === 0 ? (
            <Card>
              <Text style={styles.emptyText}>
                Noch keine Transaktionen. Füge deine erste Transaktion hinzu!
              </Text>
            </Card>
          ) : (
            transactions.slice(0, 10).map((transaction) => (
              <Card key={transaction.id} style={styles.transactionCard}>
                <View style={styles.transactionHeader}>
                  <View
                    style={[
                      styles.categoryIndicator,
                      { backgroundColor: getCategoryColor(transaction.category as ExpenseCategory) },
                    ]}
                  />
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionDescription}>
                      {transaction.description}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {new Date(transaction.date).toLocaleDateString('de-DE')}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.transactionAmount,
                      {
                        color:
                          transaction.type === 'income'
                            ? theme.colors.success
                            : theme.colors.error,
                      },
                    ]}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {transaction.amount.toFixed(2)} €
                  </Text>
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  balanceCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  balanceLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  balanceAmount: {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.xl,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  statValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginVertical: theme.spacing.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  actionButtonText: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  savingsGoalsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  savingsGoalsText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  statisticsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  statisticsText: {
    color: theme.colors.secondary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  transactionCard: {
    marginBottom: theme.spacing.sm,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIndicator: {
    width: 4,
    height: '100%',
    borderRadius: theme.borderRadius.xs,
    marginRight: theme.spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  transactionDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  transactionAmount: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
