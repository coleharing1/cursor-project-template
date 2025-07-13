"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, ArrowLeft } from "lucide-react"

export default function CheckEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>
            We've sent you a confirmation link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            We've sent an email to your inbox with a link to confirm your account. 
            Please click the link to complete your registration.
          </p>
          
          <div className="bg-secondary/50 rounded-lg p-4">
            <h3 className="font-medium mb-2">Didn't receive the email?</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Check your spam or junk folder</li>
              <li>• Make sure you entered the correct email</li>
              <li>• Wait a few minutes and check again</li>
            </ul>
          </div>
          
          <div className="pt-4">
            <Link href="/login">
              <Button variant="outline" className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}