"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFinance } from "@/contexts/finance-context"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertTriangle, LogOut, Trash2 } from "lucide-react"
import { useState } from "react"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  currency: z.string(),
  totalBalance: z.string(),
  monthlyIncome: z.string(),
})

export function ProfileForm() {
  const { userProfile, updateUserProfile, logoutUser, deleteAccount } = useFinance()
  const { toast } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userProfile.name,
      email: userProfile.email,
      currency: userProfile.currency,
      totalBalance: userProfile.totalBalance.toString(),
      monthlyIncome: userProfile.monthlyIncome.toString(),
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const updates = {
      name: values.name,
      email: values.email,
      currency: values.currency,
      totalBalance: Number(values.totalBalance),
      monthlyIncome: Number(values.monthlyIncome),
    }
    updateUserProfile(updates)
    toast({
      title: "Settings updated",
      description: "Your profile settings have been updated successfully.",
    })
  }

  const handleLogout = () => {
    logoutUser()
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
  }

  const handleDeleteAccount = () => {
    deleteAccount()
    setShowDeleteDialog(false)
    toast({
      title: "Account deleted",
      description: "Your account has been deleted successfully.",
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="USD">USD - US Dollar ($)</SelectItem>
                    <SelectItem value="EUR">EUR - Euro (€)</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound (£)</SelectItem>
                    <SelectItem value="JPY">JPY - Japanese Yen (¥)</SelectItem>
                    <SelectItem value="AUD">AUD - Australian Dollar (A$)</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar (C$)</SelectItem>
                    <SelectItem value="CHF">CHF - Swiss Franc (Fr)</SelectItem>
                    <SelectItem value="CNY">CNY - Chinese Yuan (¥)</SelectItem>
                    <SelectItem value="INR">INR - Indian Rupee (₹)</SelectItem>
                    <SelectItem value="BRL">BRL - Brazilian Real (R$)</SelectItem>
                    <SelectItem value="RUB">RUB - Russian Ruble (₽)</SelectItem>
                    <SelectItem value="KRW">KRW - South Korean Won (₩)</SelectItem>
                    <SelectItem value="SGD">SGD - Singapore Dollar (S$)</SelectItem>
                    <SelectItem value="NZD">NZD - New Zealand Dollar (NZ$)</SelectItem>
                    <SelectItem value="MXN">MXN - Mexican Peso (Mex$)</SelectItem>
                    <SelectItem value="HKD">HKD - Hong Kong Dollar (HK$)</SelectItem>
                    <SelectItem value="SEK">SEK - Swedish Krona (kr)</SelectItem>
                    <SelectItem value="NOK">NOK - Norwegian Krone (kr)</SelectItem>
                    <SelectItem value="DKK">DKK - Danish Krone (kr)</SelectItem>
                    <SelectItem value="PLN">PLN - Polish Złoty (zł)</SelectItem>
                    <SelectItem value="ZAR">ZAR - South African Rand (R)</SelectItem>
                    <SelectItem value="AED">AED - UAE Dirham (د.إ)</SelectItem>
                    <SelectItem value="SAR">SAR - Saudi Riyal (﷼)</SelectItem>
                    <SelectItem value="THB">THB - Thai Baht (฿)</SelectItem>
                    <SelectItem value="TRY">TRY - Turkish Lira (₺)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="totalBalance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Balance</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormDescription>Set your current total balance</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="monthlyIncome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Income</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormDescription>Set your expected monthly income</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Save Changes</Button>
        </form>
      </Form>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Account Actions</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="flex items-center gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>

          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Delete Account
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete your account? This action cannot be undone and all your data will be
                  permanently removed.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  Delete Account
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

