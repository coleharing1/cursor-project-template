"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/providers/auth-provider"
import { Calendar, CheckCircle2, Clock, Loader2 } from "lucide-react"
import { format, startOfDay, subDays } from "date-fns"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  title: string
  description?: string
  completed_at: string
  priority?: "low" | "medium" | "high"
  duration?: number
  category?: {
    id: string
    name: string
    color: string
  }
}

interface GroupedTasks {
  [date: string]: Task[]
}

export default function Log() {
  const [tasks, setTasks] = useState<GroupedTasks>({})
  const [loading, setLoading] = useState(true)
  const [daysToShow, setDaysToShow] = useState(7)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    } else if (user) {
      fetchCompletedTasks()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, router, daysToShow])

  async function fetchCompletedTasks() {
    try {
      // Calculate date range
      const endDate = new Date()
      const startDate = subDays(endDate, daysToShow)

      const response = await fetch(
        `/api/tasks?includeCompleted=true&completedAfter=${startDate.toISOString()}`
      )
      
      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }

      const data = await response.json()
      
      // Filter only completed tasks and group by date
      const completedTasks = data.filter((task: any) => task.completed_at)
      const grouped = completedTasks.reduce((acc: GroupedTasks, task: Task) => {
        const date = format(new Date(task.completed_at), "yyyy-MM-dd")
        if (!acc[date]) {
          acc[date] = []
        }
        acc[date].push(task)
        return acc
      }, {})

      // Sort tasks within each date by completion time (newest first)
      Object.keys(grouped).forEach(date => {
        grouped[date].sort((a: Task, b: Task) => 
          new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
        )
      })

      setTasks(grouped)
    } catch (error) {
      console.error("Error fetching completed tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = startOfDay(new Date())
    const taskDate = startOfDay(date)
    const daysDiff = Math.floor((today.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff === 0) return "Today"
    if (daysDiff === 1) return "Yesterday"
    return format(date, "EEEE, MMMM d")
  }

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    )
  }

  const sortedDates = Object.keys(tasks).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  )

  const totalCompleted = Object.values(tasks).reduce((sum, dayTasks) => sum + dayTasks.length, 0)
  const totalDuration = Object.values(tasks).flat().reduce((sum, task) => sum + (task.duration || 0), 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Task History</h1>
          <p className="text-sm text-muted-foreground">
            Review your completed tasks from the past {daysToShow} days
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tasks Completed
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{totalCompleted}</div>
              <p className="text-xs text-muted-foreground mt-1">
                in the last {daysToShow} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Time Logged
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{totalDuration}m</div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(totalDuration / 60)}h {totalDuration % 60}m total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Daily Average
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">
                {sortedDates.length > 0 ? Math.round(totalCompleted / sortedDates.length) : 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                tasks per day
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Task History */}
        <div className="space-y-6">
          {sortedDates.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No completed tasks in the last {daysToShow} days
                </p>
              </CardContent>
            </Card>
          ) : (
            sortedDates.map(date => (
              <div key={date} className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(date)}
                </h3>
                <div className="space-y-2">
                  {tasks[date].map(task => (
                    <Card key={task.id}>
                      <CardContent className="py-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                              <h4 className="font-medium">{task.title}</h4>
                            </div>
                            {task.description && (
                              <p className="text-sm text-muted-foreground ml-6">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3 ml-6 text-xs text-muted-foreground">
                              <span>
                                Completed at {format(new Date(task.completed_at), "h:mm a")}
                              </span>
                              {task.duration && (
                                <>
                                  <span>•</span>
                                  <span>{task.duration} min</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {task.priority && (
                              <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                                {task.priority}
                              </Badge>
                            )}
                            {task.category && (
                              <Badge 
                                variant="outline" 
                                className="text-xs"
                                style={{ 
                                  borderColor: task.category.color,
                                  backgroundColor: `${task.category.color}20`,
                                  color: task.category.color 
                                }}
                              >
                                {task.category.name}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}