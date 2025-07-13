"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/components/providers/auth-provider"
import { AddTaskModal } from "@/components/add-task-modal"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import {
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { 
  Target, 
  Clock, 
  Play, 
  Pause, 
  Plus, 
  Loader2,
  CheckCircle2,
  Timer,
  GripVertical,
  Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  completed_at?: string
  priority?: "low" | "medium" | "high"
  duration?: number
  is_focused?: boolean
  category_id?: string
  category?: {
    id: string
    name: string
    color: string
    icon: string
  }
  created_at: string
  updated_at: string
  order?: number
}

interface SortableTaskItemProps {
  task: Task
  onToggle: (taskId: string) => void
  onStartTimer: (task: Task) => void
  isTimerActive: boolean
}

function SortableTaskItem({ task, onToggle, onStartTimer, isTimerActive }: SortableTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-500 bg-gray-50 border-gray-200"
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-lg border bg-background p-4 transition-all",
        isDragging && "shadow-lg opacity-80",
        task.completed && "opacity-60"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab touch-none"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>

        <Checkbox
          checked={task.completed || !!task.completed_at}
          onCheckedChange={() => onToggle(task.id)}
          className="mt-1"
        />

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <h3 className={cn(
                "font-medium",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-muted-foreground">{task.description}</p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {task.priority && (
                <Badge 
                  variant="outline" 
                  className={cn("text-xs", getPriorityColor(task.priority))}
                >
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

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {task.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{task.duration}min</span>
                </div>
              )}
            </div>

            {!task.completed && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onStartTimer(task)}
                className="gap-2"
                disabled={isTimerActive}
              >
                <Play className="h-3 w-3" />
                Start Timer
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TodaysFocus() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [activeTimer, setActiveTimer] = useState<string | null>(null)
  const [timerSeconds, setTimerSeconds] = useState(0)
  
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    } else if (user) {
      fetchFocusedTasks()
    }
  }, [user, authLoading, router])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (activeTimer) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [activeTimer])

  async function fetchFocusedTasks() {
    try {
      const response = await fetch('/api/tasks?is_focused=true')
      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }
      const data = await response.json()
      
      // Sort by order if available, otherwise by created_at
      const sortedData = data.sort((a: Task, b: Task) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order
        }
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      })
      
      setTasks(sortedData)
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    // Stop timer if this task is being timed
    if (activeTimer === taskId) {
      setActiveTimer(null)
      setTimerSeconds(0)
    }

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
      await fetchFocusedTasks()
    } catch (error) {
      console.error('Error updating task:', error)
      // Revert optimistic update
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, completed: task.completed } : t
      ))
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = tasks.findIndex(task => task.id === active.id)
      const newIndex = tasks.findIndex(task => task.id === over?.id)

      const newTasks = arrayMove(tasks, oldIndex, newIndex)
      setTasks(newTasks)

      // Update order in database
      try {
        // Update order for all affected tasks
        const updates = newTasks.map((task, index) => 
          fetch(`/api/tasks/${task.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ order: index }),
          })
        )

        await Promise.all(updates)
      } catch (error) {
        console.error('Error updating task order:', error)
        // Revert on error
        await fetchFocusedTasks()
      }
    }
  }

  const startTimer = (task: Task) => {
    setActiveTimer(task.id)
    setTimerSeconds(0)
  }

  const stopTimer = () => {
    setActiveTimer(null)
    setTimerSeconds(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate stats
  const completedTasks = tasks.filter(t => t.completed || !!t.completed_at)
  const totalDuration = tasks.reduce((acc, task) => acc + (task.duration || 0), 0)
  const completedDuration = completedTasks.reduce((acc, task) => acc + (task.duration || 0), 0)
  const progress = totalDuration > 0 ? (completedDuration / totalDuration) * 100 : 0

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Target className="h-8 w-8 text-primary" />
              Today&apos;s Focus
            </h1>
            <p className="text-muted-foreground mt-2">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <Button onClick={() => setShowAddTaskModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Focus Task
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{completedTasks.length}/{tasks.length}</span>
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {Math.round(progress)}% complete
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Time Estimate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{totalDuration}min</span>
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {completedDuration}min completed
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Timer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold font-mono">
                    {formatTime(timerSeconds)}
                  </span>
                  <Timer className="h-5 w-5 text-muted-foreground" />
                </div>
                {activeTimer ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={stopTimer}
                    className="w-full gap-2"
                  >
                    <Pause className="h-3 w-3" />
                    Stop Timer
                  </Button>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No active timer
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks List */}
        <Card>
          <CardHeader>
            <CardTitle>Focus Tasks</CardTitle>
            <CardDescription>
              Drag to reorder tasks based on your priorities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  No focus tasks for today yet
                </p>
                <Button onClick={() => setShowAddTaskModal(true)} variant="outline">
                  Add Your First Focus Task
                </Button>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={tasks.map(t => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {tasks.map(task => (
                      <SortableTaskItem
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onStartTimer={startTimer}
                        isTimerActive={activeTimer === task.id}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        open={showAddTaskModal}
        onOpenChange={setShowAddTaskModal}
        onTaskCreated={fetchFocusedTasks}
      />
    </DashboardLayout>
  )
}