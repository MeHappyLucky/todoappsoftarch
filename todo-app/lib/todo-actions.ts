import { supabase } from "./supabase"

// This is a placeholder for actual database operations
// In a real application, you would connect to a database

// Update the TodoItem interface to remove photoUrl
export interface TodoItem {
  id: string
  title: string
  description?: string
  status: "In Progress" | "Done"
  created_at: string
  updated_at: string
  user_id: string
}

// Update the sample todos to remove photoUrl field
let todos: TodoItem[] = [
  {
    id: "1",
    title: "Complete project proposal",
    description: "Draft the initial project proposal with timeline and budget estimates",
    status: "In Progress",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: "user1",
  },
  {
    id: "2",
    title: "Schedule team meeting",
    description: "Set up weekly team sync to discuss progress and blockers",
    status: "Done",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: "user1",
  },
  {
    id: "3",
    title: "Research new technologies",
    description: "Investigate potential new tools for the upcoming project",
    status: "In Progress",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: "user1",
  },
]

export async function fetchTodos(): Promise<TodoItem[]> {
  try {
    console.log("Fetching todos...")
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error("Error getting user:", userError)
      throw new Error(`User authentication error: ${userError.message}`)
    }

    if (!user) {
      console.log("No user found")
      throw new Error("User not authenticated")
    }

    console.log("Fetching todos for user:", user.id)
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching todos:", error)
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      throw new Error(`Database error: ${error.message}`)
    }

    console.log("Fetched todos:", data)
    return data || []
  } catch (error) {
    console.error("Error in fetchTodos:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to fetch todos: ${error.message}`)
    }
    throw error
  }
}

// Update the addTodo function to remove photoUrl
export async function addTodo(todoData: {
  title: string
  description?: string
  status: "In Progress" | "Done"
}): Promise<TodoItem> {
  try {
    console.log("Adding todo...")
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error("Error getting user:", userError)
      throw new Error("User not authenticated")
    }

    console.log("Adding todo for user:", user.id)
    const { data, error } = await supabase
      .from('todos')
      .insert([{
        title: todoData.title,
        description: todoData.description || "",
        status: todoData.status,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single()

    if (error) {
      console.error("Error adding todo:", error)
      throw error
    }

    console.log("Added todo:", data)
    return data
  } catch (error) {
    console.error("Error in addTodo:", error)
    throw error
  }
}

export async function updateTodo(todo: TodoItem): Promise<TodoItem> {
  try {
    console.log("Updating todo...")
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error("Error getting user:", userError)
      throw new Error("User not authenticated")
    }

    console.log("Updating todo for user:", user.id)
    const { data, error } = await supabase
      .from('todos')
      .update({
        title: todo.title,
        description: todo.description,
        status: todo.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', todo.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating todo:", error)
      throw error
    }

    console.log("Updated todo:", data)
    return data
  } catch (error) {
    console.error("Error in updateTodo:", error)
    throw error
  }
}

export async function updateTodoStatus(id: string, completed: boolean): Promise<TodoItem> {
  try {
    console.log("Updating todo status...")
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error("Error getting user:", userError)
      throw new Error("User not authenticated")
    }

    console.log("Updating todo status for user:", user.id)
    const { data, error } = await supabase
      .from('todos')
      .update({
        status: completed ? "Done" : "In Progress",
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating todo status:", error)
      throw error
    }

    console.log("Updated todo status:", data)
    return data
  } catch (error) {
    console.error("Error in updateTodoStatus:", error)
    throw error
  }
}

export async function deleteTodo(id: string): Promise<void> {
  try {
    console.log("Deleting todo...")
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error("Error getting user:", userError)
      throw new Error("User not authenticated")
    }

    console.log("Deleting todo for user:", user.id)
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error("Error deleting todo:", error)
      throw error
    }

    console.log("Deleted todo:", id)
  } catch (error) {
    console.error("Error in deleteTodo:", error)
    throw error
  }
}
