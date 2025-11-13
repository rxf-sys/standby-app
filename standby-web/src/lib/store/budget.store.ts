import { create } from 'zustand'
import { Transaction, Budget, SavingsGoal } from '@/lib/types'

interface BudgetState {
  transactions: Transaction[]
  budgets: Budget[]
  savingsGoals: SavingsGoal[]
  setTransactions: (transactions: Transaction[]) => void
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  setBudgets: (budgets: Budget[]) => void
  setSavingsGoals: (goals: SavingsGoal[]) => void
  updateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => void
}

export const useBudgetStore = create<BudgetState>((set) => ({
  transactions: [],
  budgets: [],
  savingsGoals: [],

  setTransactions: (transactions) => set({ transactions }),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),

  updateTransaction: (id, updates) =>
    set((state) => ({
      transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),

  setBudgets: (budgets) => set({ budgets }),

  setSavingsGoals: (savingsGoals) => set({ savingsGoals }),

  updateSavingsGoal: (id, updates) =>
    set((state) => ({
      savingsGoals: state.savingsGoals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    })),
}))
