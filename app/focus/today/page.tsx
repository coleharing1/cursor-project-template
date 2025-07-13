"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  Circle,
} from "lucide-react"
import { cn, formatDuration } from "@/lib/utils"
import { DailyResetService } from "@/lib/reset-service"

interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  completed_at?: string
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
  position?: number
}

// Sortable Task Component
function SortableTask({ 
  task, 
  onToggleTask, 
  completingTasks,
  onStartTimer,
  isTimerActive
}: { 
  task: Task
  onToggleTask: (id: string) => void
  completingTasks: Set<string>
  onStartTimer: (task: Task) => void
  isTimerActive: boolean
}) {
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
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 p-2 rounded-md hover:bg-accent/50 transition-colors",
        isDragging && "cursor-grabbing"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab p-0.5 sm:p-1 hover:bg-accent rounded touch-none"
      >
        <GripVertical className="h-3 sm:h-4 w-3 sm:w-4 text-muted-foreground" />
      </div>
      <div className="relative p-2">
        <div className="absolute inset-2 bg-green-500 rounded-full blur-md opacity-60 animate-pulse" />
        <div className="relative w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 rounded-full shadow-lg shadow-green-500/50" />
      </div>
      <span className="flex-1 text-xs sm:text-sm font-medium truncate">{task.title}</span>
      {task.duration && (
        <span className="text-[10px] sm:text-xs text-muted-foreground">
          {formatDuration(task.duration)}
        </span>
      )}
      {task.category && (
        <Badge 
          variant="outline" 
          className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0 sm:py-0.5"
          style={{ 
            borderColor: task.category.color,
            backgroundColor: `${task.category.color}20`,
            color: task.category.color 
          }}
        >
          <span className="truncate max-w-[60px] sm:max-w-none">
            {task.category.name}
          </span>
        </Badge>
      )}
      {!task.completed && !completingTasks.has(task.id) && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 sm:h-8 sm:w-8"
          onClick={() => onStartTimer(task)}
          disabled={isTimerActive}
          title={isTimerActive ? "Timer already running" : "Start timer"}
        >
          <Play className="h-3 sm:h-4 w-3 sm:w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 sm:h-8 sm:w-8 shrink-0"
        onClick={() => onToggleTask(task.id)}
        title="Mark as complete"
        disabled={completingTasks.has(task.id)}
      >
        {completingTasks.has(task.id) ? (
          <CheckCircle2 className="h-4 sm:h-5 w-4 sm:w-5 text-green-600 animate-pulse" />
        ) : (
          <Circle className="h-4 sm:h-5 w-4 sm:w-5 text-muted-foreground hover:text-green-600 transition-colors" />
        )}
      </Button>
    </div>
  )
}

export default function TodaysFocus() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [activeTimer, setActiveTimer] = useState<string | null>(null)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(new Set())
  
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    } else if (user) {
      // Check if daily reset is needed
      DailyResetService.runResetIfNeeded()
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
      let data = await response.json()

      // Parse interval strings into minutes
      data = data.map((task: any) => {
        if (task.duration && typeof task.duration === 'string') {
          const parts = task.duration.split(':').map(Number)
          task.duration = parts[0] * 60 + parts[1]
        }
        return task
      })
      
      // Sort by position if available, otherwise by created_at
      const sortedData = data.sort((a: Task, b: Task) => {
        if (a.position !== undefined && b.position !== undefined) {
          return a.position - b.position
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
    setCompletingTasks(prev => new Set(prev).add(taskId))
    
    try {
      // Stop timer if this task is being timed
      if (activeTimer === taskId) {
        setActiveTimer(null)
        setTimerSeconds(0)
      }

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed_at: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      // Small delay to show animation
      await new Promise(resolve => setTimeout(resolve, 300))
      await fetchFocusedTasks()
    } catch (error) {
      console.error('Error updating task:', error)
    } finally {
      setCompletingTasks(prev => {
        const newSet = new Set(prev)
        newSet.delete(taskId)
        return newSet
      })
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
            body: JSON.stringify({ position: index * 100 }), // Use spacing of 100 for flexibility
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
  const remainingTasks = tasks.filter(t => !t.completed && !t.completed_at)
  const totalDuration = tasks.reduce((acc, task) => acc + (task.duration || 0), 0)
  const remainingDuration = remainingTasks.reduce((acc, task) => acc + (task.duration || 0), 0)
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
            <h1 className="text-xl sm:text-3xl font-bold flex items-center gap-1.5 sm:gap-2">
              <Target className="h-6 sm:h-8 w-6 sm:w-8 text-primary" />
              Today&apos;s Focus
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <Button onClick={() => setShowAddTaskModal(true)} className="gap-1 sm:gap-2 text-xs sm:text-sm">
            <Plus className="h-3 sm:h-4 w-3 sm:w-4" />
            <span className="hidden sm:inline">Add Focus Task</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl sm:text-2xl font-bold">{completedTasks.length}/{tasks.length}</span>
                  <CheckCircle2 className="h-4 sm:h-5 w-4 sm:w-5 text-muted-foreground" />
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-[10px] sm:text-xs text-muted-foreground">
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
                  <span className="text-xl sm:text-2xl font-bold">{formatDuration(totalDuration)}</span>
                  <Clock className="h-4 sm:h-5 w-4 sm:w-5 text-muted-foreground" />
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  {formatDuration(remainingDuration)} remaining
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  {formatDuration(completedDuration)} completed
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
                  <span className="text-xl sm:text-2xl font-bold font-mono">
                    {formatTime(timerSeconds)}
                  </span>
                  <Timer className="h-4 sm:h-5 w-4 sm:w-5 text-muted-foreground" />
                </div>
                {activeTimer ? (
                  <>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      {tasks.find(t => t.id === activeTimer)?.title || "Unknown task"}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={stopTimer}
                      className="w-full gap-1 sm:gap-2 text-xs sm:text-sm"
                    >
                      <Pause className="h-3 w-3" />
                      Stop Timer
                    </Button>
                  </>
                ) : (
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    No active timer
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks List */}
        <Card>
          <CardContent className="pt-6">
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  No focus tasks for today yet
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Add tasks from the categories below or create a new one
                </p>
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
                  <div className="space-y-1">
                    {tasks.map((task) => (
                      <SortableTask
                        key={task.id}
                        task={task}
                        onToggleTask={toggleTask}
                        completingTasks={completingTasks}
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