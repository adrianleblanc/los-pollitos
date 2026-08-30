"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Plus, Sparkles } from "lucide-react";

interface HeaderProps {
  workspaceName: string;
}

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/admin": {
    title: "Panel de Control",
    subtitle: "Resumen general y métricas de publicación de Los Pollitos",
  },
  "/admin/content": {
    title: "Gestor de Contenido",
    subtitle: "Administra borradores, videos programados y publicaciones realizadas",
  },
  "/admin/content/new": {
    title: "Crear Nueva Publicación",
    subtitle: "Publica o programa contenido simultáneamente en múltiples redes",
  },
  "/admin/calendar": {
    title: "Calendario Editorial",
    subtitle: "Visualiza la programación semanal y mensual de contenidos",
  },
  "/admin/media": {
    title: "Biblioteca Multimedia",
    subtitle: "Almacenamiento Cloudflare R2 para videos, fotos y miniaturas",
  },
  "/admin/accounts": {
    title: "Cuentas y Conexiones",
    subtitle: "Gestión de OAuth y estados de conexión con YouTube, Meta y TikTok",
  },
  "/admin/settings": {
    title: "Configuración",
    subtitle: "Preferencias del workspace, roles de usuarios y claves de API",
  },
};

export function Header({ workspaceName }: HeaderProps) {
  const pathname = usePathname();
  const currentInfo = pageTitles[pathname] || {
    title: "Estudio de Contenido",
    subtitle: workspaceName,
  };

  return (
    <header className="h-18 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/80 px-8 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          {currentInfo.title}
        </h1>
        <p className="text-xs text-neutral-400 mt-0.5">{currentInfo.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Sitio Público</span>
        </Link>

        <Link
          href="/admin/content/new"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 text-xs font-bold shadow-md shadow-amber-500/10 transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Nueva Publicación</span>
        </Link>
      </div>
    </header>
  );
}
