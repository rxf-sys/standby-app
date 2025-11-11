import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateBalance,
  groupExpensesByCategory,
  calculateSavingsRate,
} from '../statistics';
import { Transaction } from '@/types';

const mockTransactions: Transaction[] = [
  {
    id: '1',
    userId: 'user-1',
    type: 'income',
    amount: 1000,
    category: 'salary',
    description: 'Monthly salary',
    date: '2024-01-15',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    userId: 'user-1',
    type: 'expense',
    amount: 200,
    category: 'food',
    description: 'Groceries',
    date: '2024-01-16',
    createdAt: '2024-01-16',
    updatedAt: '2024-01-16',
  },
  {
    id: '3',
    userId: 'user-1',
    type: 'expense',
    amount: 100,
    category: 'transport',
    description: 'Gas',
    date: '2024-01-17',
    createdAt: '2024-01-17',
    updatedAt: '2024-01-17',
  },
];

describe('Statistics Utils', () => {
  describe('calculateTotalIncome', () => {
    it('should calculate total income correctly', () => {
      expect(calculateTotalIncome(mockTransactions)).toBe(1000);
    });

    it('should return 0 for empty array', () => {
      expect(calculateTotalIncome([])).toBe(0);
    });
  });

  describe('calculateTotalExpenses', () => {
    it('should calculate total expenses correctly', () => {
      expect(calculateTotalExpenses(mockTransactions)).toBe(300);
    });

    it('should return 0 for empty array', () => {
      expect(calculateTotalExpenses([])).toBe(0);
    });
  });

  describe('calculateBalance', () => {
    it('should calculate balance correctly', () => {
      expect(calculateBalance(mockTransactions)).toBe(700);
    });

    it('should return 0 for empty array', () => {
      expect(calculateBalance([])).toBe(0);
    });
  });

  describe('groupExpensesByCategory', () => {
    it('should group expenses by category', () => {
      const grouped = groupExpensesByCategory(mockTransactions);
      expect(grouped['food']).toBe(200);
      expect(grouped['transport']).toBe(100);
    });
  });

  describe('calculateSavingsRate', () => {
    it('should calculate savings rate correctly', () => {
      const rate = calculateSavingsRate(mockTransactions);
      expect(rate).toBe(70); // (1000 - 300) / 1000 * 100 = 70%
    });

    it('should return 0 when no income', () => {
      const onlyExpenses = mockTransactions.filter((t) => t.type === 'expense');
      expect(calculateSavingsRate(onlyExpenses)).toBe(0);
    });
  });
});
