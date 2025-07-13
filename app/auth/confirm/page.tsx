"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react"

export default function ConfirmEmail() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check if we have a confirmation token in the URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const error = hashParams.get("error")
    const errorDescription = hashParams.get("error_description")
    const accessToken = hashParams.get("access_token")
    const type = hashParams.get("type")

    if (error) {
      setStatus("error")
      setMessage(errorDescription || "An error occurred during email confirmation")
    } else if (accessToken && type === "signup") {
      setStatus("success")
      setMessage("Email confirmed successfully! You can now log in to your account.")
      // Don't auto-redirect for signup confirmation, let user log in manually
    } else if (accessToken) {
      setStatus("success")
      setMessage("Email confirmed successfully! Redirecting to dashboard...")
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } else {
      setStatus("error")
      setMessage("No confirmation token found")
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === "loading" && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <CardTitle>Confirming your email...</CardTitle>
            </>
          )}
          {status === "success" && (
            <>
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
              <CardTitle>Email Confirmed!</CardTitle>
            </>
          )}
          {status === "error" && (
            <>
              <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <CardTitle>Confirmation Failed</CardTitle>
            </>
          )}
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <CardDescription>{message}</CardDescription>
          
          {status === "success" && (
            <div className="space-y-4">
              <Link href="/login">
                <Button className="w-full">Go to Login</Button>
              </Link>
            </div>
          )}
          
          {status === "error" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Please check your email for a confirmation link or try signing up again.
              </p>
              <div className="flex flex-col gap-2">
                <Link href="/login">
                  <Button className="w-full">Go to Login</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" className="w-full">Sign Up Again</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}