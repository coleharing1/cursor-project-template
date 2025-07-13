"use client"

import { useState } from "react"
import { Plus, Clock, Calendar, Tag, ChevronDown, ChevronRight, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { EditTaskModal } from "@/components/edit-task-modal"

interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority?: "low" | "medium" | "high"
  duration?: number
  dueDate?: Date
  tags?: string[]
  categoryId?: string
  parentId?: string | null
  subtasks?: Task[]
}

interface TaskListProps {
  tasks: Task[]
  onToggleTask?: (taskId: string) => void
  onAddTask?: (task: Partial<Task>) => void
  onEditTask?: (taskId: string) => void
  onDeleteTask?: (taskId: string) => void
  showQuickAdd?: boolean
  title?: string
}

export function TaskList({
  tasks,
  onToggleTask,
  onAddTask,
  onEditTask,
  onDeleteTask,
  showQuickAdd = true,
  title = "Tasks",
}: TaskListProps) {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())
  const [quickAddValue, setQuickAddValue] = useState("")
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const toggleExpanded = (taskId: string) => {
    const newExpanded = new Set(expandedTasks)
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId)
    } else {
      newExpanded.add(taskId)
    }
    setExpandedTasks(newExpanded)
  }

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (quickAddValue.trim() && onAddTask) {
      onAddTask({
        title: quickAddValue.trim(),
        completed: false,
      })
      setQuickAddValue("")
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-muted-foreground"
    }
  }

  const renderTask = (task: Task, depth = 0) => {
    const hasSubtasks = task.subtasks && task.subtasks.length > 0
    const isExpanded = expandedTasks.has(task.id)

    return (
      <div key={task.id} className={cn("space-y-2", depth > 0 && "ml-8")}>
        <div
          className={cn(
            "group flex items-start gap-3 p-3 rounded-lg transition-colors",
            "hover:bg-accent/50",
            task.completed && "opacity-60"
          )}
        >
          <div className="flex items-center gap-2 mt-0.5">
            {hasSubtasks && (
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={() => toggleExpanded(task.id)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            )}
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onToggleTask?.(task.id)}
              className="data-[state=checked]:bg-success data-[state=checked]:border-success"
            />
          </div>
          
          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h4
                className={cn(
                  "font-medium",
                  task.completed && "line-through text-muted-foreground"
                )}
              >
                {task.title}
              </h4>
              <span className={cn("text-xs font-medium", getPriorityColor(task.priority))}>
                {task.priority?.toUpperCase()}
              </span>
            </div>
            
            {task.description && (
              <p className="text-sm text-muted-foreground">{task.description}</p>
            )}
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {task.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{task.duration}min</span>
                </div>
              )}
              {task.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{format(task.dueDate, "MMM d")}</span>
                </div>
              )}
              {task.tags && task.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  <span>{task.tags.join(", ")}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                setEditingTask(task)
                setShowEditModal(true)
              }}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => onDeleteTask?.(task.id)}
            >
              Delete
            </Button>
          </div>
        </div>
        
        {hasSubtasks && isExpanded && (
          <div className="space-y-2">
            {task.subtasks!.map((subtask) => renderTask(subtask, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {showQuickAdd && onAddTask && (
            <form onSubmit={handleQuickAdd} className="flex gap-2">
              <Input
                placeholder="Add a new task..."
                value={quickAddValue}
                onChange={(e) => setQuickAddValue(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </form>
          )}
          
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                No tasks yet. Add one to get started!
              </p>
            ) : (
              tasks.map((task) => renderTask(task))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Task Modal */}
      <EditTaskModal
        task={editingTask}
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onTaskUpdated={() => {
          setEditingTask(null)
          onEditTask?.(editingTask?.id || "")
        }}
        onTaskDeleted={() => {
          setEditingTask(null)
          onDeleteTask?.(editingTask?.id || "")
        }}
      />
    </>
  )
}