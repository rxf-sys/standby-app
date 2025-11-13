'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { useAuthStore, useBudgetStore } from '@/lib/store'
import { budgetService } from '@/lib/services/budget.service'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function BudgetPage() {
  const user = useAuthStore((state) => state.user)
  const { transactions, setTransactions } = useBudgetStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTransactions = async () => {
      if (!user) return

      try {
        const data = await budgetService.getTransactions(user.id)
        setTransactions(data)
      } catch (error) {
        console.error('Error loading transactions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTransactions()
  }, [user, setTransactions])

  const calculateStats = () => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      income,
      expenses,
      balance: income - expenses,
    }
  }

  const stats = calculateStats()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Budget</h1>
          <p className="text-muted-foreground mt-2">
            Verwalte deine Finanzen und erreiche deine Ziele
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Einnahme
          </Button>
          <Button variant="destructive">
            <Plus className="mr-2 h-4 w-4" />
            Ausgabe
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Aktueller Saldo</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-success' : 'text-destructive'}`}
            >
              {formatCurrency(stats.balance)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Differenz zwischen Einnahmen und Ausgaben
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Einnahmen</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(stats.income)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Gesamt {transactions.filter((t) => t.type === 'income').length} Transaktionen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ausgaben</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(stats.expenses)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Gesamt {transactions.filter((t) => t.type === 'expense').length} Transaktionen
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Letzte Transaktionen</CardTitle>
          <CardDescription>
            {transactions.length > 0
              ? `Deine letzten ${Math.min(transactions.length, 10)} Transaktionen`
              : 'Noch keine Transaktionen vorhanden'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Keine Transaktionen</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Füge deine erste Einnahme oder Ausgabe hinzu, um zu beginnen.
              </p>
              <div className="mt-6 flex gap-2 justify-center">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Einnahme hinzufügen
                </Button>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Ausgabe hinzufügen
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.slice(0, 10).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-2 h-12 rounded-full ${transaction.type === 'income' ? 'bg-success' : 'bg-destructive'}`}
                    />
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transaction.date)} • {transaction.category}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-lg font-semibold ${transaction.type === 'income' ? 'text-success' : 'text-destructive'}`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
