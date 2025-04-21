"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { signupUser } from "@/lib/auth-actions"

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
      })
      setIsLoading(false)
      return
    }

    try {
      // This would be replaced with actual signup logic
      const success = await signupUser({ name, email, password })

      if (success) {
        toast({
          title: "Account created",
          description: "You can now log in with your credentials.",
        })
        router.push("/login")
      } else {
        toast({
          variant: "destructive",
          title: "Signup failed",
          description: "Email might already be in use.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" placeholder="John Doe" required disabled={isLoading} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="name@example.com" required disabled={isLoading} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required disabled={isLoading} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required disabled={isLoading} />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  )
}
