export interface Transaction {
  id: string
  amount: number
  description: string
  category?: string
  date: string
  type: "expense" | "income"
  timestamp: string
}

export interface Budget {
  id: string
  category: string
  amount: number
  spent: number
}

export interface UserProfile {
  totalBalance: number
  monthlyIncome: number
  name: string
  email: string
  currency: string
}

export interface Goal {
  id: string
  title: string
  type: string
  targetAmount: number
  currentAmount: number
  deadline: string
  priority: string
  description: string
  milestones: { text: string; completed: boolean }[]
  createdAt: string
  notified?: boolean
  completed?: boolean
}

