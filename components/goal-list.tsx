"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { useFinance } from "@/contexts/finance-context"
import { Button } from "@/components/ui/button"
import { Check, Award, Bell, Calendar, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState, useEffect, useCallback } from "react"
import { toast } from "@/components/ui/use-toast"

export function GoalList() {
  const { goals, updateGoalProgress, updateGoal } = useFinance()
  const [showCelebration, setShowCelebration] = useState<string | null>(null)

  const calculateTimeProgress = (deadline: string, createdAt: string) => {
    const total = new Date(deadline).getTime() - new Date(createdAt).getTime()
    const current = Date.now() - new Date(createdAt).getTime()
    return Math.min(100, (current / total) * 100)
  }

  const getTimeStatus = useCallback((deadline: string) => {
    const daysLeft = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

    if (daysLeft < 0) return { status: "overdue", text: "Overdue", icon: AlertTriangle, color: "text-red-500" }
    if (daysLeft < 7) return { status: "urgent", text: `${daysLeft} days left`, icon: Bell, color: "text-amber-500" }
    if (daysLeft < 30)
      return { status: "approaching", text: `${daysLeft} days left`, icon: Calendar, color: "text-blue-500" }
    return { status: "on-track", text: `${daysLeft} days left`, icon: Calendar, color: "text-green-500" }
  }, [])

  const handleMilestoneComplete = (goalId: string, index: number) => {
    updateGoalProgress(goalId, index)

    // Show celebration and toast
    setShowCelebration(goalId)
    toast({
      title: "Milestone completed! 🎉",
      description: "You're making great progress toward your goal!",
    })

    setTimeout(() => setShowCelebration(null), 3000)
  }

  const handleGoalComplete = (goalId: string) => {
    updateGoal(goalId, {
      currentAmount: goals.find((g) => g.id === goalId)?.targetAmount || 0,
      completed: true,
    })
    toast({
      title: "Goal completed! 🎉",
      description: "Congratulations on achieving your financial goal!",
    })
    setShowCelebration(goalId)
    setTimeout(() => setShowCelebration(null), 3000)
  }

  // Check for goals nearing deadline
  useEffect(() => {
    goals.forEach((goal) => {
      const { status } = getTimeStatus(goal.deadline)
      if (status === "urgent" && !goal.notified) {
        toast({
          title: "Goal deadline approaching!",
          description: `Your goal "${goal.title}" is due soon. Take action now!`,
          variant: "destructive",
        })
        updateGoal(goal.id, { notified: true })
      }
    })
  }, [goals, getTimeStatus, updateGoal])

  const getGoalTypeIcon = (type: string) => {
    switch (type) {
      case "savings":
        return "💰"
      case "debt":
        return "💳"
      case "investment":
        return "📈"
      case "purchase":
        return "🛒"
      case "vacation":
        return "✈️"
      case "education":
        return "🎓"
      case "retirement":
        return "🏖️"
      case "emergency":
        return "🚨"
      case "home":
        return "🏠"
      case "vehicle":
        return "🚗"
      case "wedding":
        return "💍"
      case "business":
        return "💼"
      default:
        return "🎯"
    }
  }

  return (
    <TooltipProvider>
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-8">
          {goals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No goals yet. Create your first financial goal!
            </div>
          ) : (
            goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100
              const timeProgress = calculateTimeProgress(goal.deadline, goal.createdAt)
              const timeStatus = getTimeStatus(goal.deadline)
              const completedMilestones = goal.milestones.filter((m) => m.completed).length
              const totalMilestones = goal.milestones.length
              const milestoneProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0

              return (
                <div
                  key={goal.id}
                  className={`space-y-4 p-4 border rounded-lg ${showCelebration === goal.id ? "bg-yellow-50 animate-pulse" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl" aria-hidden="true">
                        {getGoalTypeIcon(goal.type)}
                      </span>
                      <div>
                        <h3 className="font-semibold">{goal.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Target: ${goal.targetAmount.toLocaleString()} by{" "}
                          {new Date(goal.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={goal.completed ? "default" : "outline"}
                        size="sm"
                        onClick={() => !goal.completed && handleGoalComplete(goal.id)}
                        className={`${goal.completed ? "bg-green-500 hover:bg-green-600" : ""}`}
                      >
                        <Check className="h-4 w-4" />
                        {goal.completed ? "Completed" : "Mark Complete"}
                      </Button>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          goal.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : goal.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {goal.priority}
                      </span>

                      {progress >= 100 && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="bg-green-50 border-green-200">
                              <Award className="h-4 w-4 text-green-500 mr-1" />
                              Achieved!
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Congratulations on achieving your goal!</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Financial Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className={progress >= 100 ? "bg-green-100" : ""} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Milestone Progress</span>
                      <span>{Math.round(milestoneProgress)}%</span>
                    </div>
                    <Progress value={milestoneProgress} className="bg-muted" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Time Remaining</span>
                      <span className="flex items-center gap-1">
                        <timeStatus.icon className={`h-4 w-4 ${timeStatus.color}`} />
                        <span className={timeStatus.color}>{timeStatus.text}</span>
                      </span>
                    </div>
                    <Progress value={timeProgress} className={timeProgress > 90 ? "bg-red-100" : "bg-muted"} />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Milestones</h4>
                    <div className="space-y-2">
                      {goal.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Button
                            variant={milestone.completed ? "default" : "outline"}
                            size="icon"
                            className={`h-6 w-6 ${milestone.completed ? "bg-green-500 hover:bg-green-600" : ""}`}
                            onClick={() => !milestone.completed && handleMilestoneComplete(goal.id, index)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <span
                            className={`text-sm ${milestone.completed ? "line-through text-muted-foreground" : ""}`}
                          >
                            {milestone.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </ScrollArea>
    </TooltipProvider>
  )
}

