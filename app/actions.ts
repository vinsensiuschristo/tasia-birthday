// app/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export async function getTodos(): Promise<TodoItem[]> {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
  return data as TodoItem[];
}

export async function addTodo(formData: FormData) {
  const text = formData.get("text") as string;
  if (!text) return;

  const { error } = await supabase.from("todos").insert({ text });
  if (error) {
    console.error("Error adding todo:", error);
  }
  revalidatePath("/"); // Revalidate the home page to show updated todos
}

export async function toggleTodo(id: string, completed: boolean) {
  const { error } = await supabase
    .from("todos")
    .update({ completed: !completed })
    .eq("id", id);
  if (error) {
    console.error("Error toggling todo:", error);
  }
  revalidatePath("/");
}

export async function updateTodo(id: string, newText: string) {
  const { error } = await supabase
    .from("todos")
    .update({ text: newText })
    .eq("id", id);
  if (error) {
    console.error("Error updating todo:", error);
  }
  revalidatePath("/");
}

export async function deleteTodo(id: string) {
  const { error } = await supabase.from("todos").delete().eq("id", id);
  if (error) {
    console.error("Error deleting todo:", error);
  }
  revalidatePath("/");
}
