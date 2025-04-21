"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { type TodoItem, updateTodo } from "@/lib/todo-actions"

interface EditTodoDialogProps {
  todo: TodoItem
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updatedTodo: TodoItem) => void
}

export function EditTodoDialog({ todo, open, onOpenChange, onSave }: EditTodoDialogProps) {
  const [title, setTitle] = useState(todo.title)
  const [description, setDescription] = useState(todo.description || "")
  const [status, setStatus] = useState(todo.status)
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
      const updatedTodo = {
        ...todo,
        title,
        description,
        status,
      }

      await updateTodo(updatedTodo)
      onSave(updatedTodo)

      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update task",
        description: "Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Make changes to your task here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <Select value={status} onValueChange={(value: "In Progress" | "Done") => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
