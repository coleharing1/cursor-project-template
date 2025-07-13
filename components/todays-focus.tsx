"use client"

import { useState } from "react"
import { Target, Plus, Sparkles, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface FocusTask {
  id: string
  title: string
  description?: string
  completed: boolean
  priority?: "low" | "medium" | "high"
  duration?: number
  sourceCategory?: string
}

interface TodaysFocusProps {
  focusTasks: FocusTask[]
  onToggleTask?: (taskId: string) => void
  onAddQuickTask?: (title: string) => void
  onRemoveFromFocus?: (taskId: string) => void
  suggestedTasks?: FocusTask[]
  onAddSuggestedTask?: (task: FocusTask) => void
}

export function TodaysFocus({
  focusTasks,
  onToggleTask,
  onAddQuickTask,
  onRemoveFromFocus,
  suggestedTasks = [],
  onAddSuggestedTask,
}: TodaysFocusProps) {
  const [quickAddValue, setQuickAddValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(true)

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (quickAddValue.trim() && onAddQuickTask) {
      onAddQuickTask(quickAddValue.trim())
      setQuickAddValue("")
    }
  }

  const completedCount = focusTasks.filter(t => t.completed).length
  const totalDuration = focusTasks.reduce((acc, task) => acc + (task.duration || 0), 0)
  const completionRate = focusTasks.length > 0 
    ? Math.round((completedCount / focusTasks.length) * 100)
    : 0

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-l-red-500"
      case "medium":
        return "border-l-4 border-l-yellow-500"
      case "low":
        return "border-l-4 border-l-green-500"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                Today's Focus
              </CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </CardDescription>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{completedCount}/{focusTasks.length}</p>
                <p className="text-muted-foreground">Tasks</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{totalDuration}</p>
                <p className="text-muted-foreground">Minutes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{completionRate}%</p>
                <p className="text-muted-foreground">Complete</p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Add */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleQuickAdd} className="flex gap-2">
            <Input
              placeholder="Quick add a task for today..."
              value={quickAddValue}
              onChange={(e) => setQuickAddValue(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Focus Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Focus List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {focusTasks.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                No tasks in focus yet. Add tasks or select from suggestions below.
              </p>
            </div>
          ) : (
            focusTasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "group flex items-start gap-3 p-3 rounded-lg transition-all",
                  "hover:bg-accent/50",
                  task.completed && "opacity-60",
                  getPriorityColor(task.priority)
                )}
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => onToggleTask?.(task.id)}
                  className="data-[state=checked]:bg-success data-[state=checked]:border-success mt-0.5"
                />
                
                <div className="flex-1">
                  <h4
                    className={cn(
                      "font-medium",
                      task.completed && "line-through text-muted-foreground"
                    )}
                  >
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    {task.duration && <span>{task.duration} min</span>}
                    {task.sourceCategory && (
                      <span className="bg-secondary px-2 py-0.5 rounded-full">
                        {task.sourceCategory}
                      </span>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemoveFromFocus?.(task.id)}
                >
                  Remove
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      {suggestedTasks.length > 0 && showSuggestions && (
        <Card className="border-dashed">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Suggested for Today
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSuggestions(false)}
              >
                Hide
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{task.title}</h4>
                  {task.sourceCategory && (
                    <span className="text-xs text-muted-foreground">
                      from {task.sourceCategory}
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onAddSuggestedTask?.(task)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Completion Celebration */}
      {completionRate === 100 && focusTasks.length > 0 && (
        <Card className="bg-success/10 border-success">
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Amazing! All tasks completed!</h3>
            <p className="text-muted-foreground">
              You've finished all {focusTasks.length} tasks for today. Great job!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}