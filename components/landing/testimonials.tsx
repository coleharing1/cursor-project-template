/**
 * @fileoverview The testimonials section of the landing page.
 * It displays quotes from satisfied users.
 */
import { Card, CardDescription, CardHeader } from "@/components/ui/card"
import { Star } from "lucide-react"

export function TestimonialsSection() {
  return (
    <section className="container px-4">
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
  )
} 