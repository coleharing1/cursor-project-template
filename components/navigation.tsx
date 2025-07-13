"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ListTodo, Target, Clock, Settings, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      color: "text-sky-500",
    },
    {
      label: "All Tasks",
      icon: ListTodo,
      href: "/tasks/all",
      color: "text-violet-500",
    },
    {
      label: "Today's Focus",
      icon: Target,
      href: "/focus/today",
      color: "text-pink-700",
    },
    {
      label: "History",
      icon: Clock,
      href: "/log",
      color: "text-orange-700",
    },
    {
      label: "Categories",
      icon: Settings,
      href: "/settings/categories",
      color: "text-emerald-500",
    },
  ]

  return (
    <div className={cn("space-y-4 py-4 flex flex-col h-full", className)}>
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <Target className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-xl font-bold">TodoList</h1>
        </Link>
        <div className="space-y-1">
          <Button
            variant="outline"
            className="w-full justify-start mb-4"
            asChild
          >
            <Link href="/tasks/new">
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Link>
          </Button>
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                pathname === route.href
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground"
              )}
            >
              <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
              {route.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}