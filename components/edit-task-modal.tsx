"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Loader2, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatDuration } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Task {
  id: string
  title: string
  description?: string
  duration?: number
  category_id?: string
  is_focused?: boolean
  completed?: boolean
  completed_at?: string
  position?: number
}

interface Category {
  id: string
  name: string
  color: string
  icon: string
  parent_id?: string | null
  subcategories?: Category[]
}

interface EditTaskModalProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskUpdated?: () => void
  onTaskDeleted?: () => void
}

export function EditTaskModal({ 
  task, 
  open, 
  onOpenChange, 
  onTaskUpdated,
  onTaskDeleted 
}: EditTaskModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState<number | null>(null)
  const [categoryId, setCategoryId] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  // Update form when task changes
  useEffect(() => {
    if (task && open) {
      setTitle(task.title)
      setDescription(task.description || "")
      setDuration(task.duration ?? null)
      setCategoryId(task.category_id || "uncategorized")
      setIsFocused(task.is_focused || false)
    }
  }, [task, open])

  // Fetch categories when modal opens
  useEffect(() => {
    if (open) {
      fetchCategories()
    }
  }, [open])

  async function fetchCategories() {
    setLoadingCategories(true)
    try {
      const response = await fetch("/api/categories")
      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }
      const data = await response.json()
      
      // Organize categories into hierarchy
      const parentCategories = data.filter((cat: Category) => !cat.parent_id)
      const categoriesWithSubcategories = parentCategories.map((parent: Category) => {
        const subcategories = data.filter((cat: Category) => cat.parent_id === parent.id)
        return { ...parent, subcategories }
      })
      
      setCategories(categoriesWithSubcategories)
    } catch (error) {
      console.error("Error fetching categories:", error)
      setError("Failed to load categories")
    } finally {
      setLoadingCategories(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!task) return
    
    setError(null)
    setLoading(true)

    try {
      const taskData = {
        title: title.trim(),
        description: description.trim() || undefined,
        duration: duration,
        category_id: categoryId === "uncategorized" ? null : categoryId,
        is_focused: isFocused,
      }

      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update task")
      }

      // Notify parent and wait for it to refresh
      if (onTaskUpdated) {
        await onTaskUpdated()
      }
      
      // Close modal
      onOpenChange(false)
      
      // router.refresh() is likely redundant if parent is refetching
    } catch (error) {
      console.error("Error updating task:", error)
      setError(error instanceof Error ? error.message : "Failed to update task")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!task) return
    
    setError(null)
    setLoading(true)

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete task")
      }

      // Notify parent and wait for it to refresh
      if (onTaskDeleted) {
        await onTaskDeleted()
      }

      // Close both dialogs
      setShowDeleteDialog(false)
      onOpenChange(false)
      
    } catch (error) {
      console.error("Error deleting task:", error)
      setError(error instanceof Error ? error.message : "Failed to delete task")
    } finally {
      setLoading(false)
    }
  }

  if (!task) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update the task details below
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="title" className="text-xs sm:text-sm">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
                disabled={loading}
                className="text-xs sm:text-sm h-8 sm:h-10"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="description" className="text-xs sm:text-sm">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details about this task"
                rows={3}
                disabled={loading}
                className="text-xs sm:text-sm min-h-[60px] sm:min-h-[80px]"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="duration" className="text-xs sm:text-sm">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={duration ?? ""}
                onChange={(e) => {
                  const value = e.target.value
                  // Only allow positive integers or empty string
                  if (value === '') {
                    setDuration(null)
                  } else if (/^\d+$/.test(value)) {
                    setDuration(parseInt(value, 10))
                  }
                }}
                placeholder="30"
                min="1"
                max="480"
                step="1"
                disabled={loading}
                className="text-xs sm:text-sm h-8 sm:h-10"
              />
              {duration && (
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  {formatDuration(duration)}
                </p>
              )}
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="category" className="text-xs sm:text-sm">Category</Label>
              <Select
                value={categoryId}
                onValueChange={setCategoryId}
                disabled={loading || loadingCategories}
              >
                <SelectTrigger id="category" className="text-xs sm:text-sm h-8 sm:h-10">
                  <SelectValue placeholder={loadingCategories ? "Loading..." : "Select a category"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uncategorized">None</SelectItem>
                  {categories.map((category) => [
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </SelectItem>,
                    ...(category.subcategories || []).map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        <div className="flex items-center gap-2 ml-4">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: sub.color }}
                          />
                          <span className="text-sm">{sub.name}</span>
                        </div>
                      </SelectItem>
                    ))
                  ]).flat()}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="focused"
                checked={isFocused}
                onCheckedChange={(checked) => setIsFocused(checked as boolean)}
                disabled={loading || task.completed}
              />
              <Label
                htmlFor="focused"
                className="text-xs sm:text-sm font-normal cursor-pointer"
              >
                Add to Today's Focus
              </Label>
            </div>

            <DialogFooter className="flex justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                disabled={loading}
                className="mr-auto gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <Trash2 className="h-3 sm:h-4 w-3 sm:w-4" />
                <span className="hidden sm:inline">Delete</span>
                <span className="sm:hidden">×</span>
              </Button>
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || !title.trim()} className="text-xs sm:text-sm">
                  {loading && <Loader2 className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4 animate-spin" />}
                  Save
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}