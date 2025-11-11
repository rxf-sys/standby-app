import { Transaction, ExpenseCategory, BudgetStats } from '@/types';
import { startOfMonth, endOfMonth, format, eachMonthOfInterval, subMonths } from 'date-fns';

/**
 * Calculates total income from transactions
 */
export const calculateTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
};

/**
 * Calculates total expenses from transactions
 */
export const calculateTotalExpenses = (transactions: Transaction[]): number => {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
};

/**
 * Calculates balance (income - expenses)
 */
export const calculateBalance = (transactions: Transaction[]): number => {
  const income = calculateTotalIncome(transactions);
  const expenses = calculateTotalExpenses(transactions);
  return income - expenses;
};

/**
 * Groups expenses by category
 */
export const groupExpensesByCategory = (
  transactions: Transaction[]
): Record<ExpenseCategory, number> => {
  const expenses = transactions.filter((t) => t.type === 'expense');

  const grouped: Record<string, number> = {};
  expenses.forEach((t) => {
    const category = t.category as string;
    grouped[category] = (grouped[category] || 0) + t.amount;
  });

  return grouped as Record<ExpenseCategory, number>;
};

/**
 * Gets top spending categories
 */
export const getTopSpendingCategories = (
  transactions: Transaction[],
  limit: number = 3
): Array<{ category: ExpenseCategory; amount: number; percentage: number }> => {
  const categoryTotals = groupExpensesByCategory(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);

  const sorted = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category: category as ExpenseCategory,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  return sorted.slice(0, limit);
};

/**
 * Calculates monthly trend data
 */
export const calculateMonthlyTrend = (
  transactions: Transaction[],
  monthsBack: number = 6
): Array<{ month: string; income: number; expenses: number; balance: number }> => {
  const now = new Date();
  const startDate = subMonths(now, monthsBack - 1);
  const months = eachMonthOfInterval({ start: startDate, end: now });

  return months.map((month) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    const monthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    });

    const income = calculateTotalIncome(monthTransactions);
    const expenses = calculateTotalExpenses(monthTransactions);

    return {
      month: format(month, 'MMM yyyy'),
      income,
      expenses,
      balance: income - expenses,
    };
  });
};

/**
 * Calculates average daily spending
 */
export const calculateAverageDailySpending = (transactions: Transaction[]): number => {
  const expenses = transactions.filter((t) => t.type === 'expense');
  if (expenses.length === 0) return 0;

  const totalExpenses = calculateTotalExpenses(expenses);
  const dates = expenses.map((t) => new Date(t.date));
  const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

  const daysDiff = Math.max(
    1,
    Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24))
  );

  return totalExpenses / daysDiff;
};

/**
 * Filters transactions by date range
 */
export const filterTransactionsByDateRange = (
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): Transaction[] => {
  return transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
};

/**
 * Calculates savings rate (income - expenses) / income * 100
 */
export const calculateSavingsRate = (transactions: Transaction[]): number => {
  const income = calculateTotalIncome(transactions);
  if (income === 0) return 0;

  const expenses = calculateTotalExpenses(transactions);
  return ((income - expenses) / income) * 100;
};

/**
 * Generates comprehensive budget statistics
 */
export const generateBudgetStats = (transactions: Transaction[]): BudgetStats => {
  return {
    totalIncome: calculateTotalIncome(transactions),
    totalExpenses: calculateTotalExpenses(transactions),
    balance: calculateBalance(transactions),
    categoryBreakdown: groupExpensesByCategory(transactions),
    monthlyTrend: calculateMonthlyTrend(transactions),
  };
};
