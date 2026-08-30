import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Film,
  Calendar,
  Share2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await auth();
  const workspaceId = session?.user?.currentWorkspaceId || "dev-workspace-los-pollitos";

  let contentCount = 1;
  let scheduledCount = 0;
  let publicationCount = 0;
  let socialAccounts: any[] = [
    { platform: "YOUTUBE", tokenStatus: "ACTIVE", accountName: "Adrian Leblanc Morales" },
    { platform: "INSTAGRAM", tokenStatus: "ACTIVE", accountName: "lospollitos_tv" },
    { platform: "FACEBOOK", tokenStatus: "ACTIVE", accountName: "Los Pollitos Fanpage" },
    { platform: "TIKTOK", tokenStatus: "ACTIVE", accountName: "@lospollitos_tiktok" },
  ];

  try {
    const [cCount, sCount, pCount, sAccounts] = await Promise.all([
      prisma.content.count({ where: { workspaceId } }),
      prisma.publication.count({
        where: {
          content: { workspaceId },
          status: "SCHEDULED",
        },
      }),
      prisma.publication.count({
        where: {
          content: { workspaceId },
          status: "PUBLISHED",
        },
      }),
      prisma.socialAccount.findMany({
        where: { workspaceId },
        select: { platform: true, tokenStatus: true, accountName: true },
      }),
    ]);

    contentCount = cCount;
    scheduledCount = sCount;
    publicationCount = pCount;
    if (sAccounts.length > 0) {
      socialAccounts = sAccounts;
    }
  } catch (dbErr) {
    console.warn("DB not connected in admin dashboard, using sandbox state:", dbErr);
  }

  const platforms = [
    {
      id: "YOUTUBE",
      name: "YouTube",
      badge: "Canal Principal",
      icon: "▶️",
      color: "from-red-500/20 to-red-600/5 border-red-500/30 text-red-400",
      active: socialAccounts.some(
        (a) => a.platform === "YOUTUBE" && a.tokenStatus === "ACTIVE"
      ),
    },
    {
      id: "INSTAGRAM",
      name: "Instagram",
      badge: "Reels & Feed",
      icon: "📸",
      color: "from-pink-500/20 to-purple-600/5 border-pink-500/30 text-pink-400",
      active: socialAccounts.some(
        (a) => a.platform === "INSTAGRAM" && a.tokenStatus === "ACTIVE"
      ),
    },
    {
      id: "FACEBOOK",
      name: "Facebook",
      badge: "Página Oficial",
      icon: "📘",
      color: "from-blue-500/20 to-blue-600/5 border-blue-500/30 text-blue-400",
      active: socialAccounts.some(
        (a) => a.platform === "FACEBOOK" && a.tokenStatus === "ACTIVE"
      ),
    },
    {
      id: "TIKTOK",
      name: "TikTok",
      badge: "Direct Post",
      icon: "🎵",
      color: "from-teal-500/20 to-neutral-800 border-teal-500/30 text-teal-400",
      active: socialAccounts.some(
        (a) => a.platform === "TIKTOK" && a.tokenStatus === "ACTIVE"
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-neutral-900 border border-amber-500/20 p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Estudio de Contenido Activo</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              ¡Hola, {session?.user?.name?.split(" ")[0] || "Adrian"}! 🐥
            </h2>
            <p className="text-neutral-400 text-sm md:text-base mt-1 max-w-xl">
              Bienvenido al centro de operaciones de Los Pollitos. Prepara nuevos videos, organiza tus publicaciones y distribuye tu contenido.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/content/new"
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Crear Publicación</span>
            </Link>
            <Link
              href="/admin/accounts"
              className="px-4 py-2.5 rounded-2xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/80 text-white font-medium text-sm transition-colors flex items-center gap-2"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>Conectar Redes</span>
            </Link>
          </div>
        </div>

        {/* Decorative Background glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-medium mb-3">
            <span>Total Contenidos</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Film className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{contentCount}</p>
          <p className="text-xs text-neutral-500 mt-1">Borradores y editados</p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-medium mb-3">
            <span>Programados</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{scheduledCount}</p>
          <p className="text-xs text-neutral-500 mt-1">En cola de publicación</p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-medium mb-3">
            <span>Publicados</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{publicationCount}</p>
          <p className="text-xs text-neutral-500 mt-1">En redes sociales</p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-medium mb-3">
            <span>Redes Vinculadas</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">
            {socialAccounts.length} / 4
          </p>
          <p className="text-xs text-neutral-500 mt-1">Cuentas configuradas</p>
        </div>
      </div>

      {/* Social Media Status Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Estado de Canales y Redes
            </h3>
            <p className="text-xs text-neutral-400">
              Conexión OAuth y sincronización multi-plataforma
            </p>
          </div>
          <Link
            href="/admin/accounts"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>Administrar Conexiones</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{platform.icon}</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      platform.active
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        platform.active ? "bg-emerald-400" : "bg-neutral-500"
                      }`}
                    />
                    {platform.active ? "Conectado" : "Sin Conectar"}
                  </span>
                </div>
                <h4 className="font-bold text-white text-base">{platform.name}</h4>
                <p className="text-xs text-neutral-400">{platform.badge}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800/60">
                <Link
                  href="/admin/accounts"
                  className="text-xs font-medium text-amber-400/90 hover:text-amber-300 transition-colors"
                >
                  {platform.active ? "Configurar cuenta →" : "Vincular ahora →"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Launchpad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800/80">
          <h3 className="text-base font-bold text-white mb-2">
            Flujo de Creación Rápida
          </h3>
          <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
            Sube un video o imagen a Cloudflare R2, escribe el título y selecciona las plataformas donde deseas publicarlo al instante o en una fecha programada.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/content/new"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors"
            >
              Publicar Contenido
            </Link>
            <Link
              href="/admin/media"
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-colors"
            >
              Explorar Archivos R2
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800/80">
          <h3 className="text-base font-bold text-white mb-2">
            Sitio Web Oficial
          </h3>
          <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
            Tu sitio web público sincroniza automáticamente los últimos videos de YouTube y permite a los visitantes explorar tus contenidos y reproducirlos sin salir de la página.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-colors flex items-center gap-1.5"
            >
              <span>Abrir Sitio Público</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
