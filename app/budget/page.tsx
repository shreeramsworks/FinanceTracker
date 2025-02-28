import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BudgetForm } from "@/components/budget-form"
import { BudgetList } from "@/components/budget-list"

export default function BudgetPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Budget Management</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Create Budget</CardTitle>
            <CardDescription>Set a new budget category</CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetForm />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Budget Categories</CardTitle>
            <CardDescription>Manage your budget categories</CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetList />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

