"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export function UserNav() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log("Loading user in UserNav...")
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          console.error("Error loading user:", error)
          return
        }

        if (user) {
          console.log("User loaded:", user)
          setUser(user)
        }
      } catch (error) {
        console.error("Error in loadUser:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed in UserNav:", event)
      if (event === "SIGNED_IN") {
        setUser(session?.user)
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    try {
      console.log("Logging out...")
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push("/")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    )
  }

  if (!user) {
    return (
      <Button variant="outline" onClick={() => router.push("/login")}>
        Login
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
