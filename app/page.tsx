"use client"

import type React from "react"

import { useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Edit3, Printer, Heart, GripVertical } from "lucide-react"
import Link from "next/link"
import { getTodos, addTodo, toggleTodo, updateTodo, deleteTodo, reorderTodos } from "@/app/actions"

interface TodoItem {
  id: string
  text: string
  completed: boolean
  isEditing: boolean
  order: number
}

export default function TodoListPage() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [newTodoText, setNewTodoText] = useState("")
  const [isPending, startTransition] = useTransition()
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [dragOverItem, setDragOverItem] = useState<string | null>(null)

  useEffect(() => {
    // Fetch initial todos on component mount
    startTransition(async () => {
      const initialTodos = await getTodos()
      setTodos(initialTodos.map((todo) => ({ ...todo, isEditing: false })))
    })
  }, [])

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault()
    if (newTodoText.trim()) {
      const formData = new FormData()
      formData.append("text", newTodoText)
      startTransition(async () => {
        await addTodo(formData)
        const updatedTodos = await getTodos()
        setTodos(updatedTodos.map((todo) => ({ ...todo, isEditing: false })))
        setNewTodoText("")
      })
    }
  }

  const handleToggleTodo = async (id: string, completed: boolean) => {
    startTransition(async () => {
      await toggleTodo(id, completed)
      const updatedTodos = await getTodos()
      setTodos(updatedTodos.map((todo) => ({ ...todo, isEditing: false })))
    })
  }

  const handleDeleteTodo = async (id: string) => {
    startTransition(async () => {
      await deleteTodo(id)
      const updatedTodos = await getTodos()
      setTodos(updatedTodos.map((todo) => ({ ...todo, isEditing: false })))
    })
  }

  const handleStartEdit = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, isEditing: true } : todo)))
  }

  const handleSaveEdit = async (id: string, newText: string) => {
    startTransition(async () => {
      await updateTodo(id, newText)
      const updatedTodos = await getTodos()
      setTodos(updatedTodos.map((todo) => ({ ...todo, isEditing: false })))
    })
  }

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, todoId: string) => {
    setDraggedItem(todoId)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/html", todoId)

    // Add some visual feedback
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement
    dragImage.style.transform = "rotate(5deg)"
    dragImage.style.opacity = "0.8"
    e.dataTransfer.setDragImage(dragImage, 0, 0)
  }

  const handleDragOver = (e: React.DragEvent, todoId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverItem(todoId)
  }

  const handleDragLeave = () => {
    setDragOverItem(null)
  }

  const handleDrop = async (e: React.DragEvent, dropTargetId: string) => {
    e.preventDefault()
    setDragOverItem(null)

    if (!draggedItem || draggedItem === dropTargetId) {
      setDraggedItem(null)
      return
    }

    // Create new order
    const newTodos = [...todos]
    const draggedIndex = newTodos.findIndex((todo) => todo.id === draggedItem)
    const targetIndex = newTodos.findIndex((todo) => todo.id === dropTargetId)

    // Remove dragged item and insert at new position
    const [draggedTodo] = newTodos.splice(draggedIndex, 1)
    newTodos.splice(targetIndex, 0, draggedTodo)

    // Update local state immediately for smooth UX
    setTodos(newTodos)
    setDraggedItem(null)

    // Update order in database
    const todoIds = newTodos.map((todo) => todo.id)
    startTransition(async () => {
      await reorderTodos(todoIds)
    })
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverItem(null)
  }

  const completedCount = todos.filter((todo) => todo.completed).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-pink-50 to-yellow-50 relative overflow-hidden">
      {/* Decorative elements - hide on small screens */}
      <div className="hidden sm:block absolute top-10 left-10 text-4xl lg:text-6xl animate-bounce">🌸</div>
      <div className="hidden sm:block absolute top-20 right-20 text-3xl lg:text-4xl animate-pulse">🦋</div>
      <div className="hidden sm:block absolute bottom-20 left-20 text-4xl lg:text-5xl animate-bounce delay-1000">
        🌺
      </div>
      <div className="hidden sm:block absolute bottom-10 right-10 text-3xl lg:text-4xl animate-pulse delay-500">🐿️</div>
      <div className="hidden md:block absolute top-1/2 left-5 text-2xl lg:text-3xl animate-bounce delay-700">🌿</div>
      <div className="hidden md:block absolute top-1/3 right-5 text-2xl lg:text-3xl animate-pulse delay-300">🌻</div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-green-800 mb-4 drop-shadow-lg">
            🌿 Bogor Adventure List 🌿
          </h1>
          <p className="text-lg text-gray-600">Drag & drop untuk mengatur urutan kegiatan! 🎯</p>
        </div>

        <div className="max-w-2xl mx-auto px-4">
          <Card className="mb-6 border-2 border-green-200 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-100 to-pink-100">
              <CardTitle className="text-center text-green-800">
                Progress: {completedCount}/{todos.length} kegiatan selesai! 🎉
              </CardTitle>
              <div className="w-full bg-green-200 rounded-full h-3 mt-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-pink-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${todos.length > 0 ? (completedCount / todos.length) * 100 : 0}%` }}
                ></div>
              </div>
            </CardHeader>
          </Card>

          <Card className="mb-6 border-2 border-pink-200 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Tambah Kegiatan Baru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddTodo} className="flex gap-2">
                <Input
                  name="text"
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  placeholder="Mau ngapain lagi di Bogor? 🤔"
                  className="border-green-300 focus:border-pink-400"
                  disabled={isPending}
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-green-400 to-pink-400 hover:from-green-500 hover:to-pink-500"
                  disabled={isPending}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="mb-6 border-2 border-yellow-200 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <GripVertical className="w-5 h-5" />
                Daftar Kegiatan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todos.length === 0 && !isPending ? (
                <p className="text-center text-gray-500">Tidak ada kegiatan. Tambahkan yang baru!</p>
              ) : (
                todos.map((todo, index) => (
                  <div
                    key={todo.id}
                    draggable={!todo.isEditing && !isPending}
                    onDragStart={(e) => handleDragStart(e, todo.id)}
                    onDragOver={(e) => handleDragOver(e, todo.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, todo.id)}
                    onDragEnd={handleDragEnd}
                    className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-lg border-2 transition-all duration-300 cursor-move ${
                      todo.completed
                        ? "bg-green-50 border-green-200 opacity-75"
                        : "bg-white border-pink-200 hover:border-pink-300"
                    } ${draggedItem === todo.id ? "opacity-50 scale-105 rotate-2 shadow-lg" : ""} ${
                      dragOverItem === todo.id && draggedItem !== todo.id ? "border-blue-400 bg-blue-50 scale-102" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
                      {/* Drag Handle */}
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing" />
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full min-w-[24px] text-center">
                          {index + 1}
                        </span>
                      </div>

                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => handleToggleTodo(todo.id, todo.completed)}
                        className="data-[state=checked]:bg-green-500 flex-shrink-0"
                        disabled={isPending}
                      />

                      {todo.isEditing ? (
                        <Input
                          defaultValue={todo.text}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleSaveEdit(todo.id, (e.target as HTMLInputElement).value)
                            }
                          }}
                          onBlur={(e) => handleSaveEdit(todo.id, (e.target as HTMLInputElement).value)}
                          className="flex-1"
                          autoFocus
                          disabled={isPending}
                        />
                      ) : (
                        <span className={`flex-1 ${todo.completed ? "line-through text-green-600" : "text-gray-800"}`}>
                          {todo.text}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-1 w-full sm:w-auto justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartEdit(todo.id)}
                        className="text-blue-600 hover:text-blue-800"
                        disabled={isPending}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="text-red-600 hover:text-red-800"
                        disabled={isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
              {isPending && (
                <div className="text-center text-gray-500">
                  <p>Loading...</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/print">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white">
                <Printer className="w-4 h-4 mr-2" />
                Print untuk Foto
              </Button>
            </Link>
            <Link href="/surprise">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-pink-400 to-red-400 hover:from-pink-500 hover:to-red-500 text-white relative overflow-hidden">
                <div className="flex items-center">
                  <div className="animate-pulse mr-2">🔒</div>
                  <Heart className="w-4 h-4 mr-2" />
                  Surprise! 💕
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .cursor-grab {
          cursor: grab;
        }
        
        .cursor-grabbing {
          cursor: grabbing;
        }
        
        .scale-102 {
          transform: scale(1.02);
        }
        
        [draggable="true"] {
          user-select: none;
        }
        
        [draggable="true"]:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  )
}
