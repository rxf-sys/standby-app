import { supabase } from './supabase'
import { Transaction, Budget, SavingsGoal } from '@/lib/types'

export const budgetService = {
  // Transactions
  async getTransactions(userId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (error) throw error

    // Map database fields to camelCase
    return (data || []).map((item: any) => ({
      id: item.id,
      userId: item.user_id,
      type: item.type,
      amount: parseFloat(item.amount),
      category: item.category,
      description: item.description || item.title,
      date: item.date,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    })) as Transaction[]
  },

  async getTransactionById(id: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return {
      id: data.id,
      userId: data.user_id,
      type: data.type,
      amount: parseFloat(data.amount),
      category: data.category,
      description: data.description || data.title,
      date: data.date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as Transaction
  },

  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: transaction.userId,
        title: transaction.description,
        description: transaction.description,
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        date: transaction.date,
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      userId: data.user_id,
      type: data.type,
      amount: parseFloat(data.amount),
      category: data.category,
      description: data.description || data.title,
      date: data.date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as Transaction
  },

  async updateTransaction(id: string, updates: Partial<Transaction>) {
    const dbUpdates: any = {
      updated_at: new Date().toISOString(),
    }

    if (updates.description) {
      dbUpdates.title = updates.description
      dbUpdates.description = updates.description
    }
    if (updates.amount !== undefined) dbUpdates.amount = updates.amount
    if (updates.category) dbUpdates.category = updates.category
    if (updates.type) dbUpdates.type = updates.type
    if (updates.date) dbUpdates.date = updates.date

    const { data, error } = await supabase
      .from('transactions')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      userId: data.user_id,
      type: data.type,
      amount: parseFloat(data.amount),
      category: data.category,
      description: data.description || data.title,
      date: data.date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as Transaction
  },

  async deleteTransaction(id: string) {
    const { error } = await supabase.from('transactions').delete().eq('id', id)

    if (error) throw error
  },

  // Budgets
  async getBudgets(userId: string) {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error

    return (data || []).map((item: any) => ({
      id: item.id,
      userId: item.user_id,
      category: item.category,
      limit: parseFloat(item.amount),
      period: item.period,
      startDate: item.start_date,
      endDate: item.end_date,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    })) as Budget[]
  },

  async createBudget(budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('budgets')
      .insert({
        user_id: budget.userId,
        category: budget.category,
        amount: budget.limit,
        period: budget.period,
        start_date: budget.startDate,
        end_date: budget.endDate,
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      userId: data.user_id,
      category: data.category,
      limit: parseFloat(data.amount),
      period: data.period,
      startDate: data.start_date,
      endDate: data.end_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as Budget
  },

  // Savings Goals
  async getSavingsGoals(userId: string) {
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error

    return (data || []).map((item: any) => ({
      id: item.id,
      userId: item.user_id,
      name: item.name,
      targetAmount: parseFloat(item.target_amount),
      currentAmount: parseFloat(item.current_amount),
      targetDate: item.target_date,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    })) as SavingsGoal[]
  },

  async createSavingsGoal(goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('savings_goals')
      .insert({
        user_id: goal.userId,
        name: goal.name,
        target_amount: goal.targetAmount,
        current_amount: goal.currentAmount,
        target_date: goal.targetDate,
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      targetAmount: parseFloat(data.target_amount),
      currentAmount: parseFloat(data.current_amount),
      targetDate: data.target_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as SavingsGoal
  },

  async updateSavingsGoal(id: string, updates: Partial<SavingsGoal>) {
    const dbUpdates: any = {
      updated_at: new Date().toISOString(),
    }

    if (updates.name) dbUpdates.name = updates.name
    if (updates.targetAmount !== undefined) dbUpdates.target_amount = updates.targetAmount
    if (updates.currentAmount !== undefined) dbUpdates.current_amount = updates.currentAmount
    if (updates.targetDate) dbUpdates.target_date = updates.targetDate

    const { data, error } = await supabase
      .from('savings_goals')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      targetAmount: parseFloat(data.target_amount),
      currentAmount: parseFloat(data.current_amount),
      targetDate: data.target_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as SavingsGoal
  },

  async deleteSavingsGoal(id: string) {
    const { error } = await supabase.from('savings_goals').delete().eq('id', id)

    if (error) throw error
  },
}
