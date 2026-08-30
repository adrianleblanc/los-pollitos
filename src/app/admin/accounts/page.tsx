"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Share2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  ExternalLink,
  Shield,
  Check,
} from "lucide-react";
import { YoutubeIcon, InstagramIcon, FacebookIcon, TikTokIcon } from "@/components/ui/icons";

export default function SocialAccountsPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const error = searchParams.get("error");

  const [activeChannel, setActiveChannel] = useState<"TESTING" | "OFFICIAL">("TESTING");

  const accounts = [
    {
      id: "youtube",
      name: "YouTube",
      handle:
        activeChannel === "TESTING"
          ? "@AdrianLeblancMorales (Canal de Pruebas Activo)"
          : "@LosPollitosTejen (Canal Oficial)",
      icon: <YoutubeIcon className="w-6 h-6 fill-red-500" />,
      connected: true,
      statusText: "Listo para publicar videos y Shorts",
      scopes: ["youtube.upload", "youtube.readonly", "youtube.force-ssl"],
      badge: activeChannel === "TESTING" ? "Canal de Pruebas" : "Canal Oficial",
      isTesting: activeChannel === "TESTING",
    },
    {
      id: "instagram",
      name: "Instagram",
      handle: "@lospollitos_tv",
      icon: <InstagramIcon className="w-6 h-6 text-pink-400" />,
      connected: true,
      statusText: "Vinculado vía Meta Graph API (Reels ≤ 90s)",
      scopes: ["instagram_content_publish", "instagram_basic"],
      badge: "Business/Creator",
    },
    {
      id: "facebook",
      name: "Facebook Page",
      handle: "Los Pollitos Fanpage",
      icon: <FacebookIcon className="w-6 h-6 text-blue-400" />,
      connected: true,
      statusText: "Token permanente de página",
      scopes: ["pages_manage_posts", "publish_video"],
      badge: "Página Oficial",
    },
    {
      id: "tiktok",
      name: "TikTok",
      handle: "@lospollitos_tiktok",
      icon: <TikTokIcon className="w-6 h-6 text-teal-400" />,
      connected: true,
      statusText: "Content Posting API v2 (Direct Post)",
      scopes: ["video.publish", "user.info.basic"],
      badge: "Direct Post",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Cuentas Sociales & Conexiones OAuth
          </h2>
          <p className="text-xs text-neutral-400">
            Gestiona las autorizaciones para YouTube, Meta (Facebook / Instagram) y TikTok
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-300 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>¡Cuenta vinculada con éxito vía OAuth 2.0!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>Error al conectar cuenta: {error}</span>
        </div>
      )}

      {/* Testing Channel Selector Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-neutral-900/60 to-neutral-900 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
            <Shield className="w-3 h-3" />
            <span>Entorno Seguro de Publicación</span>
          </div>
          <h3 className="text-sm font-bold text-white">
            Canal de Pruebas Activo: @AdrianLeblancMorales
          </h3>
          <p className="text-xs text-neutral-400 max-w-xl">
            Todas las publicaciones de prueba en YouTube se enviarán como privadas a tu canal de pruebas sin afectar el canal principal de Los Pollitos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveChannel("TESTING")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeChannel === "TESTING"
                ? "bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/20"
                : "bg-neutral-800 text-neutral-400 hover:text-white"
            }`}
          >
            Modo Pruebas (Adrian)
          </button>
          <button
            onClick={() => setActiveChannel("OFFICIAL")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeChannel === "OFFICIAL"
                ? "bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/20"
                : "bg-neutral-800 text-neutral-400 hover:text-white"
            }`}
          >
            Modo Oficial (Los Pollitos)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
                    {acc.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">{acc.name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {acc.badge}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">{acc.handle}</p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    acc.connected
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      acc.connected ? "bg-emerald-400" : "bg-neutral-500"
                    }`}
                  />
                  {acc.connected ? "Conectado" : "Desconectado"}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800/60 text-xs space-y-2 mb-4">
                <div className="flex justify-between text-neutral-400">
                  <span>Estado:</span>
                  <span className="text-neutral-200 font-medium">{acc.statusText}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Permisos:</span>
                  <span className="text-amber-400 font-mono text-[10px] truncate max-w-[200px]">
                    {acc.scopes.join(", ")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-neutral-800/60">
              {acc.id === "youtube" ? (
                <a
                  href="/api/social/youtube/connect?channel=testing"
                  className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-600/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <YoutubeIcon className="w-4 h-4 fill-white" />
                  <span>Reconectar YouTube OAuth</span>
                </a>
              ) : acc.id === "tiktok" ? (
                <a
                  href="/api/social/tiktok/connect"
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-md shadow-teal-600/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <TikTokIcon className="w-4 h-4 text-white" />
                  <span>Reconectar TikTok Login Kit</span>
                </a>
              ) : (
                <a
                  href="/api/social/facebook/connect"
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FacebookIcon className="w-4 h-4 text-white" />
                  <span>Reconectar Meta OAuth (FB & IG)</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
