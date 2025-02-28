"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useFinance } from "@/contexts/finance-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  type: z.string({
    required_error: "Please select a goal type.",
  }),
  targetAmount: z.string().min(1, {
    message: "Target amount is required.",
  }),
  deadline: z.string().min(1, {
    message: "Deadline is required.",
  }),
  priority: z.string({
    required_error: "Please select a priority level.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  milestones: z.string().min(1, {
    message: "Please add at least one milestone.",
  }),
})

export function GoalForm() {
  const { addGoal, userProfile } = useFinance()
  const [targetAmount, setTargetAmount] = useState(1000)
  const [selectedTemplate, setSelectedTemplate] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      milestones: "",
      targetAmount: "1000",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    addGoal({
      ...values,
      targetAmount: Number(values.targetAmount),
      milestones: values.milestones.split("\n").filter(Boolean),
    })
    form.reset()
    setTargetAmount(1000)
    setSelectedTemplate("")
    toast({
      title: "Goal created",
      description: "Your new financial goal has been created successfully.",
    })
  }

  const applyTemplate = (template: string) => {
    setSelectedTemplate(template)

    // Define templates for common financial goals
    const templates: Record<string, { title: string; description: string; milestones: string; amount: number }> = {
      emergency: {
        title: "Emergency Fund",
        description:
          "Build a safety net for unexpected expenses or income loss. This fund will cover 3-6 months of essential expenses.",
        milestones:
          "Save first $1,000 for immediate emergencies\nReach 1 month of expenses\nReach 3 months of expenses\nReach 6 months of expenses",
        amount: userProfile.monthlyIncome * 6,
      },
      debt: {
        title: "Pay Off Credit Card Debt",
        description: "Eliminate high-interest credit card debt to reduce financial stress and improve credit score.",
        milestones:
          "List all debts and organize by interest rate\nStop using credit cards for new purchases\nPay off smallest debt\nPay off highest interest debt\nPay off remaining debts",
        amount: 5000,
      },
      home: {
        title: "Save for Home Down Payment",
        description: "Save for a down payment on a home to reduce mortgage costs and secure better loan terms.",
        milestones:
          "Research home prices in target area\nEstablish target down payment amount (20% of home price)\nSet up automatic transfers to savings\nReach 25% of down payment\nReach 50% of down payment\nReach 75% of down payment\nReach 100% of down payment",
        amount: 50000,
      },
      retirement: {
        title: "Retirement Savings",
        description: "Build a retirement fund to ensure financial security in later years.",
        milestones:
          "Open a retirement account\nContribute enough to get full employer match\nIncrease contributions to 10% of income\nIncrease contributions to 15% of income\nReach $100,000 milestone\nReach $250,000 milestone",
        amount: 250000,
      },
      vacation: {
        title: "Dream Vacation Fund",
        description: "Save for a special vacation without going into debt.",
        milestones:
          "Research destination costs\nSet up dedicated savings account\nBook flights in advance\nReach 50% of total vacation cost\nReach 100% of vacation budget",
        amount: 3000,
      },
    }

    if (templates[template]) {
      const { title, description, milestones, amount } = templates[template]
      form.setValue("title", title)
      form.setValue("description", description)
      form.setValue("milestones", milestones)
      form.setValue("targetAmount", amount.toString())
      setTargetAmount(amount)
    }
  }

  return (
    <Tabs defaultValue="custom" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="template">Use Template</TabsTrigger>
        <TabsTrigger value="custom">Custom Goal</TabsTrigger>
      </TabsList>

      <TabsContent value="template" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card
            className={`cursor-pointer hover:border-primary ${selectedTemplate === "emergency" ? "border-primary" : ""}`}
            onClick={() => applyTemplate("emergency")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚨</span>
                <h3 className="font-medium">Emergency Fund</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Build a safety net for unexpected expenses</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer hover:border-primary ${selectedTemplate === "debt" ? "border-primary" : ""}`}
            onClick={() => applyTemplate("debt")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💳</span>
                <h3 className="font-medium">Debt Payoff</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Eliminate high-interest debt</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer hover:border-primary ${selectedTemplate === "home" ? "border-primary" : ""}`}
            onClick={() => applyTemplate("home")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏠</span>
                <h3 className="font-medium">Home Down Payment</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Save for your dream home</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer hover:border-primary ${selectedTemplate === "retirement" ? "border-primary" : ""}`}
            onClick={() => applyTemplate("retirement")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏖️</span>
                <h3 className="font-medium">Retirement</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Build your retirement nest egg</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer hover:border-primary ${selectedTemplate === "vacation" ? "border-primary" : ""}`}
            onClick={() => applyTemplate("vacation")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✈️</span>
                <h3 className="font-medium">Vacation Fund</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Save for a special trip</p>
            </CardContent>
          </Card>
        </div>

        {selectedTemplate && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-muted p-4 rounded-lg mb-4">
                <h3 className="font-medium mb-2">SMART Goal Guidelines:</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>
                    <strong>Specific:</strong> Clearly define what you want to accomplish
                  </li>
                  <li>
                    <strong>Measurable:</strong> Include a specific amount and deadline
                  </li>
                  <li>
                    <strong>Achievable:</strong> Set realistic goals based on your income
                  </li>
                  <li>
                    <strong>Relevant:</strong> Ensure the goal aligns with your financial priorities
                  </li>
                  <li>
                    <strong>Time-bound:</strong> Set a specific deadline to create urgency
                  </li>
                </ul>
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={selectedTemplate}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a goal type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="savings">Savings</SelectItem>
                        <SelectItem value="debt">Debt Reduction</SelectItem>
                        <SelectItem value="investment">Investment</SelectItem>
                        <SelectItem value="purchase">Major Purchase</SelectItem>
                        <SelectItem value="vacation">Vacation</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="retirement">Retirement</SelectItem>
                        <SelectItem value="emergency">Emergency Fund</SelectItem>
                        <SelectItem value="home">Home Purchase</SelectItem>
                        <SelectItem value="vehicle">Vehicle Purchase</SelectItem>
                        <SelectItem value="wedding">Wedding</SelectItem>
                        <SelectItem value="business">Business Startup</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Target Amount:{" "}
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: userProfile.currency }).format(
                        targetAmount,
                      )}
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <Slider
                          value={[targetAmount]}
                          min={100}
                          max={100000}
                          step={100}
                          onValueChange={(value) => {
                            setTargetAmount(value[0])
                            field.onChange(value[0].toString())
                          }}
                        />
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            setTargetAmount(Number(e.target.value))
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue="medium">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
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
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription>Be specific about what you want to achieve and why</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="milestones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Milestones</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription>
                      Break down your goal into smaller, achievable milestones (one per line)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Create Goal</Button>
            </form>
          </Form>
        )}
      </TabsContent>

      <TabsContent value="custom">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-muted p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-2">SMART Goal Guidelines:</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>
                  <strong>Specific:</strong> Clearly define what you want to accomplish
                </li>
                <li>
                  <strong>Measurable:</strong> Include a specific amount and deadline
                </li>
                <li>
                  <strong>Achievable:</strong> Set realistic goals based on your income
                </li>
                <li>
                  <strong>Relevant:</strong> Ensure the goal aligns with your financial priorities
                </li>
                <li>
                  <strong>Time-bound:</strong> Set a specific deadline to create urgency
                </li>
              </ul>
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Save for a house down payment" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a goal type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="debt">Debt Reduction</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                      <SelectItem value="purchase">Major Purchase</SelectItem>
                      <SelectItem value="vacation">Vacation</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="retirement">Retirement</SelectItem>
                      <SelectItem value="emergency">Emergency Fund</SelectItem>
                      <SelectItem value="home">Home Purchase</SelectItem>
                      <SelectItem value="vehicle">Vehicle Purchase</SelectItem>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="business">Business Startup</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Target Amount:{" "}
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: userProfile.currency }).format(
                      targetAmount,
                    )}
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Slider
                        value={[targetAmount]}
                        min={100}
                        max={100000}
                        step={100}
                        onValueChange={(value) => {
                          setTargetAmount(value[0])
                          field.onChange(value[0].toString())
                        }}
                      />
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="50000.00"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          setTargetAmount(Number(e.target.value))
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <Textarea placeholder="Describe your goal and why it's important..." {...field} />
                  </FormControl>
                  <FormDescription>Be specific about what you want to achieve and why</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="milestones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Milestones</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter milestones (one per line)
Example:
Save first $1000
Research investment options
Open investment account"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Break down your goal into smaller, achievable milestones</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Create Goal</Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  )
}

