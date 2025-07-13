"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/providers/auth-provider"
import { 
  Palette, 
  Plus, 
  Trash2, 
  Loader2, 
  Settings,
  Briefcase,
  Home,
  Heart,
  Book,
  ShoppingCart,
  Zap,
  Users,
  Star
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Category {
  id: string
  name: string
  color: string
  icon: string
  header?: string
  task_count?: number
  parent_id?: string | null
  subcategories?: Category[]
}

const AVAILABLE_ICONS = [
  { value: "briefcase", label: "Briefcase", icon: Briefcase },
  { value: "home", label: "Home", icon: Home },
  { value: "heart", label: "Heart", icon: Heart },
  { value: "book", label: "Book", icon: Book },
  { value: "shopping-cart", label: "Shopping", icon: ShoppingCart },
  { value: "zap", label: "Energy", icon: Zap },
  { value: "users", label: "Team", icon: Users },
  { value: "star", label: "Star", icon: Star },
]

const PRESET_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#14B8A6", // Teal
  "#6366F1", // Indigo
]

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [parentCategory, setParentCategory] = useState<Category | null>(null)
  
  // Form state
  const [newName, setNewName] = useState("")
  const [newColor, setNewColor] = useState(PRESET_COLORS[0])
  const [newIcon, setNewIcon] = useState("briefcase")
  const [newHeader, setNewHeader] = useState("")
  const [newParentId, setNewParentId] = useState<string | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    } else if (user) {
      fetchCategories()
    }
  }, [user, authLoading, router])

  async function fetchCategories() {
    try {
      const response = await fetch("/api/categories")
      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }
      const data = await response.json()
      
      // Fetch task count for each category
      const categoriesWithCount = await Promise.all(
        data.map(async (category: Category) => {
          const taskResponse = await fetch(`/api/tasks?categoryId=${category.id}`)
          if (taskResponse.ok) {
            const tasks = await taskResponse.json()
            return { ...category, task_count: tasks.length }
          }
          return { ...category, task_count: 0 }
        })
      )
      
      // Organize categories into hierarchy
      const parentCategories = categoriesWithCount.filter(cat => !cat.parent_id)
      const categoriesWithSubcategories = parentCategories.map(parent => {
        const subcategories = categoriesWithCount.filter(cat => cat.parent_id === parent.id)
        return { ...parent, subcategories }
      })
      
      setCategories(categoriesWithSubcategories)
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault()
    setFormLoading(true)

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
          color: newColor,
          icon: newIcon,
          header: newHeader || undefined,
          parent_id: newParentId || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create category")
      }

      // Reset form and refresh
      setNewName("")
      setNewColor(PRESET_COLORS[0])
      setNewIcon("briefcase")
      setNewHeader("")
      setNewParentId(null)
      setParentCategory(null)
      setShowAddDialog(false)
      await fetchCategories()
    } catch (error) {
      console.error("Error creating category:", error)
    } finally {
      setFormLoading(false)
    }
  }

  async function handleDeleteCategory() {
    if (!categoryToDelete) return
    
    try {
      const response = await fetch(`/api/categories/${categoryToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete category")
      }

      setShowDeleteDialog(false)
      setCategoryToDelete(null)
      await fetchCategories()
    } catch (error) {
      console.error("Error deleting category:", error)
      alert(error instanceof Error ? error.message : "Failed to delete category")
    }
  }

  const getIconComponent = (iconName: string) => {
    const iconData = AVAILABLE_ICONS.find(i => i.value === iconName)
    return iconData?.icon || Briefcase
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
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
              <Settings className="h-6 w-6" />
              Category Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Organize your tasks with custom categories
            </p>
          </div>
          <Button onClick={() => {
            setParentCategory(null)
            setNewParentId(null)
            setShowAddDialog(true)
          }} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = getIconComponent(category.icon)
            return (
              <Card key={category.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <Icon 
                          className="h-5 w-5" 
                          style={{ color: category.color }}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-base">{category.name}</CardTitle>
                        {category.header && (
                          <CardDescription className="text-xs mt-1">
                            {category.header}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {!category.parent_id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setParentCategory(category)
                            setNewParentId(category.id)
                            setShowAddDialog(true)
                          }}
                          title="Add subcategory"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => {
                          setCategoryToDelete(category)
                          setShowDeleteDialog(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Palette className="h-3 w-3" />
                      <span>{category.color}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category.task_count || 0} tasks
                    </Badge>
                  </div>
                  
                  {/* Subcategories */}
                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="mt-4 space-y-2 border-t pt-3">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Subcategories</p>
                      {category.subcategories.map((sub) => {
                        const SubIcon = getIconComponent(sub.icon)
                        return (
                          <div key={sub.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                            <div className="flex items-center gap-2">
                              <div
                                className="p-1 rounded"
                                style={{ backgroundColor: `${sub.color}20` }}
                              >
                                <SubIcon 
                                  className="h-3 w-3" 
                                  style={{ color: sub.color }}
                                />
                              </div>
                              <span className="text-sm">{sub.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {sub.task_count || 0}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive hover:text-destructive"
                                onClick={() => {
                                  setCategoryToDelete(sub)
                                  setShowDeleteDialog(true)
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}

          {categories.length === 0 && (
            <Card className="md:col-span-2 lg:col-span-3">
              <CardContent className="text-center py-12">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  No categories yet. Create your first category to organize your tasks.
                </p>
                <Button onClick={() => setShowAddDialog(true)} variant="outline">
                  Create Category
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={showAddDialog} onOpenChange={(open) => {
        setShowAddDialog(open)
        if (!open) {
          setParentCategory(null)
          setNewParentId(null)
        }
      }}>
        <DialogContent>
          <form onSubmit={handleAddCategory}>
            <DialogHeader>
              <DialogTitle>
                {parentCategory ? `Add Subcategory to ${parentCategory.name}` : "Create New Category"}
              </DialogTitle>
              <DialogDescription>
                {parentCategory 
                  ? "Add a subcategory to better organize your work tasks"
                  : "Add a new category to organize your tasks"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Work, Personal"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="header">Header (Optional)</Label>
                <Input
                  id="header"
                  value={newHeader}
                  onChange={(e) => setNewHeader(e.target.value)}
                  placeholder="e.g., Professional, Life"
                />
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        newColor === color ? "border-primary scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewColor(color)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Select value={newIcon} onValueChange={setNewIcon}>
                  <SelectTrigger id="icon">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_ICONS.map(({ value, label, icon: Icon }) => (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${newColor}20` }}
                  >
                    {(() => {
                      const Icon = getIconComponent(newIcon)
                      return <Icon className="h-5 w-5" style={{ color: newColor }} />
                    })()}
                  </div>
                  <div>
                    <p className="font-medium">{newName || "Category Name"}</p>
                    {newHeader && (
                      <p className="text-xs text-muted-foreground">{newHeader}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                disabled={formLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={formLoading || !newName}>
                {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{categoryToDelete?.name}"?
              {categoryToDelete?.task_count && categoryToDelete.task_count > 0 && (
                <span className="block mt-2 font-semibold text-destructive">
                  This category has {categoryToDelete.task_count} task{categoryToDelete.task_count !== 1 ? 's' : ''}.
                  You cannot delete a category with tasks.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={!!categoryToDelete?.task_count && categoryToDelete.task_count > 0}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}