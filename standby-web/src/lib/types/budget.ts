export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'housing'
  | 'entertainment'
  | 'health'
  | 'education'
  | 'shopping'
  | 'other'

export type IncomeSource =
  | 'salary'
  | 'freelance'
  | 'allowance'
  | 'investment'
  | 'other'

export interface Transaction {
  id: string
  userId: string
  type: 'income' | 'expense'
  amount: number
  category: ExpenseCategory | IncomeSource
  description: string
  date: string
  createdAt: string
  updatedAt: string
}

export interface Budget {
  id: string
  userId: string
  category: ExpenseCategory
  limit: number
  period: 'weekly' | 'monthly'
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
}

export interface SavingsGoal {
  id: string
  userId: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  createdAt: string
  updatedAt: string
}

export interface BudgetStats {
  totalIncome: number
  totalExpenses: number
  balance: number
  categoryBreakdown: Record<ExpenseCategory, number>
  monthlyTrend: Array<{
    month: string
    income: number
    expenses: number
  }>
}
