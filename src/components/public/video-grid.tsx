"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Play,
  Film,
  Hash,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
} from "lucide-react";
import { YouTubeVideo, POPULAR_HASHTAGS } from "@/services/youtube-public";
import { VideoModal } from "./video-modal";

interface VideoGridProps {
  videos: YouTubeVideo[];
}

const CATEGORIES = [
  { id: "all", label: "✨ Todos los Videos" },
  { id: "mascotas", label: "🐱🐶 Ropa Mascotas" },
  { id: "granny", label: "🌻 Granny Squares" },
  { id: "prendas", label: "🧶 Gorros & Prendas" },
  { id: "tutorial", label: "🌸 Puntos & Tutoriales" },
  { id: "shorts", label: "⚡ Shorts Rápidos" },
];

const ITEMS_PER_PAGE = 9;

export function VideoGrid({ videos }: VideoGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeModalVideo, setActiveModalVideo] =
    useState<YouTubeVideo | null>(null);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedHashtag, searchQuery]);

  // Filtered list
  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesCategory =
        selectedCategory === "all" || video.category === selectedCategory;

      const matchesHashtag =
        !selectedHashtag ||
        video.tags?.some((t) => t.toLowerCase() === selectedHashtag.toLowerCase());

      const query = searchQuery.trim().toLowerCase().replace(/^#/, "");
      const matchesSearch =
        query === "" ||
        video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query) ||
        video.tags?.some((t) => t.toLowerCase().includes(query));

      return matchesCategory && matchesHashtag && matchesSearch;
    });
  }, [videos, selectedCategory, selectedHashtag, searchQuery]);

  // Total pages
  const totalPages = Math.ceil(filteredVideos.length / ITEMS_PER_PAGE) || 1;

  // Sliced page items
  const paginatedVideos = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredVideos.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredVideos, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const section = document.getElementById("videos");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleHashtagClick = (tag: string) => {
    if (selectedHashtag === tag) {
      setSelectedHashtag(null);
    } else {
      setSelectedHashtag(tag);
    }
  };

  return (
    <>
      <section id="videos" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold">
            <Film className="w-3.5 h-3.5" />
            <span>Catálogo Completo de Tutoriales</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Explora, Filtra y Teje con Nosotros
          </h2>
          <p className="text-neutral-400 text-sm md:text-base">
            Busca por palabra clave, filtra por categoría o selecciona un hashtag temático.
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="max-w-2xl mx-auto mb-6 relative">
          <Search className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, punto o hashtag (ej: #gato, girasol, venom, #bebe)..."
            className="w-full bg-neutral-900/90 border border-neutral-800 rounded-2xl pl-11 pr-10 py-3.5 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/50 shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
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

        {/* Popular Hashtags Pills */}
        <div className="flex items-center justify-center flex-wrap gap-1.5 max-w-3xl mx-auto mb-10">
          <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-bold uppercase tracking-wider mr-1">
            <Hash className="w-3 h-3 text-amber-400" />
            <span>Hashtags:</span>
          </div>
          {POPULAR_HASHTAGS.map((tag) => {
            const isSelected = selectedHashtag === tag;
            return (
              <button
                key={tag}
                onClick={() => handleHashtagClick(tag)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-rose-500 text-white shadow-sm scale-105 font-bold"
                    : "bg-neutral-900/60 text-neutral-400 hover:text-amber-300 hover:bg-neutral-800 border border-neutral-800"
                }`}
              >
                #{tag}
              </button>
            );
          })}
          {selectedHashtag && (
            <button
              onClick={() => setSelectedHashtag(null)}
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-neutral-400 hover:text-rose-400 bg-neutral-900 border border-neutral-800 flex items-center gap-1"
              title="Limpiar filtro de hashtag"
            >
              <X className="w-3 h-3" />
              <span>Quitar #{selectedHashtag}</span>
            </button>
          )}
        </div>

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between border-b border-neutral-800/60 pb-3 mb-8 text-xs text-neutral-400">
          <span>
            Mostrando{" "}
            <strong className="text-white">
              {filteredVideos.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}
              {" - "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredVideos.length)}
            </strong>{" "}
            de <strong className="text-white">{filteredVideos.length}</strong> tutoriales
          </span>

          {(selectedCategory !== "all" || selectedHashtag || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedHashtag(null);
                setSearchQuery("");
              }}
              className="text-amber-400 hover:underline font-semibold"
            >
              Restablecer todos los filtros
            </button>
          )}
        </div>

        {/* Video Cards Grid */}
        {filteredVideos.length === 0 ? (
          <div className="p-16 rounded-3xl bg-neutral-900/40 border border-neutral-800/60 border-dashed text-center">
            <div className="w-12 h-12 rounded-2xl bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto mb-3 text-xl">
              🔍
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              No se encontraron videos con los filtros seleccionados
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-4">
              Prueba buscando por otro término o haz clic en restablecer filtros.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedHashtag(null);
                setSearchQuery("");
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs"
            >
              Ver todos los videos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {paginatedVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => setActiveModalVideo(video)}
                className="group rounded-3xl bg-neutral-900/70 border border-neutral-800/80 overflow-hidden hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video bg-neutral-950 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-neutral-950/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-13 h-13 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center shadow-lg shadow-amber-400/30 transform transition-transform group-hover:scale-110">
                      <Play className="w-6 h-6 fill-neutral-950 ml-0.5" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  {video.duration && (
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-neutral-950/85 text-[11px] font-mono font-bold text-white border border-neutral-800">
                      {video.duration}
                    </div>
                  )}

                  {/* Category Pill Badge */}
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg bg-neutral-950/80 backdrop-blur-sm border border-neutral-800 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                    {video.category}
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                      {video.title}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  {/* Hashtags list */}
                  <div className="pt-2 flex flex-wrap gap-1">
                    {video.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHashtagClick(tag);
                        }}
                        className="text-[10px] text-amber-400/80 hover:text-amber-300 bg-neutral-950/80 px-2 py-0.5 rounded-md border border-neutral-800/80 hover:border-amber-500/40 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Navigation Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-800/60">
            <div className="text-xs text-neutral-400">
              Página <strong className="text-white">{currentPage}</strong> de{" "}
              <strong className="text-white">{totalPages}</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Página Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    currentPage === pageNum
                      ? "bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/20 scale-105"
                      : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Página Siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Video Modal */}
      <VideoModal
        video={activeModalVideo}
        onClose={() => setActiveModalVideo(null)}
      />
    </>
  );
}
