"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { addTodo } from "@/lib/todo-actions"
import { PlusCircle, X } from "lucide-react"

interface AddTodoFormProps {
  onTodoAdded?: () => void;
}

export function AddTodoForm({ onTodoAdded }: AddTodoFormProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Title is required",
        description: "Please enter a title for your task.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await addTodo({
        title,
        description,
        status: "In Progress",
      })

      toast({
        title: "Task added",
        description: "Your new task has been added successfully.",
      })

      // Reset form
      setTitle("")
      setDescription("")
      setIsExpanded(false)
      
      // Call the callback to refresh the todo list
      if (onTodoAdded) {
        onTodoAdded();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to add task",
        description: "Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setTitle("")
    setDescription("")
    setIsExpanded(false)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Add New Task</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Task title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (!isExpanded && e.target.value) {
                    setIsExpanded(true)
                  }
                }}
                onFocus={() => setIsExpanded(true)}
              />
            </div>

            {isExpanded && (
              <div className="space-y-2">
                <Textarea
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>
        </CardContent>

        {isExpanded && (
          <CardFooter className="flex justify-between">
            <Button type="button" variant="ghost" onClick={handleCancel} disabled={isSubmitting}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <PlusCircle className="h-4 w-4 mr-2" />
              {isSubmitting ? "Adding..." : "Add Task"}
            </Button>
          </CardFooter>
        )}
      </form>
    </Card>
  )
}
