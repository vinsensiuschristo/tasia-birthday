"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Edit3, Printer, Heart } from "lucide-react";
import Link from "next/link";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  isEditing: boolean;
}

export default function TodoListPage() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    const savedTodos = localStorage.getItem("bogor-todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    } else {
      // Default Bogor activities
      const defaultTodos = [
        {
          id: "1",
          text: "Jalan-jalan di Kebun Raya Bogor 🌿",
          completed: false,
          isEditing: false,
        },
        {
          id: "2",
          text: "Foto di depan Istana Bogor 🏰",
          completed: false,
          isEditing: false,
        },
        {
          id: "3",
          text: "Makan soto Bogor yang enak 🍲",
          completed: false,
          isEditing: false,
        },
        {
          id: "4",
          text: "Beli oleh-oleh khas Bogor 🎁",
          completed: false,
          isEditing: false,
        },
        {
          id: "5",
          text: "Naik delman keliling kota 🐴",
          completed: false,
          isEditing: false,
        },
      ];
      setTodos(defaultTodos);
      localStorage.setItem("bogor-todos", JSON.stringify(defaultTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bogor-todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const newItem: TodoItem = {
        id: Date.now().toString(),
        text: newTodo,
        completed: false,
        isEditing: false,
      };
      setTodos([...todos, newItem]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEdit = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: true } : todo
      )
    );
  };

  const saveEdit = (id: string, newText: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText, isEditing: false } : todo
      )
    );
  };

  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-pink-50 to-yellow-50 relative overflow-hidden">
      {/* Decorative elements - hide on small screens */}
      <div className="hidden sm:block absolute top-10 left-10 text-4xl lg:text-6xl animate-bounce">
        🌸
      </div>
      <div className="hidden sm:block absolute top-20 right-20 text-3xl lg:text-4xl animate-pulse">
        🦋
      </div>
      <div className="hidden sm:block absolute bottom-20 left-20 text-4xl lg:text-5xl animate-bounce delay-1000">
        🌺
      </div>
      <div className="hidden sm:block absolute bottom-10 right-10 text-3xl lg:text-4xl animate-pulse delay-500">
        🐿️
      </div>
      <div className="hidden md:block absolute top-1/2 left-5 text-2xl lg:text-3xl animate-bounce delay-700">
        🌿
      </div>
      <div className="hidden md:block absolute top-1/3 right-5 text-2xl lg:text-3xl animate-pulse delay-300">
        🌻
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-green-800 mb-4 drop-shadow-lg">
            Tasia Day List
          </h1>
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
                  style={{
                    width: `${
                      todos.length > 0
                        ? (completedCount / todos.length) * 100
                        : 0
                    }%`,
                  }}
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
              <div className="flex gap-2">
                <Input
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Mau ngapain lagi di Bogor? 🤔"
                  onKeyPress={(e) => e.key === "Enter" && addTodo()}
                  className="border-green-300 focus:border-pink-400"
                />
                <Button
                  onClick={addTodo}
                  className="bg-gradient-to-r from-green-400 to-pink-400 hover:from-green-500 hover:to-pink-500"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 border-2 border-yellow-200 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-800">Daftar Kegiatan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-lg border-2 transition-all duration-300 ${
                    todo.completed
                      ? "bg-green-50 border-green-200 opacity-75"
                      : "bg-white border-pink-200 hover:border-pink-300"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      className="data-[state=checked]:bg-green-500 flex-shrink-0"
                    />

                    {todo.isEditing ? (
                      <Input
                        defaultValue={todo.text}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            saveEdit(
                              todo.id,
                              (e.target as HTMLInputElement).value
                            );
                          }
                        }}
                        onBlur={(e) => saveEdit(todo.id, e.target.value)}
                        className="flex-1"
                        autoFocus
                      />
                    ) : (
                      <span
                        className={`flex-1 ${
                          todo.completed
                            ? "line-through text-green-600"
                            : "text-gray-800"
                        }`}
                      >
                        {todo.text}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-1 w-full sm:w-auto justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(todo.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/print">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white">
                <Printer className="w-4 h-4 mr-2" />
                Print
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
    </div>
  );
}
