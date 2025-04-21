"use client"

import { TodoList } from "@/components/todo-list"
import { AddTodoForm } from "@/components/add-todo-form"
import { UserNav } from "@/components/user-nav"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-actions"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from "@/lib/supabase"
import { Session } from '@supabase/supabase-js'

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking auth in dashboard...")
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error("Session error in dashboard:", sessionError)
          router.push("/login?from=dashboard")
          return
        }

        if (!session) {
          console.log("No session found in dashboard")
          router.push("/login?from=dashboard")
          return
        }

        console.log("Session found in dashboard:", session)
        setIsAuthenticated(true)
        setSession(session)
      } catch (error) {
        console.error("Auth check failed in dashboard:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session)
      if (event === "SIGNED_IN") {
        setIsAuthenticated(true)
        setSession(session)
      } else if (event === "SIGNED_OUT") {
        setIsAuthenticated(false)
        setSession(null)
        router.push("/login?from=dashboard")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b">
          <div className="flex h-16 items-center px-4">
            <Link href="/" className="font-bold text-xl">
              DoDidDone
            </Link>
            <div className="ml-auto">
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </header>
        <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
          <div className="flex flex-col space-y-8">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <Link href="/" className="font-bold text-xl">
            DoDidDone
          </Link>
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome{session?.user?.user_metadata?.name ? `, ${session.user.user_metadata.name}` : ' back'}!
            </h1>
            <p className="text-muted-foreground">Manage your tasks and stay organized.</p>
          </div>
          <AddTodoForm />
          <TodoList />
        </div>
      </main>
    </div>
  )
}
