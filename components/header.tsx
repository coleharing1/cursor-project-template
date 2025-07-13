"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ListTodo, Target, Clock, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/providers/auth-provider"

export function Header() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "All Tasks", href: "/tasks/all", icon: ListTodo },
    { name: "Today's Focus", href: "/focus/today", icon: Target },
    { name: "History", href: "/log", icon: Clock },
    { name: "Settings", href: "/settings/categories", icon: Settings },
  ]

  async function handleLogout() {
    await signOut()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <Target className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">TodoList</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "flex items-center gap-2",
                      isActive && "bg-secondary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden md:inline-block">{item.name}</span>
                  </Button>
                </Link>
              )
            })}
          </nav>
          <Button variant="ghost" size="sm" className="ml-4" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span className="ml-2 hidden md:inline-block">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}