"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, Video, Share2, Layers, AlertCircle, ArrowRight, UserCheck } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const error = searchParams.get("error");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn("google", { callbackUrl });
    } catch (err) {
      console.error("Sign-in error:", err);
      setIsLoading(false);
    }
  };

  const handleDevBypass = () => {
    router.push(callbackUrl);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-neutral-950 text-neutral-100 selection:bg-amber-500 selection:text-neutral-950">
      {/* Left Branding Hero Panel */}
      <div className="md:w-1/2 bg-gradient-to-br from-amber-500/10 via-neutral-900 to-neutral-950 p-8 md:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-800/80">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-neutral-950 font-black text-2xl">
              🐥
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block">Los Pollitos</span>
              <span className="text-xs text-amber-400 font-medium uppercase tracking-wider">Content Studio</span>
            </div>
          </div>

          <div className="mt-16 md:mt-24 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Panel de Control & Distribución Multi-plataforma</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Gestiona, crea y publica en todas tus redes desde un solo lugar.
            </h1>
            <p className="mt-4 text-neutral-400 text-base md:text-lg leading-relaxed">
              Sincronización directa con YouTube, Facebook, Instagram y TikTok para el canal de Los Pollitos.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-12 border-t border-neutral-800/60 mt-12 md:mt-0">
          <div className="flex items-center gap-2.5 text-neutral-300 text-xs md:text-sm font-medium">
            <Video className="w-4 h-4 text-amber-400 shrink-0" />
            <span>YouTube Data & Shorts</span>
          </div>
          <div className="flex items-center gap-2.5 text-neutral-300 text-xs md:text-sm font-medium">
            <Share2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>FB & Instagram Reels</span>
          </div>
          <div className="flex items-center gap-2.5 text-neutral-300 text-xs md:text-sm font-medium">
            <Layers className="w-4 h-4 text-amber-400 shrink-0" />
            <span>TikTok Direct Post</span>
          </div>
        </div>
      </div>

      {/* Right Login Action Panel */}
      <div className="md:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="bg-neutral-900/70 border border-neutral-800 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-xl space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-neutral-800 border border-neutral-700/60 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Acceso al Panel</h2>
              <p className="text-sm text-neutral-400 mt-1.5">
                Inicia sesión para gestionar el contenido
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-300 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Credenciales no configuradas</p>
                  <p className="text-xs text-red-400/90 mt-0.5">
                    Para autenticación real de Google se requiere configurar las credenciales en .env o usar el Acceso Directo de Pruebas.
                  </p>
                </div>
              </div>
            )}

            {/* Quick Developer Bypass Button (Never blocks testing) */}
            <button
              onClick={handleDevBypass}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              <UserCheck className="w-4 h-4 stroke-[2.5]" />
              <span>Acceso Directo (Modo Pruebas / Adrian)</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <div className="relative flex items-center justify-center py-2">
              <div className="border-t border-neutral-800 w-full" />
              <span className="bg-neutral-900 px-3 text-[11px] text-neutral-500 uppercase tracking-wider font-semibold absolute">
                o con Google OAuth
              </span>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-3 px-6 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center justify-center gap-3 border border-neutral-700 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Iniciar con Google Cloud Console</span>
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <Link
                href="/"
                className="text-xs text-neutral-400 hover:text-amber-400 transition-colors"
              >
                ← Volver al Sitio Web Público
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-400">Cargando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
