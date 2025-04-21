"use server"

import { supabase } from "./supabase"

// This is a placeholder for actual authentication logic
// In a real application, you would use a proper authentication system

interface User {
  id: string
  name: string
  email: string
}

interface LoginCredentials {
  email: string
  password: string
}

interface SignupCredentials {
  name: string
  email: string
  password: string
}

export async function loginUser(credentials: LoginCredentials): Promise<boolean> {
  console.log("Attempting login in auth-actions")
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  })

  if (error) {
    console.error('Login error in auth-actions:', error.message)
    return false
  }

  console.log("Login successful in auth-actions, user:", data.user)
  return !!data.user
}

export async function signupUser(credentials: SignupCredentials): Promise<boolean> {
  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      data: {
        name: credentials.name,
      },
    },
  })

  if (error) {
    console.error('Signup error:', error.message)
    return false
  }

  return !!data.user
}

export async function logoutUser(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Logout error:', error.message)
    throw error
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    console.log("Getting current user...")
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error("Session error:", sessionError)
      return null
    }

    if (!session) {
      console.log("No session found")
      return null
    }

    console.log("Session found:", session)

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) {
      console.error("User error:", userError)
      return null
    }

    if (!user) {
      console.log("No user found")
      return null
    }

    console.log("User found:", user)

    return {
      id: user.id,
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}
