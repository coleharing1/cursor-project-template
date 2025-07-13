/**
 * @fileoverview The "How It Works" section of the landing page.
 * It outlines the three simple steps to get started with the app.
 */
export function HowItWorksSection() {
  return (
    <section className="border-y bg-secondary/30 py-16">
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
  )
} 