/**
 * @fileoverview The header component for the landing page.
 * It contains the app logo and navigation links for login/signup or the dashboard.
 */
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Target } from "lucide-react"

interface LandingHeaderProps {
  session: any // Using 'any' for simplicity, consider a proper session type
}

export function LandingHeader({ session }: LandingHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">TodoList</span>
        </div>
        <nav className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/tasks/all">
                <Button>Go to Tasks</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started Free</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
} 