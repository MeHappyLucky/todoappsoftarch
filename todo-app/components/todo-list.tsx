"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Pencil, Trash2, LayoutGrid, List } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { type TodoItem, fetchTodos, updateTodoStatus, deleteTodo } from "@/lib/todo-actions"
import { EditTodoDialog } from "@/components/edit-todo-dialog"

export function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [viewMode, setViewMode] = useState<"card" | "list">("card")
  const [isLoading, setIsLoading] = useState(true)
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await fetchTodos()
        setTodos(data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to load todos",
          description: "Please try again later.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadTodos()
  }, [toast])

  const handleStatusChange = async (id: string, completed: boolean) => {
    try {
      await updateTodoStatus(id, completed)
      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, status: completed ? "Done" : "In Progress" } : todo)))
      toast({
        title: `Task ${completed ? "completed" : "marked as in progress"}`,
        description: "Task status updated successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update status",
        description: "Please try again.",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id)
      setTodos(todos.filter((todo) => todo.id !== id))
      toast({
        title: "Task deleted",
        description: "Task has been removed successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete task",
        description: "Please try again.",
      })
    }
  }

  const handleEdit = (todo: TodoItem) => {
    setEditingTodo(todo)
  }

  const handleEditSave = (updatedTodo: TodoItem) => {
    setTodos(todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)))
    setEditingTodo(null)
  }

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading tasks...</div>
  }

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
        <p className="text-muted-foreground mb-6">Add a new task to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Tasks ({todos.length})</h2>
        <div className="flex space-x-2">
          <Button variant={viewMode === "card" ? "default" : "outline"} size="sm" onClick={() => setViewMode("card")}>
            <LayoutGrid className="h-4 w-4 mr-2" />
            Card
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
        </div>
      </div>

      {viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {todos.map((todo) => (
            <Card key={todo.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{todo.title}</CardTitle>
                  <Badge variant={todo.status === "Done" ? "default" : "outline"}>{todo.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{todo.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between pt-2 border-t">
                <Checkbox
                  checked={todo.status === "Done"}
                  onCheckedChange={(checked: boolean) => handleStatusChange(todo.id, checked)}
                />
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(todo)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(todo.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border rounded-md">
          <div className="divide-y">
            {todos.map((todo) => (
              <div key={todo.id} className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <Checkbox
                    checked={todo.status === "Done"}
                    onCheckedChange={(checked: boolean) => handleStatusChange(todo.id, checked)}
                  />
                  <div>
                    <p className={`font-medium ${todo.status === "Done" ? "line-through text-muted-foreground" : ""}`}>
                      {todo.title}
                    </p>
                    <Badge variant={todo.status === "Done" ? "default" : "outline"} className="mt-1">
                      {todo.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(todo)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(todo.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {editingTodo && (
        <EditTodoDialog
          todo={editingTodo}
          open={!!editingTodo}
          onOpenChange={() => setEditingTodo(null)}
          onSave={handleEditSave}
        />
      )}
    </div>
  )
}
