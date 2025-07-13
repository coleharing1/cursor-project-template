"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { TaskList } from "@/components/task-list"
import { AddTaskModal } from "@/components/add-task-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/providers/auth-provider"
import { Search, Filter, Plus, SortAsc, Loader2 } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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
  category?: Category
  created_at: string
  updated_at: string
}

interface Category {
  id: string
  name: string
  color: string
  icon: string
  header?: string
}

interface GroupedTasks {
  [key: string]: {
    category: Category
    tasks: Task[]
  }
}

export default function AllTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("created_at")
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    } else if (user) {
      fetchData()
    }
  }, [user, authLoading, router])

  async function fetchData() {
    try {
      // Fetch tasks and categories in parallel
      const [tasksResponse, categoriesResponse] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/categories')
      ])

      if (!tasksResponse.ok || !categoriesResponse.ok) {
        throw new Error('Failed to fetch data')
      }

      const tasksData = await tasksResponse.json()
      const categoriesData = await categoriesResponse.json()

      setTasks(tasksData)
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error fetching data:", error)
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
      await fetchData()
    } catch (error) {
      console.error('Error updating task:', error)
      // Revert optimistic update
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, completed: task.completed } : t
      ))
    }
  }

  // Filter and sort tasks
  const filteredAndSortedTasks = tasks
    .filter(task => {
      // Search filter
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          (!task.description || !task.description.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false
      }
      
      // Priority filter
      if (filterPriority !== "all" && task.priority !== filterPriority) {
        return false
      }
      
      // Category filter
      if (filterCategory !== "all" && task.category_id !== filterCategory) {
        return false
      }
      
      // Status filter
      if (filterStatus === "completed" && !task.completed) return false
      if (filterStatus === "active" && task.completed) return false
      
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { high: 0, medium: 1, low: 2 }
          return (priorityOrder[a.priority || "low"] || 2) - (priorityOrder[b.priority || "low"] || 2)
        case "title":
          return a.title.localeCompare(b.title)
        case "created_at":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "updated_at":
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        default:
          return 0
      }
    })

  // Group tasks by category
  const groupTasksByCategory = (tasks: Task[]): GroupedTasks => {
    const grouped: GroupedTasks = {}
    
    // Create a group for uncategorized tasks
    const uncategorizedTasks = tasks.filter(task => !task.category_id)
    if (uncategorizedTasks.length > 0) {
      grouped["uncategorized"] = {
        category: {
          id: "uncategorized",
          name: "Uncategorized",
          color: "#6B7280",
          icon: "folder",
        },
        tasks: uncategorizedTasks,
      }
    }
    
    // Group tasks by their categories
    tasks.forEach(task => {
      if (task.category) {
        if (!grouped[task.category.id]) {
          grouped[task.category.id] = {
            category: task.category,
            tasks: [],
          }
        }
        grouped[task.category.id].tasks.push(task)
      }
    })
    
    return grouped
  }

  const groupedTasks = groupTasksByCategory(filteredAndSortedTasks)

  // Transform tasks for TaskList component
  const transformTasksForList = (tasks: Task[]) => {
    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed || !!task.completed_at,
      priority: task.priority,
      duration: task.duration,
    }))
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">All Tasks</h1>
            <p className="text-muted-foreground mt-2">
              Manage and organize all your tasks in one place
            </p>
          </div>
          <Button onClick={() => setShowAddTaskModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filter-status">Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="filter-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-priority">Priority</Label>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger id="filter-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-category">Category</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger id="filter-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort-by">Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sort-by">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Date Created</SelectItem>
                    <SelectItem value="updated_at">Last Updated</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task Views */}
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="category">Category View</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>
                  {filteredAndSortedTasks.length} task{filteredAndSortedTasks.length !== 1 ? 's' : ''} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TaskList
                  tasks={transformTasksForList(filteredAndSortedTasks)}
                  onToggleTask={toggleTask}
                  onEditTask={fetchData}
                  onDeleteTask={fetchData}
                  showQuickAdd={false}
                  title=""
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="category" className="space-y-4">
            <Accordion type="single" collapsible className="space-y-4">
              {Object.entries(groupedTasks).map(([categoryId, group]) => (
                <AccordionItem key={categoryId} value={categoryId} className="border rounded-lg">
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: group.category.color }}
                        />
                        <span className="font-semibold">{group.category.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {group.tasks.length} task{group.tasks.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <TaskList
                      tasks={transformTasksForList(group.tasks)}
                      onToggleTask={toggleTask}
                      onEditTask={fetchData}
                      onDeleteTask={fetchData}
                      showQuickAdd={false}
                      title=""
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        open={showAddTaskModal}
        onOpenChange={setShowAddTaskModal}
        onTaskCreated={fetchData}
      />
    </DashboardLayout>
  )
}