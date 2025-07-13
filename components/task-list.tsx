"use client"

import { useState } from "react"
import { Plus, Clock, Calendar, Tag, ChevronDown, ChevronRight, Pencil, Target, Circle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { cn, formatDuration } from "@/lib/utils"
import { format } from "date-fns"
import { EditTaskModal } from "@/components/edit-task-modal"

interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  duration?: number
  dueDate?: Date
  tags?: string[]
  categoryId?: string
  parentId?: string | null
  subtasks?: Task[]
  is_focused?: boolean
  position?: number
}

interface TaskListProps {
  tasks: Task[]
  onToggleTask?: (taskId: string) => void
  onAddTask?: (task: Partial<Task>) => void
  onEditTask?: (taskId: string) => void
  onDeleteTask?: (taskId: string) => void
  onToggleFocus?: (taskId: string, focused: boolean) => void
  showQuickAdd?: boolean
  title?: string
}

export function TaskList({
  tasks,
  onToggleTask,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleFocus,
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

  // Priority system removed - using position-based ordering

  const renderTask = (task: Task, depth = 0) => {
    const hasSubtasks = task.subtasks && task.subtasks.length > 0
    const isExpanded = expandedTasks.has(task.id)

    return (
      <div key={task.id} className={cn("space-y-2", depth > 0 && "ml-8")}>
        <div
          className={cn(
            "group flex items-center gap-2 p-2 sm:p-3 rounded-lg transition-colors",
            "hover:bg-accent/50",
            task.completed && "opacity-60"
          )}
        >
          <div className="flex items-center gap-1 sm:gap-2">
            {hasSubtasks && (
              <Button
                variant="ghost"
                size="icon"
                className="h-4 sm:h-5 w-4 sm:w-5"
                onClick={() => toggleExpanded(task.id)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            )}
            {onToggleFocus && (
              task.is_focused ? (
                <div className="relative p-2">
                  <div className="absolute inset-2 bg-green-500 rounded-full blur-md opacity-60 animate-pulse" />
                  <div className="relative w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 rounded-full shadow-lg shadow-green-500/50" />
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8"
                  onClick={() => onToggleFocus(task.id, task.is_focused || false)}
                  title="Add to today's focus"
                >
                  <Target className="h-3 sm:h-4 w-3 sm:w-4 transition-colors" />
                </Button>
              )
            )}
          </div>
          
          <div className="flex-1 space-y-1">
            <h4
              className={cn(
                "text-xs sm:text-sm font-medium",
                task.completed && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </h4>
            
            {task.description && (
              <p className="text-xs sm:text-sm text-muted-foreground">{task.description}</p>
            )}
            
            <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground">
              {task.duration && (
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <Clock className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
                  <span>{formatDuration(task.duration)}</span>
                </div>
              )}
              {task.dueDate && (
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <Calendar className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
                  <span>{format(task.dueDate, "MMM d")}</span>
                </div>
              )}
              {task.tags && task.tags.length > 0 && (
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <Tag className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
                  <span className="truncate max-w-[80px] sm:max-w-none">{task.tags.join(", ")}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8 shrink-0"
              onClick={() => onToggleTask?.(task.id)}
              title="Mark as complete"
            >
              {task.completed ? (
                <CheckCircle2 className="h-4 sm:h-5 w-4 sm:w-5 text-green-600" />
              ) : (
                <Circle className="h-4 sm:h-5 w-4 sm:w-5 text-muted-foreground hover:text-green-600 transition-colors" />
              )}
            </Button>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 sm:h-7 w-6 sm:w-7"
                onClick={() => {
                  setEditingTask(task)
                  setShowEditModal(true)
                }}
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 sm:h-7 w-6 sm:w-7 text-destructive hover:text-destructive"
                onClick={() => onDeleteTask?.(task.id)}
                title="Delete task"
              >
                <span className="text-xs">×</span>
              </Button>
            </div>
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
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent className={cn("space-y-4", !title && "pt-6")}>
          {showQuickAdd && onAddTask && (
            <form onSubmit={handleQuickAdd} className="flex gap-2">
              <Input
                placeholder="Add a new task..."
                value={quickAddValue}
                onChange={(e) => setQuickAddValue(e.target.value)}
                className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
              />
              <Button type="submit" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                <Plus className="h-3 sm:h-4 w-3 sm:w-4" />
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