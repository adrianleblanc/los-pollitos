"use client";

import React, { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  Film,
  HardDrive,
  Upload,
  Search,
  Filter,
  Trash2,
  Copy,
  Check,
  Play,
  ExternalLink,
  X,
  Loader2,
} from "lucide-react";
import { MediaUploader } from "@/components/admin/media-uploader";
import { formatNumber, formatDate } from "@/lib/utils";

interface MediaItem {
  id: string;
  name: string;
  fileName: string;
  fileSize: string;
  mimeType: string;
  mediaType: "VIDEO" | "IMAGE" | "AUDIO" | "DOCUMENT";
  r2Key: string;
  publicUrl: string;
  width?: number | null;
  height?: number | null;
  durationSec?: number | null;
  aspectRatio?: string | null;
  thumbnailUrl?: string | null;
  createdAt: string;
}

export default function MediaLibraryPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploader, setShowUploader] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);

  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedType !== "ALL") params.append("type", selectedType);
      if (searchQuery) params.append("q", searchQuery);

      const res = await fetch(`/api/media?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setMediaList(data.media || []);
      }
    } catch (err) {
      console.error("Error fetching media:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [selectedType, searchQuery]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este archivo de Cloudflare R2?")) {
      return;
    }
    try {
      const res = await fetch(`/api/media?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMediaList((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error("Error deleting media:", err);
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalSizeMb = mediaList.reduce(
    (acc, m) => acc + Number(m.fileSize) / (1024 * 1024),
    0
  );
  const videoCount = mediaList.filter((m) => m.mediaType === "VIDEO").length;
  const imageCount = mediaList.filter((m) => m.mediaType === "IMAGE").length;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Biblioteca Multimedia (Cloudflare R2)
          </h2>
          <p className="text-xs text-neutral-400">
            Almacenamiento de alta velocidad con $0 costo de transferencia (egress)
          </p>
        </div>

        <button
          onClick={() => setShowUploader(!showUploader)}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md shadow-amber-500/10 transition-all flex items-center gap-2 self-start cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>{showUploader ? "Cerrar Subida" : "Subir Archivos"}</span>
        </button>
      </div>

      {/* Storage usage summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Almacenamiento R2</span>
            <HardDrive className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">
            {totalSizeMb.toFixed(1)} MB{" "}
            <span className="text-xs font-normal text-neutral-500">/ 10 GB</span>
          </p>
          <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, (totalSizeMb / 10240) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Videos Almacenados</span>
            <Film className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white">{videoCount}</p>
          <p className="text-xs text-neutral-500 mt-1">Archivos MP4 / MOV</p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Imágenes & Miniaturas</span>
            <ImageIcon className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white">{imageCount}</p>
          <p className="text-xs text-neutral-500 mt-1">Archivos JPEG / PNG</p>
        </div>
      </div>

      {/* Collapsible Direct R2 Uploader */}
      {showUploader && (
        <div className="p-6 rounded-3xl bg-neutral-900/80 border border-amber-500/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Subida Directa a Cloudflare R2</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/20">
                Bypass 4.5MB Vercel Limit
              </span>
            </h3>
            <button
              onClick={() => setShowUploader(false)}
              className="p-1 rounded-lg text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <MediaUploader
            onSuccess={(newMedia) => {
              setMediaList((prev) => [newMedia, ...prev]);
            }}
          />
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre o archivo..."
            className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-900 border border-neutral-800">
          {[
            { id: "ALL", label: "Todos" },
            { id: "VIDEO", label: "Videos" },
            { id: "IMAGE", label: "Imágenes" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedType === tab.id
                  ? "bg-amber-500 text-neutral-950 shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid Display */}
      {isLoading ? (
        <div className="p-16 text-center text-neutral-400 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
          <span className="text-xs">Cargando biblioteca multimedia...</span>
        </div>
      ) : mediaList.length === 0 ? (
        <div className="p-12 rounded-3xl bg-neutral-900/40 border border-neutral-800/60 border-dashed text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 text-2xl">
            ☁️
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            No hay archivos en tu biblioteca
          </h3>
          <p className="text-xs text-neutral-400 max-w-sm mb-6 leading-relaxed">
            Sube videos e imágenes a Cloudflare R2 para utilizarlos en tus publicaciones de YouTube, Instagram, Facebook y TikTok.
          </p>
          <button
            onClick={() => setShowUploader(true)}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Subir Archivo Ahora</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {mediaList.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl bg-neutral-900/60 border border-neutral-800/80 overflow-hidden hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              {/* Media Thumbnail Container */}
              <div
                onClick={() => setPreviewMedia(item)}
                className="relative aspect-video bg-neutral-950 flex items-center justify-center overflow-hidden cursor-pointer group-hover:opacity-95"
              >
                {item.mediaType === "IMAGE" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.publicUrl}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : item.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.thumbnailUrl}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="text-neutral-600 flex flex-col items-center gap-1">
                    <Film className="w-8 h-8 text-amber-500/40" />
                    <span className="text-[10px]">Video Master</span>
                  </div>
                )}

                {item.mediaType === "VIDEO" && (
                  <div className="absolute inset-0 bg-neutral-950/30 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                      <Play className="w-4 h-4 fill-neutral-950 ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Aspect Ratio Badge */}
                {item.aspectRatio && (
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-neutral-950/80 text-[10px] font-bold text-amber-300 backdrop-blur-sm border border-neutral-800">
                    {item.aspectRatio}
                  </div>
                )}

                {/* Duration Badge */}
                {item.durationSec && (
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-neutral-950/80 text-[10px] font-mono text-neutral-200 backdrop-blur-sm border border-neutral-800">
                    {Math.floor(item.durationSec / 60)}:
                    {Math.floor(item.durationSec % 60)
                      .toString()
                      .padStart(2, "0")}
                  </div>
                )}
              </div>

              {/* Media Info & Actions */}
              <div className="p-4 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-white truncate" title={item.name}>
                    {item.name}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-1">
                    <span>
                      {(Number(item.fileSize) / (1024 * 1024)).toFixed(1)} MB
                    </span>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-800/60">
                  <button
                    onClick={() => copyUrl(item.publicUrl, item.id)}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-[11px] font-medium text-neutral-300 hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-neutral-400" />
                        <span>Copiar URL</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    title="Eliminar archivo"
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 bg-neutral-950/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white truncate">
                  {previewMedia.name}
                </h3>
                <p className="text-xs text-neutral-400 truncate">
                  {previewMedia.publicUrl}
                </p>
              </div>
              <button
                onClick={() => setPreviewMedia(null)}
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-black p-4 flex items-center justify-center max-h-[60vh]">
              {previewMedia.mediaType === "VIDEO" ? (
                <video
                  src={previewMedia.publicUrl}
                  controls
                  autoPlay
                  className="max-h-[55vh] max-w-full rounded-xl"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewMedia.publicUrl}
                  alt={previewMedia.name}
                  className="max-h-[55vh] max-w-full object-contain rounded-xl"
                />
              )}
            </div>

            <div className="p-4 bg-neutral-950/80 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <span>Aspect Ratio: {previewMedia.aspectRatio || "N/A"}</span>
              <a
                href={previewMedia.publicUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-amber-400 hover:underline"
              >
                <span>Abrir en nueva pestaña</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
