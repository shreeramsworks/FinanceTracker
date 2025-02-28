"use client"

import { Progress } from "@/components/ui/progress"
import { useFinance } from "@/contexts/finance-context"

export function BudgetProgress() {
  const { budgets } = useFinance()

  return (
    <div className="space-y-4">
      {budgets.map((budget) => {
        const percentage = (budget.spent / budget.amount) * 100
        return (
          <div key={budget.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{budget.category}</p>
                <p className="text-xs text-muted-foreground">
                  ${budget.spent.toFixed(2)} of ${budget.amount}
                </p>
              </div>
              <p className="text-sm font-medium">{Math.round(percentage)}%</p>
            </div>
            <Progress value={percentage} />
          </div>
        )
      })}
    </div>
  )
}

