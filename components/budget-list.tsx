"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { useFinance } from "@/contexts/finance-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit2, Save, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

export function BudgetList() {
  const { budgets, updateBudget, deleteBudget, userProfile } = useFinance()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editAmount, setEditAmount] = useState<string>("")
  const { toast } = useToast()

  const handleEdit = (budget: { id: string; amount: number }) => {
    setEditingId(budget.id)
    setEditAmount(budget.amount.toString())
  }

  const handleSave = (id: string) => {
    updateBudget(id, { amount: Number(editAmount) })
    setEditingId(null)
    toast({
      title: "Budget updated",
      description: "Your budget category has been updated successfully.",
    })
  }

  const handleDelete = (id: string) => {
    deleteBudget(id)
    toast({
      title: "Budget deleted",
      description: "Your budget category has been deleted.",
      variant: "destructive",
    })
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.amount) * 100
          const isOverBudget = percentage > 100

          return (
            <div key={budget.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{budget.category}</p>
                  {editingId === budget.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="h-7 w-32"
                      />
                      <Button size="sm" variant="outline" onClick={() => handleSave(budget.id)}>
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(budget.spent, userProfile.currency)} of{" "}
                        {formatCurrency(budget.amount, userProfile.currency)}
                      </p>
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(budget)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(budget.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium">{Math.round(percentage)}%</p>
              </div>
              <Progress value={percentage} className={isOverBudget ? "text-red-500" : undefined} />
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}

