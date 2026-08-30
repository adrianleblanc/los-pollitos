"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Film,
  PlusCircle,
  Calendar,
  Image as ImageIcon,
  Share2,
  Settings,
  LogOut,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "Panel Principal",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Contenido",
    href: "/admin/content",
    icon: Film,
  },
  {
    title: "Crear Publicación",
    href: "/admin/content/new",
    icon: PlusCircle,
    highlight: true,
  },
  {
    title: "Calendario",
    href: "/admin/calendar",
    icon: Calendar,
  },
  {
    title: "Biblioteca Multimedia",
    href: "/admin/media",
    icon: ImageIcon,
  },
  {
    title: "Cuentas Sociales",
    href: "/admin/accounts",
    icon: Share2,
  },
  {
    title: "Configuración",
    href: "/admin/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
  workspaceName: string;
}

export function Sidebar({ user, workspaceName }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-neutral-950 border-r border-neutral-800/80 flex flex-col h-screen shrink-0 sticky top-0">
      {/* Brand & Workspace Header */}
      <div className="p-5 border-b border-neutral-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-neutral-950 font-black text-xl shadow-md shadow-amber-500/20 shrink-0">
            🐥
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-white truncate">{workspaceName}</h2>
            <div className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Workspace Activo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
          Navegación
        </div>
        {navigationItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                isActive
                  ? "bg-amber-500/10 text-amber-300 border border-amber-500/20 shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60",
                item.highlight && !isActive && "text-amber-400/90 font-semibold"
              )}
            >
              <item.icon
                className={cn(
                  "w-4 h-4 transition-colors shrink-0",
                  isActive ? "text-amber-400" : "text-neutral-400 group-hover:text-neutral-200",
                  item.highlight && !isActive && "text-amber-400"
                )}
              />
              <span className="truncate flex-1">{item.title}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
            </Link>
          );
        })}

        <div className="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
          Accesos Rápidos
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60 transition-colors group"
        >
          <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-300" />
          <span>Ver Sitio Web Público</span>
        </Link>
      </div>

      {/* User Footer & Logout */}
      <div className="p-3 border-t border-neutral-800/80 bg-neutral-900/30">
        <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name || "Usuario"}
                className="w-8 h-8 rounded-full border border-neutral-700 shrink-0 object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                {user.name ? user.name.slice(0, 2).toUpperCase() : "LP"}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user.name || "Administrador"}
              </p>
              <p className="text-[10px] text-neutral-400 truncate">
                {user.role || "OWNER"}
              </p>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Cerrar Sesión"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
