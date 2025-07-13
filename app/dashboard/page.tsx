"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { TaskList } from "@/components/task-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabaseClient"
import { ListTodo, Target, Clock, CheckCircle2, Plus } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/providers/auth-provider"
import { AddTaskModal } from "@/components/add-task-modal"

interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority?: "low" | "medium" | "high"
  duration?: number
  is_focused?: boolean
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    } else if (user) {
      fetchTasks()
    }
  }, [user, authLoading, router])

  async function fetchTasks() {
    try {
      const response = await fetch('/api/tasks')
      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }
      const data = await response.json()
      
      // Transform the data to match our Task interface
      const transformedTasks: Task[] = data.map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        completed: !!task.completed_at,
        priority: task.priority,
        duration: task.duration,
        is_focused: task.is_focused,
      }))
      
      setTasks(transformedTasks)
    } catch (error) {
      console.error("Error fetching tasks:", error)
      // TODO: Add error state handling
    } finally {
      setLoading(false)
    }
  }

  const toggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    // Optimistic update
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ))

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed_at: task.completed ? null : new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      // Refetch tasks to ensure consistency
      await fetchTasks()
    } catch (error) {
      console.error('Error updating task:', error)
      // Revert optimistic update
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, completed: task.completed } : t
      ))
    }
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    focused: tasks.filter(t => t.is_focused).length,
    totalTime: tasks.reduce((acc, task) => acc + (task.duration || 0), 0)
  }

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground mt-2">
            Here&apos;s your task overview for today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <ListTodo className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Active in your lists
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today&apos;s Focus</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.focused}</div>
              <p className="text-xs text-muted-foreground">
                Tasks in focus
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Planned</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTime}m</div>
              <p className="text-xs text-muted-foreground">
                Estimated duration
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4">
          <Button className="gap-2" onClick={() => setShowAddTaskModal(true)}>
            <Plus className="h-4 w-4" />
            New Task
          </Button>
          <Link href="/focus/today">
            <Button variant="outline" className="gap-2">
              <Target className="h-4 w-4" />
              Today&apos;s Focus
            </Button>
          </Link>
          <Link href="/tasks/all">
            <Button variant="outline" className="gap-2">
              <ListTodo className="h-4 w-4" />
              All Tasks
            </Button>
          </Link>
        </div>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>
              Your most recently updated tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TaskList
              tasks={tasks}
              onToggleTask={toggleTask}
              onEditTask={fetchTasks}
              onDeleteTask={fetchTasks}
              showQuickAdd={false}
              title=""
            />
          </CardContent>
        </Card>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        open={showAddTaskModal}
        onOpenChange={setShowAddTaskModal}
        onTaskCreated={fetchTasks}
      />
    </DashboardLayout>
  )
}