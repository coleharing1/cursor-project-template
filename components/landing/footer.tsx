/**
 * @fileoverview The footer component for the landing page.
 * It contains navigation links, legal information, and the company copyright.
 */
import Link from "next/link"
import { Target } from "lucide-react"

export function Footer() {
  return (
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
  )
} 