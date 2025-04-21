"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { loginUser } from "@/lib/auth-actions"
import { supabase } from "@/lib/supabase"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      console.log("Attempting login with:", email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Login error:", error)
        if (error.message === "Email not confirmed") {
          setError("Please check your email for the confirmation link.")
        } else if (error.message === "Invalid login credentials") {
          setError("Invalid email or password. Please try again.")
        } else {
          setError(error.message)
        }
        return
      }

      if (data.user) {
        console.log("Login successful, user:", data.user)
        toast({
          title: "Login successful",
          description: "Redirecting to dashboard...",
        })
        // Force a hard navigation to ensure the session is properly set
        window.location.href = "/dashboard"
      }
    } catch (error) {
      console.error("Unexpected error during login:", error)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    const email = (document.getElementById("email") as HTMLInputElement).value
    if (!email) {
      setError("Please enter your email address")
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      toast({
        title: "Password reset email sent",
        description: "Check your email for the password reset link",
      })
    } catch (error) {
      setError("Failed to send reset email. Please try again.")
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="name@example.com" required disabled={isLoading} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Button 
            type="button" 
            variant="link" 
            className="px-0 font-normal h-auto" 
            size="sm"
            onClick={handleForgotPassword}
          >
            Forgot password?
          </Button>
        </div>
        <Input id="password" name="password" type="password" required disabled={isLoading} />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  )
}
