import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetService } from '@/services/budgetService';
import { useBudgetStore } from '@/store/budgetStore';
import { Transaction, Budget, SavingsGoal } from '@/types';

const QUERY_KEYS = {
  transactions: (userId: string) => ['transactions', userId],
  budgets: (userId: string) => ['budgets', userId],
  savingsGoals: (userId: string) => ['savingsGoals', userId],
};

// Transactions
export const useTransactions = (userId: string) => {
  const { setTransactions } = useBudgetStore();

  return useQuery({
    queryKey: QUERY_KEYS.transactions(userId),
    queryFn: async () => {
      const data = await budgetService.getTransactions(userId);
      setTransactions(data);
      return data;
    },
    staleTime: 30000, // 30 seconds
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const { addTransaction } = useBudgetStore();

  return useMutation({
    mutationFn: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) =>
      budgetService.createTransaction(transaction),
    onSuccess: (data) => {
      addTransaction(data);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  const { updateTransaction } = useBudgetStore();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Transaction> }) =>
      budgetService.updateTransaction(id, updates),
    onSuccess: (data) => {
      updateTransaction(data.id, data);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  const { deleteTransaction } = useBudgetStore();

  return useMutation({
    mutationFn: (id: string) => budgetService.deleteTransaction(id),
    onSuccess: (_, id) => {
      deleteTransaction(id);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

// Budgets
export const useBudgets = (userId: string) => {
  const { setBudgets } = useBudgetStore();

  return useQuery({
    queryKey: QUERY_KEYS.budgets(userId),
    queryFn: async () => {
      const data = await budgetService.getBudgets(userId);
      setBudgets(data);
      return data;
    },
  });
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) =>
      budgetService.createBudget(budget),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
};

// Savings Goals
export const useSavingsGoals = (userId: string) => {
  const { setSavingsGoals } = useBudgetStore();

  return useQuery({
    queryKey: QUERY_KEYS.savingsGoals(userId),
    queryFn: async () => {
      const data = await budgetService.getSavingsGoals(userId);
      setSavingsGoals(data);
      return data;
    },
  });
};

export const useCreateSavingsGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt'>) =>
      budgetService.createSavingsGoal(goal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
    },
  });
};

export const useUpdateSavingsGoal = () => {
  const queryClient = useQueryClient();
  const { updateSavingsGoal } = useBudgetStore();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<SavingsGoal> }) =>
      budgetService.updateSavingsGoal(id, updates),
    onSuccess: (data) => {
      updateSavingsGoal(data.id, data);
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
    },
  });
};
