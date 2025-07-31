"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Printer, ArrowLeft, Heart } from "lucide-react"
import Link from "next/link"
import { getTodos } from "@/app/actions"

interface TodoItem {
  id: string
  text: string
  completed: boolean
  order: number
}

export default function PrintPage() {
  const [todos, setTodos] = useState<TodoItem[]>([])

  useEffect(() => {
    const fetchTodos = async () => {
      const fetchedTodos = await getTodos()
      setTodos(fetchedTodos)
    }
    fetchTodos()
  }, [])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Print button - hidden when printing */}
      <div className="no-print p-4 bg-gradient-to-r from-green-100 to-pink-100">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href="/">
            <Button variant="outline" className="border-green-300 bg-transparent w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <Button onClick={handlePrint} className="bg-gradient-to-r from-blue-400 to-purple-400 w-full sm:w-auto">
            <Printer className="w-4 h-4 mr-2" />
            Print Sekarang
          </Button>
        </div>
      </div>

      {/* Printable content */}
      <div className="container mx-auto p-8 print:p-4">
        <div className="text-center mb-6 sm:mb-8 print:mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-800 mb-2 print:text-3xl">
            🌿 Bogor Adventure Memories 🌿
          </h1>
          <p className="text-base sm:text-lg text-green-700 mb-4">Kenangan Indah di Kota Hujan</p>
          <div className="flex items-center justify-center gap-2 text-pink-600 mb-6">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
            <span className="font-medium text-sm sm:text-base">Made with Love</span>
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
          </div>
          <div className="no-print bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-blue-700">
              📋 Urutan kegiatan di halaman print ini mengikuti urutan yang kamu atur di halaman utama!
            </p>
          </div>
        </div>

        <div className="grid gap-6 print:gap-4">
          {todos.map((todo, index) => (
            <Card key={todo.id} className="border-2 border-green-200 print:break-inside-avoid">
              <CardHeader className="bg-gradient-to-r from-green-50 to-pink-50 print:bg-gray-50">
                <CardTitle className="text-green-800 flex items-center gap-2 print:text-black">
                  <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm print:bg-gray-200 print:text-black">
                    #{index + 1}
                  </span>
                  {todo.text}
                  {todo.completed && <span className="ml-2 text-green-600 print:text-black">✅</span>}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 print:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 print:gap-2">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg h-24 sm:h-32 print:h-24 flex items-center justify-center bg-gray-50">
                    <span className="text-gray-400 text-xs sm:text-sm print:text-xs">Foto</span>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg h-24 sm:h-32 print:h-24 flex items-center justify-center bg-gray-50">
                    <span className="text-gray-400 text-xs sm:text-sm print:text-xs">Foto</span>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg h-24 sm:h-32 print:h-24 flex items-center justify-center bg-gray-50">
                    <span className="text-gray-400 text-xs sm:text-sm print:text-xs">Foto</span>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg h-24 sm:h-32 print:h-24 flex items-center justify-center bg-gray-50">
                    <span className="text-gray-400 text-xs sm:text-sm print:text-xs">Foto</span>
                  </div>
                </div>

                {/* Notes section */}
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Catatan & Kenangan:</h4>
                  <div className="border border-dashed border-gray-300 rounded p-3 min-h-[60px] bg-gray-50">
                    <div className="text-gray-400 text-xs">Tulis kenangan indah kalian di sini...</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary section */}
        <div className="mt-8 print:mt-6">
          <Card className="border-2 border-pink-200">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 print:bg-gray-50">
              <CardTitle className="text-pink-800 print:text-black text-center">📊 Ringkasan Adventure</CardTitle>
            </CardHeader>
            <CardContent className="p-6 print:p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-green-50 print:bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 print:text-black">{todos.length}</div>
                  <div className="text-sm text-gray-600">Total Kegiatan</div>
                </div>
                <div className="bg-blue-50 print:bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 print:text-black">
                    {todos.filter((t) => t.completed).length}
                  </div>
                  <div className="text-sm text-gray-600">Sudah Selesai</div>
                </div>
                <div className="bg-yellow-50 print:bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 print:text-black">
                    {todos.filter((t) => !t.completed).length}
                  </div>
                  <div className="text-sm text-gray-600">Belum Selesai</div>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Kesan & Pesan Adventure:</h4>
                <div className="border border-dashed border-gray-300 rounded p-4 min-h-[80px] bg-gray-50">
                  <div className="text-gray-400 text-xs">
                    Bagaimana kesan kalian tentang adventure di Bogor ini? Tulis di sini...
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          
          .print\\:text-black {
            color: black !important;
          }
          
          .print\\:bg-white {
            background-color: white !important;
          }
          
          .print\\:bg-gray-50 {
            background-color: #f9fafb !important;
          }
          
          .print\\:text-gray-400 {
            color: #9ca3af !important;
          }
        }
      `}</style>
    </div>
  )
}
