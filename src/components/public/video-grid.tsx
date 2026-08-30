"use client";

import { useState, useMemo } from "react";
import { Search, Play, Filter, Sparkles, Film } from "lucide-react";
import { YouTubeVideo } from "@/services/youtube-public";
import { VideoModal } from "./video-modal";

interface VideoGridProps {
  videos: YouTubeVideo[];
}

const CATEGORIES = [
  { id: "all", label: "✨ Todos los Videos" },
  { id: "mascotas", label: "🐱 Mascotas (Gatos & Perros)" },
  { id: "prendas", label: "🧶 Gorros & Prendas" },
  { id: "tutorial", label: "🌸 Flores & Tutoriales" },
  { id: "shorts", label: "⚡ Shorts & Trucos" },
];

export function VideoGrid({ videos }: VideoGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModalVideo, setActiveModalVideo] =
    useState<YouTubeVideo | null>(null);

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesCategory =
        selectedCategory === "all" || video.category === selectedCategory;

      const matchesSearch =
        searchQuery.trim() === "" ||
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [videos, selectedCategory, searchQuery]);

  return (
    <>
      <section id="videos" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold">
            <Film className="w-3.5 h-3.5" />
            <span>Catálogo Completo de Tutoriales</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Explora y Teje con Nosotros
          </h2>
          <p className="text-neutral-400 text-sm md:text-base">
            Selecciona una categoría o busca el proyecto que deseas aprender hoy.
          </p>
        </div>

        {/* Search & Category Filter Navigation */}
        <div className="space-y-4 mb-10">
          <div className="max-w-xl mx-auto relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar tutorial por nombre (ej: gato, venom, gorro, flor)..."
              className="w-full bg-neutral-900/90 border border-neutral-800 rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/50 shadow-inner"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/20 scale-105"
                    : "bg-neutral-900/90 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Video Cards Grid */}
        {filteredVideos.length === 0 ? (
          <div className="p-16 rounded-3xl bg-neutral-900/40 border border-neutral-800/60 border-dashed text-center">
            <div className="w-12 h-12 rounded-2xl bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto mb-3 text-xl">
              🔍
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              No se encontraron videos
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-4">
              Intenta con otra búsqueda o selecciona una categoría diferente.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => setActiveModalVideo(video)}
                className="group rounded-3xl bg-neutral-900/70 border border-neutral-800/80 overflow-hidden hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video bg-neutral-950 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-neutral-950/30 group-hover:bg-neutral-950/10 flex items-center justify-center transition-colors">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400/90 text-neutral-950 flex items-center justify-center shadow-lg shadow-amber-400/20 transform transition-transform group-hover:scale-110">
                      <Play className="w-5 h-5 fill-neutral-950 ml-0.5" />
                    </div>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg bg-neutral-950/85 text-[10px] font-bold text-amber-300 backdrop-blur-sm border border-neutral-800">
                    {video.category.toUpperCase()}
                  </div>

                  {/* Duration Pill */}
                  {video.duration && (
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-neutral-950/90 text-[11px] font-mono font-bold text-white backdrop-blur-sm border border-neutral-800">
                      {video.duration}
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-2 group-hover:text-amber-300 transition-colors leading-snug">
                      {video.title}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 mt-1.5 leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-800/60 text-[11px] text-neutral-500">
                    <span>{video.viewCount ? `${video.viewCount} vistas` : "Los Pollitos"}</span>
                    <span className="text-amber-400 font-semibold group-hover:underline flex items-center gap-1">
                      <span>Ver tutorial</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Video Playback Modal */}
      <VideoModal
        video={activeModalVideo}
        onClose={() => setActiveModalVideo(null)}
      />
    </>
  );
}
