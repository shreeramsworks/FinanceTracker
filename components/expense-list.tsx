"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useFinance } from "@/contexts/finance-context"

export function ExpenseList() {
  const { transactions } = useFinance()

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {transactions.slice(0, 10).map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <p className="font-medium">{transaction.description}</p>
              <p className="text-sm text-muted-foreground">{transaction.category}</p>
              <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
            </div>
            <p className={cn("font-medium tabular-nums", transaction.amount > 0 ? "text-green-500" : "text-red-500")}>
              {transaction.amount > 0 ? "+" : ""}
              {transaction.amount.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

