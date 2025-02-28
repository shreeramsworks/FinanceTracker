"use client"

import { useState } from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts"
import type { DateRange } from "react-day-picker"
import { format, isWithinInterval, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { DateRangePicker } from "@/components/date-range-picker"
import { useFinance } from "@/contexts/finance-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Overview() {
  const { transactions } = useFinance()
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 6),
    to: new Date(),
  })
  const [timeframe, setTimeframe] = useState<"monthly" | "yearly">("monthly")

  const filteredTransactions = transactions.filter((transaction) => {
    if (!dateRange?.from || !dateRange?.to) return true
    const transactionDate = new Date(transaction.date)
    return isWithinInterval(transactionDate, {
      start: startOfMonth(dateRange.from),
      end: endOfMonth(dateRange.to),
    })
  })

  const chartData = filteredTransactions.reduce(
    (acc, transaction) => {
      const date = new Date(transaction.date)
      const key = format(date, timeframe === "monthly" ? "MMM yyyy" : "yyyy")

      if (!acc[key]) {
        acc[key] = { name: key, expense: 0, income: 0 }
      }

      if (transaction.type === "expense") {
        acc[key].expense += Math.abs(transaction.amount)
      } else {
        acc[key].income += transaction.amount
      }

      return acc
    },
    {} as Record<string, { name: string; expense: number; income: number }>,
  )

  const data = Object.values(chartData)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Select value={timeframe} onValueChange={(value: "monthly" | "yearly") => setTimeframe(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
        <DateRangePicker date={dateRange} onDateChange={setDateRange} />
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expenses" />
          <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} name="Income" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

