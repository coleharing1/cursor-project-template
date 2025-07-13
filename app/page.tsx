import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Target, 
  Sparkles, 
  Clock, 
  BarChart3, 
  Layers, 
  Zap,
  ArrowRight,
  Star,
  Users,
  Shield,
  Smartphone
} from "lucide-react"
import { getSession } from '@/lib/supabaseClient'

export default async function Home() {
  const session = await getSession()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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

      <main>
        {/* Hero */}
        <section className="container px-4 py-24 text-center">
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

        {/* Problem Statement */}
        <section className="container px-4 py-16">
          <Card className="mx-auto max-w-4xl border-destructive/20 bg-destructive/5">
            <CardContent className="p-8 text-center">
              <h2 className="mb-4 text-2xl font-bold">The Problem With Traditional Todo Apps</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <div className="mb-2 text-4xl">📱📝📊</div>
                  <p className="text-sm text-muted-foreground">
                    Multiple apps for different areas of life
                  </p>
                </div>
                <div>
                  <div className="mb-2 text-4xl">⏰</div>
                  <p className="text-sm text-muted-foreground">
                    30+ minutes daily planning overhead
                  </p>
                </div>
                <div>
                  <div className="mb-2 text-4xl">📉</div>
                  <p className="text-sm text-muted-foreground">
                    No visibility into progress over time
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Features */}
        <section id="features" className="container px-4 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Everything you need to stay organized
            </h2>
            <p className="mb-12 text-lg text-muted-foreground">
              Powerful features designed for how you actually work
            </p>
          </div>
          
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <Target className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Today's Focus</CardTitle>
                <CardDescription>
                  Select tasks from any list for your daily focus. Auto-resets at midnight.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <Layers className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Hierarchical Tasks</CardTitle>
                <CardDescription>
                  Break down big ideas into subtasks. Organize with custom categories and colors.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <Clock className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Time Tracking</CardTitle>
                <CardDescription>
                  Estimate task duration and track actual time spent. Improve your planning.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Progress Analytics</CardTitle>
                <CardDescription>
                  Visualize completion rates, productivity trends, and celebrate achievements.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Optimistic updates and real-time sync. Works offline and syncs when ready.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <Smartphone className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Works Everywhere</CardTitle>
                <CardDescription>
                  Beautiful on desktop, tablet, and mobile. Your tasks follow you anywhere.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section className="border-y bg-secondary/30 py-24">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                Get organized in 3 simple steps
              </h2>
              <p className="mb-12 text-lg text-muted-foreground">
                From chaos to clarity in minutes, not hours
              </p>
            </div>
            
            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                  1
                </div>
                <h3 className="mb-2 text-xl font-semibold">Create Categories</h3>
                <p className="text-muted-foreground">
                  Set up categories for different areas of your life with custom colors and icons
                </p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                  2
                </div>
                <h3 className="mb-2 text-xl font-semibold">Add Your Tasks</h3>
                <p className="text-muted-foreground">
                  Brain dump everything. Add details, priorities, due dates, and organize hierarchically
                </p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                  3
                </div>
                <h3 className="mb-2 text-xl font-semibold">Focus Daily</h3>
                <p className="text-muted-foreground">
                  Each morning, pick tasks for today's focus. Watch your productivity soar
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="container px-4 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-12 text-3xl font-bold sm:text-4xl">
              Loved by productive people everywhere
            </h2>
          </div>
          
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <CardDescription>
                  "Finally, a todo app that gets how my brain works. The focus view changed my life!"
                </CardDescription>
                <p className="mt-4 text-sm font-medium">Sarah Chen</p>
                <p className="text-xs text-muted-foreground">Product Manager</p>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <CardDescription>
                  "I replaced 4 different apps with TodoList. My productivity has never been higher."
                </CardDescription>
                <p className="mt-4 text-sm font-medium">Marcus Rodriguez</p>
                <p className="text-xs text-muted-foreground">Entrepreneur</p>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <CardDescription>
                  "The analytics help me understand where my time actually goes. Game changer!"
                </CardDescription>
                <p className="mt-4 text-sm font-medium">Emily Watson</p>
                <p className="text-xs text-muted-foreground">Creative Director</p>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t bg-primary/5 py-24">
          <div className="container px-4 text-center">
            <div className="mx-auto max-w-3xl space-y-8">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Ready to take control of your tasks?
              </h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of professionals who've simplified their lives with TodoList
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link href="/signup">
                  <Button size="lg" className="gap-2">
                    Start Your Free Account <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline">
                  Watch 2-min Demo
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                No credit card required • Free forever for personal use • 5-minute setup
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                <span className="font-bold">TodoList</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The unified task management platform for modern professionals.
              </p>
            </div>
            
            <div>
              <h4 className="mb-4 font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-primary">Features</Link></li>
                <li><Link href="#" className="hover:text-primary">Pricing</Link></li>
                <li><Link href="#" className="hover:text-primary">Roadmap</Link></li>
                <li><Link href="#" className="hover:text-primary">Changelog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="mb-4 font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">About</Link></li>
                <li><Link href="#" className="hover:text-primary">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary">Careers</Link></li>
                <li><Link href="#" className="hover:text-primary">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="mb-4 font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-primary">Security</Link></li>
                <li><Link href="#" className="hover:text-primary">GDPR</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            © 2025 TodoList. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}