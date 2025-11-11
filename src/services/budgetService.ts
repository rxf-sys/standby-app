import { supabase } from './supabase';
import { Transaction, Budget, SavingsGoal } from '@/types';

export const budgetService = {
  // Transactions
  async getTransactions(userId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('userId', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data as Transaction[];
  },

  async getTransactionById(id: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Transaction;
  },

  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();

    if (error) throw error;
    return data as Transaction;
  },

  async updateTransaction(id: string, updates: Partial<Transaction>) {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Transaction;
  },

  async deleteTransaction(id: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Budgets
  async getBudgets(userId: string) {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('userId', userId);

    if (error) throw error;
    return data as Budget[];
  },

  async createBudget(budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('budgets')
      .insert(budget)
      .select()
      .single();

    if (error) throw error;
    return data as Budget;
  },

  // Savings Goals
  async getSavingsGoals(userId: string) {
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('userId', userId);

    if (error) throw error;
    return data as SavingsGoal[];
  },

  async createSavingsGoal(goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('savings_goals')
      .insert(goal)
      .select()
      .single();

    if (error) throw error;
    return data as SavingsGoal;
  },

  async updateSavingsGoal(id: string, updates: Partial<SavingsGoal>) {
    const { data, error } = await supabase
      .from('savings_goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as SavingsGoal;
  },
};
