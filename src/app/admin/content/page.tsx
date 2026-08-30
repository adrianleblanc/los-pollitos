"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Film,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Share2,
  Calendar,
  Layers,
  Loader2,
} from "lucide-react";
import { YoutubeIcon, FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/ui/icons";
import { formatDate } from "@/lib/utils";

interface ContentItem {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  status: "DRAFT" | "READY" | "SCHEDULED" | "PUBLISHING" | "PARTIALLY_PUBLISHED" | "PUBLISHED" | "FAILED";
  tags: string[];
  scheduledFor?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  media: Array<{
    role: string;
    media: {
      id: string;
      name: string;
      mediaType: string;
      publicUrl: string;
      thumbnailUrl?: string | null;
      aspectRatio?: string | null;
      fileSize: string;
    };
  }>;
  publications: Array<{
    id: string;
    platform: string;
    status: string;
  }>;
  customMetadata?: any;
}

export default function ContentListPage() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchContents = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus !== "ALL") params.append("status", selectedStatus);
      if (searchQuery) params.append("q", searchQuery);

      const res = await fetch(`/api/content?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setContents(data.contents || []);
      }
    } catch (err) {
      console.error("Error fetching contents:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, [selectedStatus, searchQuery]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este contenido?")) return;
    try {
      const res = await fetch(`/api/content/${id}`, { method: "DELETE" });
      if (res.ok) {
        setContents((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error("Error deleting content:", err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
            <CheckCircle2 className="w-3 h-3" />
            <span>Publicado</span>
          </span>
        );
      case "SCHEDULED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-bold">
            <Clock className="w-3 h-3" />
            <span>Programado</span>
          </span>
        );
      case "READY":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-bold">
            <span>Listo para Publicar</span>
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[11px] font-bold">
            <AlertCircle className="w-3 h-3" />
            <span>Falló</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-400 text-[11px] font-semibold">
            <span>Borrador</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & New Content CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Biblioteca de Contenidos
          </h2>
          <p className="text-xs text-neutral-400">
            Administra videos, shorts, imágenes y estados de publicación multi-red
          </p>
        </div>

        <Link
          href="/admin/content/new"
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md shadow-amber-500/10 transition-all flex items-center gap-2 self-start cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Nuevo Contenido</span>
        </Link>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar contenido por título o descripción..."
            className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-900 border border-neutral-800 overflow-x-auto">
          {[
            { id: "ALL", label: "Todos" },
            { id: "DRAFT", label: "Borradores" },
            { id: "READY", label: "Listos" },
            { id: "SCHEDULED", label: "Programados" },
            { id: "PUBLISHED", label: "Publicados" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedStatus === tab.id
                  ? "bg-amber-500 text-neutral-950 shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content List */}
      {isLoading ? (
        <div className="p-16 text-center text-neutral-400 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
          <span className="text-xs">Cargando contenidos...</span>
        </div>
      ) : contents.length === 0 ? (
        <div className="p-12 rounded-3xl bg-neutral-900/40 border border-neutral-800/60 border-dashed text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 text-2xl">
            🎬
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            No se encontraron contenidos
          </h3>
          <p className="text-xs text-neutral-400 max-w-sm mb-6 leading-relaxed">
            {searchQuery || selectedStatus !== "ALL"
              ? "No hay resultados para los filtros actuales."
              : "Comienza creando tu primer video o publicación para Los Pollitos y compártelo en YouTube, Meta y TikTok."}
          </p>
          <Link
            href="/admin/content/new"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Crear Primer Contenido</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {contents.map((item) => {
            const primaryMedia = item.media.find((m) => m.role === "PRIMARY_VIDEO")?.media;
            const thumbnailMedia = item.media.find((m) => m.role === "THUMBNAIL")?.media;
            const displayThumb = thumbnailMedia?.publicUrl || primaryMedia?.thumbnailUrl || primaryMedia?.publicUrl;

            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700/80 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                {/* Left Thumbnail & Info */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-24 h-16 sm:w-28 sm:h-18 rounded-xl bg-neutral-950 overflow-hidden shrink-0 relative border border-neutral-800">
                    {displayThumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={displayThumb}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-600">
                        <Film className="w-6 h-6" />
                      </div>
                    )}

                    {primaryMedia?.aspectRatio && (
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-neutral-950/90 text-[9px] font-mono text-amber-300">
                        {primaryMedia.aspectRatio}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(item.status)}
                      <span className="text-[11px] text-neutral-500">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="text-xs text-neutral-400 line-clamp-1">
                        {item.description}
                      </p>
                    )}

                    {/* Target Platforms / Channel info */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] text-neutral-500">Destino:</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
                        <YoutubeIcon className="w-3 h-3 fill-red-400" />
                        <span>
                          {item.customMetadata?.youtube?.targetChannel === "TESTING_ADRIAN"
                            ? "@AdrianLeblancMorales (Pruebas)"
                            : "@LosPollitosTejen"}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <Link
                    href={`/admin/content/${item.id}/edit`}
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                    title="Editar contenido"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                    title="Eliminar contenido"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
