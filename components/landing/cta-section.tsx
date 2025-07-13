/**
 * @fileoverview The final call-to-action (CTA) section of the landing page.
 * It encourages users to sign up for a free account.
 */
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
  return (
    <section className="border-t bg-primary/5 py-16">
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
  )
} 