"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useFinance } from "@/contexts/finance-context"

const formSchema = z.object({
  category: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),
  amount: z.string().min(1, {
    message: "Amount is required.",
  }),
})

export function BudgetForm() {
  const { addBudget } = useFinance()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      amount: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    addBudget({
      category: values.category,
      amount: Number(values.amount),
    })
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Housing" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Amount</FormLabel>
              <FormControl>
                <Input placeholder="0.00" {...field} type="number" step="0.01" />
              </FormControl>
              <FormDescription>Enter the monthly budget amount in dollars</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add Budget</Button>
      </form>
    </Form>
  )
}

