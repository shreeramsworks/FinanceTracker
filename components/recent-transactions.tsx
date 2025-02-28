"use client"

import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useFinance } from "@/contexts/finance-context"
import { formatCurrency } from "@/lib/utils"

export function RecentTransactions() {
  const { transactions, userProfile } = useFinance()

  // Get the 10 most recent transactions
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)

  return (
    <ScrollArea className="h-[350px]">
      <div className="space-y-4">
        {recentTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center">
            <Avatar className="h-9 w-9">
              <div
                className={`h-full w-full rounded-full ${
                  transaction.type === "income" ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{transaction.description}</p>
              <p className="text-sm text-muted-foreground">{transaction.category || transaction.type}</p>
              <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
            </div>
            <div className={`ml-auto font-medium ${transaction.type === "income" ? "text-green-500" : "text-red-500"}`}>
              {formatCurrency(Math.abs(transaction.amount), userProfile.currency)}
            </div>
          </div>
        ))}
        {recentTransactions.length === 0 && (
          <div className="text-center text-muted-foreground py-8">No transactions yet</div>
        )}
      </div>
    </ScrollArea>
  )
}

