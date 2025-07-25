"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Target, 
  CheckCircle2, 
  Plus,
  Loader2,
  ChevronDown,
  ChevronRight,
  Circle,
  Briefcase,
  Home,
  Heart,
  Book,
  ShoppingCart,
  Zap,
  Users,
  Star,
  GripVertical
} from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { AddTaskModal } from "@/components/add-task-modal"
import { DailyResetService } from "@/lib/reset-service"
import { cn, formatDuration } from "@/lib/utils"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  completed_at?: string
  duration?: number
  is_focused?: boolean
  category_id?: string
  position?: number
  category?: {
    id: string
    name: string
    color: string
  }
}

interface Category {
  id: string
  name: string
  color: string
  icon: string
  parent_id?: string | null
  subcategories?: Category[]
  tasks?: Task[]
}

// Sortable Task Component
function SortableTask({ 
  task, 
  onToggleTask, 
  onToggleFocus,
  completingTasks 
}: { 
  task: Task
  onToggleTask: (id: string) => void
  onToggleFocus: (id: string, focused: boolean) => void
  completingTasks: Set<string>
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
      {task.is_focused ? (
        <div className="relative p-2">
          <div className="absolute inset-2 bg-green-500 rounded-full blur-md opacity-60 animate-pulse" />
          <div className="relative w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 rounded-full shadow-lg shadow-green-500/50" />
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 sm:h-8 sm:w-8"
          onClick={() => onToggleFocus(task.id, false)}
          title="Add to today's focus"
        >
          <Target className="h-3 sm:h-4 w-3 sm:w-4 transition-colors" />
        </Button>
      )}
      <span className="flex-1 text-xs sm:text-sm truncate">{task.title}</span>
      <span className="text-[10px] sm:text-xs text-muted-foreground mr-1 sm:mr-2">{formatDuration(task.duration || 30)}</span>
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

export default function Dashboard() {
  const [focusedTasks, setFocusedTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [quickAddValues, setQuickAddValues] = useState<{ [key: string]: string }>({})
  const [savingTasks, setSavingTasks] = useState<Set<string>>(new Set())
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
      fetchAllData()
    }
  }, [user, authLoading, router])

  async function fetchAllData() {
    try {
      // Fetch all tasks including completed
      const taskResponse = await fetch('/api/tasks?includeCompleted=true')
      if (!taskResponse.ok) {
        throw new Error('Failed to fetch tasks')
      }
      const tasksData = await taskResponse.json()
      
      // Filter focused tasks (sorting will happen after categories are organized)
      const focused = tasksData.filter((task: any) => task.is_focused && !task.completed_at)
      
      // We'll set focused tasks after organizing categories to maintain proper order
      
      // Fetch categories
      const catResponse = await fetch("/api/categories")
      if (!catResponse.ok) {
        throw new Error("Failed to fetch categories")
      }
      const categoriesData = await catResponse.json()
      
      // Organize categories with tasks
      const parentCategories = categoriesData.filter((cat: Category) => !cat.parent_id)
      const categoriesWithSubsAndTasks = parentCategories.map((parent: Category) => {
        const subcategories = categoriesData
          .filter((cat: Category) => cat.parent_id === parent.id)
          .map((sub: Category) => ({
            ...sub,
            tasks: tasksData
              .filter((task: any) => task.category_id === sub.id && !task.completed_at)
              .sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
              .map((task: any) => ({
                ...task,
                completed: !!task.completed_at
              }))
          }))
        
        return {
          ...parent,
          subcategories,
          tasks: tasksData
            .filter((task: any) => task.category_id === parent.id && !task.completed_at)
            .sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
            .map((task: any) => ({
              ...task,
              completed: !!task.completed_at
            }))
        }
      })
      
      setCategories(categoriesWithSubsAndTasks)
      
      // Sort focused tasks based on their category order
      const categoryOrder = new Map<string, number>()
      let orderIndex = 0
      
      // First, assign order to parent categories and their tasks
      categoriesWithSubsAndTasks.forEach((parent: Category) => {
        categoryOrder.set(parent.id, orderIndex++)
        
        // Then assign order to subcategories
        parent.subcategories?.forEach((sub: Category) => {
          categoryOrder.set(sub.id, orderIndex++)
        })
      })
      
      // Sort focused tasks by category order and position within category
      const sortedFocused = focused.sort((a: any, b: any) => {
        const aOrder = categoryOrder.get(a.category_id) ?? 999
        const bOrder = categoryOrder.get(b.category_id) ?? 999
        
        // First sort by category order
        if (aOrder !== bOrder) {
          return aOrder - bOrder
        }
        
        // Then by position within category
        return (a.position ?? 0) - (b.position ?? 0)
      })
      
      setFocusedTasks(sortedFocused)
      
      // Expand all categories by default
      const allCategoryIds = new Set<string>()
      categoriesWithSubsAndTasks.forEach((cat: Category) => {
        allCategoryIds.add(cat.id)
        cat.subcategories?.forEach((sub) => allCategoryIds.add(sub.id))
      })
      setExpandedCategories(allCategoryIds)
      
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleTask(taskId: string) {
    setCompletingTasks(prev => new Set(prev).add(taskId))
    
    try {
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
      await fetchAllData()
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

  async function toggleFocus(taskId: string, currentlyFocused: boolean) {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_focused: !currentlyFocused,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update task focus')
      }

      await fetchAllData()
    } catch (error) {
      console.error('Error updating task focus:', error)
    }
  }

  async function handleQuickAddTask(categoryId: string, e: React.FormEvent) {
    e.preventDefault()
    const title = quickAddValues[categoryId]?.trim()
    if (!title) return

    setSavingTasks(prev => new Set(prev).add(categoryId))

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category_id: categoryId,
          duration: 30,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create task")
      }

      // Clear input and refresh
      setQuickAddValues(prev => ({ ...prev, [categoryId]: "" }))
      await fetchAllData()
    } catch (error) {
      console.error("Error creating task:", error)
    } finally {
      setSavingTasks(prev => {
        const newSet = new Set(prev)
        newSet.delete(categoryId)
        return newSet
      })
    }
  }

  const toggleExpanded = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  async function handleDragEnd(event: DragEndEvent, categoryId: string) {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    // Find the category and update task order locally first
    setCategories(prevCategories => {
      return prevCategories.map(cat => {
        if (cat.id === categoryId) {
          const oldIndex = cat.tasks?.findIndex(t => t.id === active.id) ?? -1
          const newIndex = cat.tasks?.findIndex(t => t.id === over.id) ?? -1
          
          if (oldIndex !== -1 && newIndex !== -1 && cat.tasks) {
            const newTasks = arrayMove(cat.tasks, oldIndex, newIndex)
            return { ...cat, tasks: newTasks }
          }
        } else if (cat.subcategories) {
          // Check subcategories
          const newSubcategories = cat.subcategories.map(sub => {
            if (sub.id === categoryId) {
              const oldIndex = sub.tasks?.findIndex(t => t.id === active.id) ?? -1
              const newIndex = sub.tasks?.findIndex(t => t.id === over.id) ?? -1
              
              if (oldIndex !== -1 && newIndex !== -1 && sub.tasks) {
                const newTasks = arrayMove(sub.tasks, oldIndex, newIndex)
                return { ...sub, tasks: newTasks }
              }
            }
            return sub
          })
          return { ...cat, subcategories: newSubcategories }
        }
        return cat
      })
    })

    // Update position in database
    try {
      const category = categories.find(c => c.id === categoryId) || 
                       categories.flatMap(c => c.subcategories || []).find(s => s.id === categoryId)
      
      if (category?.tasks) {
        const oldIndex = category.tasks.findIndex(t => t.id === active.id)
        const newIndex = category.tasks.findIndex(t => t.id === over.id)
        
        if (oldIndex !== -1 && newIndex !== -1) {
          await fetch('/api/tasks/reorder', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              taskId: active.id,
              newPosition: newIndex,
              categoryId,
            }),
          })
        }
      }
    } catch (error) {
      console.error('Error reordering tasks:', error)
      // Refresh to get correct order from database
      await fetchAllData()
    }
  }

  // Icon helper function
  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      briefcase: Briefcase,
      home: Home,
      heart: Heart,
      book: Book,
      "shopping-cart": ShoppingCart,
      zap: Zap,
      users: Users,
      star: Star,
    }
    return icons[iconName] || Briefcase
  }

  const renderCategory = (category: Category, isSubcategory = false) => {
    const isExpanded = expandedCategories.has(category.id)
    const hasContent = (category.tasks && category.tasks.length > 0) || 
                      (category.subcategories && category.subcategories.length > 0)

    const IconComponent = getIconComponent(category.icon)

    return (
      <Card key={category.id} className={cn(isSubcategory && "ml-6")}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {(hasContent || category.subcategories) && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => toggleExpanded(category.id)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
              <div
                className="p-1 sm:p-1.5 rounded-md"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <IconComponent 
                  className={cn("h-3 sm:h-4 w-3 sm:w-4", isSubcategory && "h-2.5 sm:h-3 w-2.5 sm:w-3")} 
                  style={{ color: category.color }}
                />
              </div>
              <CardTitle className={cn("text-sm sm:text-base", isSubcategory && "text-xs sm:text-sm")}>
                {category.name}
              </CardTitle>
              <Badge variant="secondary" className="text-[10px] sm:text-xs">
                {category.tasks?.length || 0}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="pt-0 space-y-3">
            {/* Tasks */}
            {category.tasks && category.tasks.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => handleDragEnd(event, category.id)}
              >
                <SortableContext
                  items={category.tasks.map(t => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {category.tasks.map((task) => (
                      <SortableTask
                        key={task.id}
                        task={task}
                        onToggleTask={toggleTask}
                        onToggleFocus={toggleFocus}
                        completingTasks={completingTasks}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            {/* Subcategories */}
            {category.subcategories && category.subcategories.length > 0 && (
              <div className="space-y-3">
                {category.subcategories.map((sub) => renderCategory(sub, true))}
              </div>
            )}

            {/* Quick Add */}
            <form 
              onSubmit={(e) => handleQuickAddTask(category.id, e)}
              className="flex gap-1 sm:gap-2 pt-2 border-t"
            >
              <Input
                placeholder="Add a task..."
                value={quickAddValues[category.id] || ""}
                onChange={(e) => setQuickAddValues(prev => ({
                  ...prev,
                  [category.id]: e.target.value
                }))}
                disabled={savingTasks.has(category.id)}
                className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
              />
              <Button 
                type="submit" 
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9"
                disabled={!quickAddValues[category.id]?.trim() || savingTasks.has(category.id)}
              >
                {savingTasks.has(category.id) ? (
                  <Loader2 className="h-3 sm:h-4 w-3 sm:w-4 animate-spin" />
                ) : (
                  <Plus className="h-3 sm:h-4 w-3 sm:w-4" />
                )}
              </Button>
            </form>
          </CardContent>
        )}
      </Card>
    )
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Welcome back!</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </p>
        </div>

        {/* Today's Focus Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-1.5">
              <Target className="h-4 sm:h-5 w-4 sm:w-5 text-primary" />
              <span className="truncate">Today&apos;s Focus</span>
            </h2>
            <Button 
              size="sm" 
              className="gap-1 sm:gap-2 text-xs sm:text-sm" 
              onClick={() => setShowAddTaskModal(true)}
            >
              <Plus className="h-3 sm:h-4 w-3 sm:w-4" />
              <span className="hidden sm:inline">New Task</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
          
          {focusedTasks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">
                  No tasks in today&apos;s focus yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Add tasks from the categories below or create a new one
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-1">
                  {focusedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-accent/50 transition-colors"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-60 animate-pulse" />
                        <div className="relative w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 rounded-full shadow-lg shadow-green-500/50" />
                      </div>
                      <span className="flex-1 font-medium text-xs sm:text-sm truncate">{task.title}</span>
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8 shrink-0"
                        onClick={() => toggleTask(task.id)}
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
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground">
                  <span>{focusedTasks.length} task{focusedTasks.length !== 1 ? 's' : ''}</span>
                  <span>
                    {formatDuration(focusedTasks.reduce((total, task) => total + (task.duration || 30), 0))} total
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Categories Section */}
        <div className="space-y-3">
          <h2 className="text-lg sm:text-xl font-semibold">All Categories</h2>
          {categories.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">
                  No categories yet. Create categories in Settings to get started.
                </p>
                <Button 
                  className="mt-4" 
                  onClick={() => router.push("/settings/categories")}
                >
                  Go to Settings
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => renderCategory(category))}
            </div>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        open={showAddTaskModal}
        onOpenChange={setShowAddTaskModal}
        onTaskCreated={fetchAllData}
      />
    </DashboardLayout>
  )
}