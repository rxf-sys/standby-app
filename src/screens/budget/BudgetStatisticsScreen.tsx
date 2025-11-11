import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { VictoryChart, VictoryLine, VictoryPie, VictoryBar, VictoryAxis, VictoryTheme } from 'victory-native';
import { TrendingUp, DollarSign, PieChart as PieChartIcon } from 'lucide-react-native';
import { BudgetStackParamList } from '@/navigation/types';
import { useTransactions } from '@/hooks/useBudget';
import { theme } from '@/theme';
import { LoadingScreen } from '@/components/common';
import { ProgressBar, Card, Badge, Divider } from '@/components/common';
import {
  calculateMonthlyTrend,
  groupExpensesByCategory,
  getTopSpendingCategories,
  calculateSavingsRate,
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateBalance,
} from '@/utils/statistics';
import { formatCurrency } from '@/utils/currency';

type Props = NativeStackScreenProps<BudgetStackParamList, 'BudgetStatistics'>;

const { width } = Dimensions.get('window');

export const BudgetStatisticsScreen: React.FC<Props> = () => {
  const { data: transactions = [], isLoading } = useTransactions();

  const statistics = useMemo(() => {
    const monthlyTrend = calculateMonthlyTrend(transactions, 6);
    const categoryBreakdown = groupExpensesByCategory(transactions);
    const topCategories = getTopSpendingCategories(transactions, 5);
    const savingsRate = calculateSavingsRate(transactions);
    const totalIncome = calculateTotalIncome(transactions);
    const totalExpenses = calculateTotalExpenses(transactions);
    const balance = calculateBalance(transactions);

    // Prepare data for charts
    const lineChartData = monthlyTrend.map((item, index) => ({
      x: index + 1,
      y: item.balance,
      month: item.month,
    }));

    const pieChartData = Object.entries(categoryBreakdown).map(([category, amount]) => ({
      x: category,
      y: amount,
      label: `${category}\n${formatCurrency(amount)}`,
    }));

    const barChartData = topCategories.map((item) => ({
      x: item.category.substring(0, 10),
      y: item.amount,
    }));

    return {
      monthlyTrend,
      categoryBreakdown,
      topCategories,
      savingsRate,
      totalIncome,
      totalExpenses,
      balance,
      lineChartData,
      pieChartData,
      barChartData,
    };
  }, [transactions]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Summary Cards */}
      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.success + '20' }]}>
            <TrendingUp color={theme.colors.success} size={24} />
          </View>
          <Text style={styles.summaryLabel}>Einnahmen</Text>
          <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
            {formatCurrency(statistics.totalIncome)}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.error + '20' }]}>
            <DollarSign color={theme.colors.error} size={24} />
          </View>
          <Text style={styles.summaryLabel}>Ausgaben</Text>
          <Text style={[styles.summaryValue, { color: theme.colors.error }]}>
            {formatCurrency(statistics.totalExpenses)}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary + '20' }]}>
            <PieChartIcon color={theme.colors.primary} size={24} />
          </View>
          <Text style={styles.summaryLabel}>Bilanz</Text>
          <Text
            style={[
              styles.summaryValue,
              { color: statistics.balance >= 0 ? theme.colors.success : theme.colors.error },
            ]}
          >
            {formatCurrency(statistics.balance)}
          </Text>
        </View>
      </View>

      {/* Savings Rate */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Sparquote</Text>
        <ProgressBar
          value={statistics.savingsRate}
          max={100}
          showPercentage
          color={
            statistics.savingsRate >= 20
              ? theme.colors.success
              : statistics.savingsRate >= 10
              ? theme.colors.warning
              : theme.colors.error
          }
          height={12}
        />
        <Text style={styles.cardSubtext}>
          {statistics.savingsRate >= 20
            ? 'Hervorragend! Du sparst über 20%.'
            : statistics.savingsRate >= 10
            ? 'Gut! Versuche 20% zu erreichen.'
            : 'Versuche mehr zu sparen.'}
        </Text>
      </Card>

      {/* Monthly Trend Chart */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Monatlicher Verlauf (6 Monate)</Text>
        <Text style={styles.cardSubtext}>Bilanz pro Monat</Text>
        {statistics.lineChartData.length > 0 ? (
          <VictoryChart
            width={width - 64}
            height={220}
            theme={VictoryTheme.material}
            padding={{ top: 20, bottom: 40, left: 50, right: 20 }}
          >
            <VictoryAxis
              tickValues={statistics.lineChartData.map((d) => d.x)}
              tickFormat={statistics.monthlyTrend.map((t) => t.month.substring(0, 3))}
              style={{
                tickLabels: { fontSize: 10, fill: theme.colors.textSecondary },
              }}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(x) => `${x >= 0 ? '+' : ''}${x}`}
              style={{
                tickLabels: { fontSize: 10, fill: theme.colors.textSecondary },
              }}
            />
            <VictoryLine
              data={statistics.lineChartData}
              style={{
                data: {
                  stroke: theme.colors.primary,
                  strokeWidth: 3,
                },
              }}
            />
          </VictoryChart>
        ) : (
          <Text style={styles.noDataText}>Keine Daten verfügbar</Text>
        )}
      </Card>

      {/* Category Breakdown Pie Chart */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Ausgaben nach Kategorien</Text>
        {statistics.pieChartData.length > 0 ? (
          <>
            <VictoryPie
              data={statistics.pieChartData}
              width={width - 64}
              height={280}
              colorScale={[
                theme.colors.categoryColors.groceries,
                theme.colors.categoryColors.transportation,
                theme.colors.categoryColors.entertainment,
                theme.colors.categoryColors.utilities,
                theme.colors.categoryColors.healthcare,
                theme.colors.categoryColors.education,
                theme.colors.categoryColors.clothing,
                theme.colors.categoryColors.other,
              ]}
              style={{
                labels: { fontSize: 10, fill: theme.colors.text },
              }}
            />
            <Divider spacing={theme.spacing.sm} />
            <View style={styles.legendContainer}>
              {Object.entries(statistics.categoryBreakdown).map(([category, amount]) => (
                <View key={category} style={styles.legendItem}>
                  <Badge label={category} variant="primary" size="sm" />
                  <Text style={styles.legendValue}>{formatCurrency(amount)}</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <Text style={styles.noDataText}>Keine Ausgaben vorhanden</Text>
        )}
      </Card>

      {/* Top Spending Categories Bar Chart */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Top Ausgabenkategorien</Text>
        {statistics.barChartData.length > 0 ? (
          <VictoryChart
            width={width - 64}
            height={240}
            theme={VictoryTheme.material}
            domainPadding={{ x: 30 }}
            padding={{ top: 20, bottom: 60, left: 60, right: 20 }}
          >
            <VictoryAxis
              tickFormat={statistics.barChartData.map((d) => d.x)}
              style={{
                tickLabels: { fontSize: 9, fill: theme.colors.textSecondary, angle: -45 },
              }}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(x) => `€${x}`}
              style={{
                tickLabels: { fontSize: 10, fill: theme.colors.textSecondary },
              }}
            />
            <VictoryBar
              data={statistics.barChartData}
              style={{
                data: {
                  fill: theme.colors.primary,
                },
              }}
            />
          </VictoryChart>
        ) : (
          <Text style={styles.noDataText}>Keine Ausgaben vorhanden</Text>
        )}
      </Card>

      {/* Monthly Breakdown List */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Monatliche Übersicht</Text>
        {statistics.monthlyTrend.map((month, index) => (
          <View key={index}>
            {index > 0 && <Divider spacing={theme.spacing.sm} />}
            <View style={styles.monthRow}>
              <Text style={styles.monthLabel}>{month.month}</Text>
              <View style={styles.monthValues}>
                <View style={styles.monthValue}>
                  <Text style={styles.monthValueLabel}>Einnahmen:</Text>
                  <Text style={[styles.monthValueAmount, { color: theme.colors.success }]}>
                    {formatCurrency(month.income)}
                  </Text>
                </View>
                <View style={styles.monthValue}>
                  <Text style={styles.monthValueLabel}>Ausgaben:</Text>
                  <Text style={[styles.monthValueAmount, { color: theme.colors.error }]}>
                    {formatCurrency(month.expenses)}
                  </Text>
                </View>
                <View style={styles.monthValue}>
                  <Text style={styles.monthValueLabel}>Bilanz:</Text>
                  <Text
                    style={[
                      styles.monthValueAmount,
                      { color: month.balance >= 0 ? theme.colors.success : theme.colors.error },
                    ]}
                  >
                    {formatCurrency(month.balance)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  summaryCard: {
    width: (width - theme.spacing.md * 3) / 2,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadow.sm,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  summaryValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  card: {
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  cardSubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  noDataText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingVertical: theme.spacing.xl,
  },
  legendContainer: {
    marginTop: theme.spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  legendValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  },
  monthRow: {
    paddingVertical: theme.spacing.sm,
  },
  monthLabel: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  monthValues: {
    gap: theme.spacing.xs,
  },
  monthValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthValueLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  monthValueAmount: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
});
