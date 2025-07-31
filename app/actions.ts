// app/actions.ts
"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"

interface TodoItem {
  id: string
  text: string
  completed: boolean
  order: number
}

export async function getTodos(): Promise<TodoItem[]> {
  const { data, error } = await supabase.from("todos").select("*").order("order", { ascending: true })

  if (error) {
    console.error("Error fetching todos:", error)
    return []
  }

  return data as TodoItem[]
}

export async function addTodo(formData: FormData) {
  const text = formData.get("text") as string
  if (!text) return

  // Get max order
  const { data: maxOrderData } = await supabase
    .from("todos")
    .select("order")
    .order("order", { ascending: false })
    .limit(1)

  const maxOrder = maxOrderData && maxOrderData.length > 0 ? maxOrderData[0].order : 0

  const { error } = await supabase.from("todos").insert({
    text,
    order: maxOrder + 1,
    completed: false,
  })

  if (error) {
    console.error("Error adding todo:", error)
  }

  revalidatePath("/")
}

export async function toggleTodo(id: string, completed: boolean) {
  const { error } = await supabase.from("todos").update({ completed: !completed }).eq("id", id)

  if (error) {
    console.error("Error toggling todo:", error)
  }

  revalidatePath("/")
}

export async function updateTodo(id: string, newText: string) {
  const { error } = await supabase.from("todos").update({ text: newText }).eq("id", id)

  if (error) {
    console.error("Error updating todo:", error)
  }

  revalidatePath("/")
}

export async function deleteTodo(id: string) {
  const { error } = await supabase.from("todos").delete().eq("id", id)

  if (error) {
    console.error("Error deleting todo:", error)
  }

  revalidatePath("/")
}

export async function reorderTodos(todoIds: string[]) {
  try {
    // Update order for each todo
    const updates = todoIds.map((id, index) =>
      supabase
        .from("todos")
        .update({ order: index + 1 })
        .eq("id", id),
    )

    await Promise.all(updates)
    revalidatePath("/")
  } catch (error) {
    console.error("Error reordering todos:", error)
  }
}
