"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";

export default function SurprisePage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  // State isPlaying tidak lagi diperlukan karena tidak ada teks "Sedang memutar..."
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Ganti dengan tanggal yang diinginkan
  const targetDate = new Date("2024-08-02T12:00:00"); // Ganti dengan tanggal yang diinginkan

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setIsUnlocked(true);
        setTimeLeft("");
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  useEffect(() => {
    if (isUnlocked && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Autoplay was prevented:", error);
      });
    }
  }, [isUnlocked]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (!isUnlocked) {
    // Tampilan Countdown (tidak berubah)
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute text-yellow-300 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                fontSize: `${Math.random() * 10 + 10}px`,
              }}
            >
              ✨
            </div>
          ))}
        </div>
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="text-center mb-8">
            <Link href="/">
              <Button
                variant="outline"
                className="mb-4 border-white text-white hover:bg-white hover:text-purple-900 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
              </Button>
            </Link>
          </div>
          <div className="max-w-xl sm:max-w-2xl mx-auto text-center">
            <Card className="bg-black/50 backdrop-blur-sm border-2 border-pink-400 shadow-2xl">
              <CardContent className="p-6 sm:p-8">
                <div className="text-4xl sm:text-6xl mb-6 animate-bounce">
                  🔒
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
                  Surprise Terkunci! 💕
                </h1>
                <p className="text-lg sm:text-xl text-pink-200 mb-8">
                  Halaman special ini akan terbuka pada waktu yang tepat...
                </p>
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg p-4 sm:p-6 mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                    Countdown:
                  </h2>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-mono text-white">
                    {timeLeft || "Loading..."}
                  </div>
                </div>
                <div className="space-y-4 text-pink-200">
                  <p className="text-base sm:text-lg">
                    🌸 Sabar ya sayang, surprise-nya masih dalam perjalanan...
                  </p>
                  <p className="text-sm opacity-75">
                    Sementara itu, yuk lanjut planning adventure kita di Bogor!
                    🌿
                  </p>
                </div>
                <div className="mt-8 flex justify-center">
                  <div className="animate-spin text-3xl sm:text-4xl">🌺</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Tampilan Halaman Kejutan (setelah countdown selesai)
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-yellow-100 relative overflow-hidden">
      {/* TAG AUDIO DIPINDAHKAN KE SINI (TIDAK TERLIHAT) */}
      <audio ref={audioRef} loop preload="auto">
        <source src="/birthday-song.mp3" type="audio/mpeg" />
        <source src="/birthday-song.ogg" type="audio/ogg" />
      </audio>

      {/* TOMBOL MUTE BARU DI POJOK KANAN ATAS */}
      <Button
        onClick={toggleMute}
        variant="outline"
        size="icon"
        className="absolute top-4 right-4 z-20 rounded-full border-pink-300 bg-white/50 backdrop-blur-sm"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-pink-600" />
        ) : (
          <Volume2 className="w-5 h-5 text-pink-600" />
        )}
      </Button>

      {/* Floating hearts and flowers */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            {i % 3 === 0 ? "💕" : i % 3 === 1 ? "🌸" : "🦋"}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <Link href="/">
            <Button
              variant="outline"
              className="mb-4 border-pink-300 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
            </Button>
          </Link>
        </div>

        <div className="max-w-2xl sm:max-w-4xl mx-auto text-center">
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-pink-300 shadow-2xl">
            <CardContent className="p-6 sm:p-8">
              <div className="text-6xl sm:text-7xl lg:text-8xl mb-6 animate-pulse">
                🎉
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Selamat Ulang Tahun Sayang! 💕
              </h1>
              <div className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-8 leading-relaxed">
                <p className="mb-4">
                  🌸 Hari ini adalah hari yang special banget! 🌸
                </p>
                <p className="text-pink-600 font-semibold">
                  I love you to the moon and back! 🌙✨
                </p>
              </div>

              {/* Birthday Message */}
              <Card className="bg-gradient-to-r from-yellow-100 to-pink-100 border-2 border-yellow-300">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">
                    💌 Sebuah Pesan Untukmu
                  </h3>
                  <div className="text-left space-y-4 text-gray-700 text-sm sm:text-base">
                    <p>Hiii Tasiaaaa.</p>
                    <p>
                      Semua kisah hebat itu punya awal yang tidak terlupakan.
                      Prolog kisah kita ditulis pada tanggal 2 Agustus. Hari di
                      mana kita bertemu, hari di mana kita memulai lembaran
                      baru. Hari dimana aku terpesona karenamu.
                    </p>
                    <p>
                      Semenjak pertemuan itu, rasanya aku ingin selalu bercerita
                      banyak hal padamu karna semuanya terasa menyenangkan.
                      Sejak saat itu juga, aku seperti ada di kisah kisah novel,
                      dimana karakter utama mendapatkan pasangan yang dia
                      impikan. Siapa yang mengira bahwa aku akan menemukan
                      perempuan cantik, katolik, tinggi, pintar dan juga seorang
                      penulis.
                    </p>
                    <p>
                      Dalam satu tahun ini, kita telah menciptakan banyak
                      kenangan, beberapa indah, beberapa lucu, beberapa yang
                      membuat kita lebih mengenal satu sama lain, tapi pada
                      akhirnya kita saling menemukan. Kamu adalah keajaiban yang
                      luar biasa.
                    </p>
                    <p>
                      Di hari ulang tahunmu ini, aku berdoa agar setiap
                      langkahmu ke depan adalah petualangan baru yang seru.
                      Semoga kamu menemukan harta karun berupa kebahagiaan,
                      mengalahkan naga bernama keraguan, dan selalu dikelilingi
                      oleh keajaiban.
                    </p>
                    <p>
                      Kamu ingat cerita tentang "Laki laki dan Ikan" itu? Nah,
                      aku tak akan menyerah untuk mendampingimu, menemanimu
                      untuk meraih mimpi mimpi yang terdengar mustahil. Aku akan
                      selalu ada di sampingmu, siap menjadi pendukung setiamu,
                      dan tak akan pernah lelah karenanya.
                    </p>
                    <p>
                      Ini adalah tahun pertama yang kita rayakan bersama. Tahun
                      ini di Bogor, tahun depan akan dimana ya? Mari kita
                      melangkah kedepan bersama.
                    </p>
                    <p>
                      Tasiaaaaaa. Selamat ulang tahun ya. Semoga kamu bisa dapat
                      N4. Semoga kamu bisa kerja di Jepang. Semoga kamu bisa
                      berkuliah di Kaist. Semoga kamu bisa menjadi ML Engineer.
                      Semoga kamu bisa menjadi berkat yang luar biasa untuk
                      mama, uti dan kakung. Semoga kamu bisa menjadi berkat
                      dimanapun kamu berada.
                    </p>
                    <p>God Bless you, Tasia.</p>
                    <p className="text-right font-semibold pt-4">
                      Saniraaaaaa, love you so much. 💕
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-8 text-4xl sm:text-5xl lg:text-6xl animate-bounce">
                🎂🎈🎁
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
