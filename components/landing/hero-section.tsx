/**
 * @fileoverview The hero section of the landing page.
 * It includes the main headline, a brief description of the app, and primary call-to-action buttons.
 */
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, Users, Star, Shield } from "lucide-react"

export function HeroSection() {
  return (
    <section className="container px-4 pt-24 text-center">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
          <Sparkles className="h-4 w-4" />
          <span>Introducing the future of task management</span>
        </div>
        
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
          One place for all your
          <span className="block text-primary">life's tasks</span>
        </h1>
        
        <p className="text-xl text-muted-foreground">
          Stop juggling multiple todo apps. TodoList unifies your work tasks, personal goals, 
          and creative projects in one beautiful, intelligent workspace.
        </p>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/signup">
            <Button size="lg" className="gap-2">
              Start Free Today <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline">
              See How It Works
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>10k+ users</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-current" />
            <span>4.9/5 rating</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>SOC2 compliant</span>
          </div>
        </div>
      </div>
    </section>
  )
} 