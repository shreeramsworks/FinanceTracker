"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import type { Transaction, Budget, UserProfile, Goal } from "@/lib/types"

interface FinanceContextType {
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, "id">) => void
  budgets: Budget[]
  addBudget: (budget: Omit<Budget, "id" | "spent">) => void
  updateBudget: (id: string, updates: Partial<Budget>) => void
  userProfile: UserProfile
  updateUserProfile: (updates: Partial<UserProfile>) => void
  createCategory: (category: string) => void
  categories: string[]
  goals: Goal[]
  addGoal: (goal: Omit<Goal, "id" | "currentAmount" | "milestones" | "notified">) => void
  updateGoalProgress: (id: string, milestoneIndex: number) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  logoutUser: () => void
  deleteAccount: () => void
  deleteBudget: (id: string) => void
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

const defaultUserProfile: UserProfile = {
  totalBalance: 0,
  monthlyIncome: 0,
  name: "",
  email: "",
  currency: "USD",
}

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>("transactions", [])
  const [budgets, setBudgets] = useLocalStorage<Budget[]>("budgets", [])
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile>("userProfile", defaultUserProfile)
  const [categories, setCategories] = useLocalStorage<string[]>("categories", [])
  const [goals, setGoals] = useLocalStorage<Goal[]>("goals", [])

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    }
    setTransactions([newTransaction, ...transactions])

    // Update budget spent amount if it's an expense
    if (transaction.type === "expense") {
      const budget = budgets.find((b) => b.category === transaction.category)
      if (budget) {
        updateBudget(budget.id, { spent: budget.spent + Math.abs(transaction.amount) })
      }
    }

    // Update total balance and monthly income if it's an income transaction
    const currentDate = new Date()
    setUserProfile((prev) => ({
      ...prev,
      totalBalance: prev.totalBalance + (transaction.type === "income" ? transaction.amount : -transaction.amount),
      monthlyIncome: transaction.type === "income" ? prev.monthlyIncome + transaction.amount : prev.monthlyIncome,
    }))
  }

  const addBudget = (budget: Omit<Budget, "id" | "spent">) => {
    const newBudget = {
      ...budget,
      id: Math.random().toString(36).substr(2, 9),
      spent: 0,
    }
    setBudgets([...budgets, newBudget])
    if (!categories.includes(budget.category)) {
      setCategories([...categories, budget.category])
    }
  }

  const updateBudget = (id: string, updates: Partial<Budget>) => {
    setBudgets(budgets.map((budget) => (budget.id === id ? { ...budget, ...updates } : budget)))
  }

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile({ ...userProfile, ...updates })
  }

  const createCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category])
      // Create a default budget for the new category
      addBudget({
        category,
        amount: 0,
      })
    }
  }

  const addGoal = (goalData: Omit<Goal, "id" | "currentAmount" | "milestones" | "notified">) => {
    const newGoal: Goal = {
      ...goalData,
      id: Math.random().toString(36).substr(2, 9),
      currentAmount: 0,
      milestones: goalData.milestones.map((text) => ({ text, completed: false })),
      notified: false,
      createdAt: new Date().toISOString(),
    }
    setGoals([...goals, newGoal])
  }

  const updateGoalProgress = (id: string, milestoneIndex: number) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === id) {
          const updatedMilestones = [...goal.milestones]
          updatedMilestones[milestoneIndex] = {
            ...updatedMilestones[milestoneIndex],
            completed: true,
          }

          // Calculate progress based on completed milestones
          const completedCount = updatedMilestones.filter((m) => m.completed).length
          const progressPercentage = completedCount / updatedMilestones.length
          const newCurrentAmount = goal.targetAmount * progressPercentage

          return {
            ...goal,
            milestones: updatedMilestones,
            currentAmount: newCurrentAmount,
          }
        }
        return goal
      }),
    )
  }

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(goals.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal)))
  }

  const logoutUser = () => {
    // In a real app, this would handle authentication logout
    // For this demo, we'll just clear some user data
    setUserProfile(defaultUserProfile)
    // You might want to redirect to a login page here
  }

  const deleteAccount = () => {
    // In a real app, this would make an API call to delete the account
    // For this demo, we'll clear all local storage data
    setTransactions([])
    setBudgets([])
    setUserProfile(defaultUserProfile)
    setCategories([])
    setGoals([])
    // You might want to redirect to a signup page here
  }

  const deleteBudget = (id: string) => {
    setBudgets(budgets.filter((budget) => budget.id !== id))
  }

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        budgets,
        addBudget,
        updateBudget,
        userProfile,
        updateUserProfile,
        createCategory,
        categories,
        goals,
        addGoal,
        updateGoalProgress,
        updateGoal,
        logoutUser,
        deleteAccount,
        deleteBudget,
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider")
  }
  return context
}

