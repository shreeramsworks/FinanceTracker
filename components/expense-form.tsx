"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useFinance } from "@/contexts/finance-context"

const formSchema = z.object({
  amount: z.string(),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  category: z.string().optional(),
  type: z.string({
    required_error: "Please select a type.",
  }),
})

export function ExpenseForm() {
  const { addTransaction, categories, createCategory } = useFinance()
  const [newCategory, setNewCategory] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      description: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    addTransaction({
      amount: Number(values.amount),
      description: values.description,
      category: values.type === "expense" ? values.category : undefined,
      type: values.type as "expense" | "income",
      date: new Date().toISOString(),
    })
    form.reset()
  }

  const handleCreateCategory = () => {
    if (newCategory) {
      createCategory(newCategory)
      form.setValue("category", newCategory)
      setNewCategory("")
      setIsDialogOpen(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input placeholder="0.00" {...field} type="number" step="0.01" />
              </FormControl>
              <FormDescription>Enter the amount in dollars</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Groceries" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch("type") === "expense" && (
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start">
                          + Create new category
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Category</DialogTitle>
                          <DialogDescription>Add a new category for your expenses</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Input
                              placeholder="Category name"
                              value={newCategory}
                              onChange={(e) => setNewCategory(e.target.value)}
                            />
                          </div>
                        </div>
                        <Button onClick={handleCreateCategory}>Create Category</Button>
                      </DialogContent>
                    </Dialog>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit">Add Transaction</Button>
      </form>
    </Form>
  )
}

