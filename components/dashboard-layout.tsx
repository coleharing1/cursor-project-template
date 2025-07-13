"use client"

import { ReactNode } from "react"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"

interface DashboardLayoutProps {
  children: ReactNode
  showSidebar?: boolean
}

export function DashboardLayout({ children, showSidebar = false }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        {showSidebar && (
          <aside className="w-64 border-r bg-card">
            <Navigation />
          </aside>
        )}
        <main className="flex-1">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}