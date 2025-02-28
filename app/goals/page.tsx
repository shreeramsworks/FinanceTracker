import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GoalForm } from "@/components/goal-form"
import { GoalList } from "@/components/goal-list"

export default function GoalsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Financial Goals</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Create New Goal</CardTitle>
            <CardDescription>Set a SMART financial goal</CardDescription>
          </CardHeader>
          <CardContent>
            <GoalForm />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Your Goals</CardTitle>
            <CardDescription>Track your progress</CardDescription>
          </CardHeader>
          <CardContent>
            <GoalList />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

