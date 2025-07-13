import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TodoList - Unified Task Management",
  description: "A powerful task management application for busy professionals",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}