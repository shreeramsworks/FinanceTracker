"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFinance } from "@/contexts/finance-context"
import { formatCurrency } from "@/lib/utils"

export function FinanceOverview() {
  const { userProfile, transactions } = useFinance()

  // Calculate total income and expenses for the current month
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const monthlyTransactions = transactions.filter((transaction) => {
    const date = new Date(transaction.date)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  })

  const monthlyIncome = monthlyTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const monthlyExpenses = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(userProfile.totalBalance, userProfile.currency)}</div>
          <p className="text-xs text-muted-foreground">Your current total balance</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(monthlyIncome, userProfile.currency)}</div>
          <p className="text-xs text-muted-foreground">Income this month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(monthlyExpenses, userProfile.currency)}</div>
          <p className="text-xs text-muted-foreground">Expenses this month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{savingsRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">Of monthly income</p>
        </CardContent>
      </Card>
    </div>
  )
}

