"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Play,
  Film,
  Hash,
  X,
  Sparkles,
  ChevronDown,
  Layers,
} from "lucide-react";
import { YouTubeVideo, POPULAR_HASHTAGS } from "@/services/youtube-public";
import { VideoModal } from "./video-modal";

interface VideoGridProps {
  videos: YouTubeVideo[];
  initialCategory?: string;
  initialHashtag?: string | null;
}

const CATEGORIES = [
  { id: "all", label: "✨ Todos los Videos" },
  { id: "mascotas", label: "🐱🐶 Ropa Mascotas" },
  { id: "granny", label: "🌻 Granny Squares" },
  { id: "prendas", label: "🧶 Gorros & Prendas" },
  { id: "tutorial", label: "🌸 Puntos & Tutoriales" },
  { id: "shorts", label: "⚡ Shorts Rápidos" },
];

const INITIAL_VISIBLE_COUNT = 12;
const LOAD_MORE_STEP = 12;

export function VideoGrid({
  videos,
  initialCategory = "all",
  initialHashtag = null,
}: VideoGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(initialHashtag);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_VISIBLE_COUNT);
  const [activeModalVideo, setActiveModalVideo] =
    useState<YouTubeVideo | null>(null);

  // Reset visible count on filter/search change
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
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

  // Slice for progressive loading
  const visibleVideos = useMemo(() => {
    return filteredVideos.slice(0, visibleCount);
  }, [filteredVideos, visibleCount]);

  const handleHashtagClick = (tag: string) => {
    if (selectedHashtag === tag) {
      setSelectedHashtag(null);
    } else {
      setSelectedHashtag(tag);
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + LOAD_MORE_STEP);
  };

  const handleShowAll = () => {
    setVisibleCount(filteredVideos.length);
  };

  const hasMore = visibleCount < filteredVideos.length;
  const progressPercent = Math.min(
    100,
    Math.round((visibleVideos.length / (filteredVideos.length || 1)) * 100)
  );

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
            placeholder="Buscar por título, punto o hashtag (ej: #gato, girasol, venom, #bebe, #puntos)..."
            className="w-full bg-neutral-900/90 border border-neutral-800 rounded-2xl pl-11 pr-10 py-3.5 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/50 shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white cursor-pointer"
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
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-neutral-400 hover:text-rose-400 bg-neutral-900 border border-neutral-800 flex items-center gap-1 cursor-pointer"
              title="Limpiar filtro de hashtag"
            >
              <X className="w-3 h-3" />
              <span>Quitar #{selectedHashtag}</span>
            </button>
          )}
        </div>

        {/* Results Counter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-neutral-800/60 pb-3 mb-8 gap-2 text-xs text-neutral-400">
          <span>
            Mostrando <strong className="text-white">{visibleVideos.length}</strong> de{" "}
            <strong className="text-white">{filteredVideos.length}</strong> tutoriales disponibles
          </span>

          {(selectedCategory !== "all" || selectedHashtag || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedHashtag(null);
                setSearchQuery("");
              }}
              className="text-amber-400 hover:underline font-semibold cursor-pointer"
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
              className="px-5 py-2.5 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs cursor-pointer"
            >
              Ver todos los videos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {visibleVideos.map((video) => (
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
                    loading="lazy"
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

        {/* Load More & Progressive Controls */}
        {hasMore && (
          <div className="mt-14 max-w-md mx-auto text-center space-y-4">
            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span>Progreso del catálogo</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-rose-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleLoadMore}
                className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm shadow-xl shadow-amber-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <ChevronDown className="w-4 h-4" />
                <span>Cargar más videos (+12)</span>
              </button>

              <button
                onClick={handleShowAll}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Mostrar todos ({filteredVideos.length})</span>
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
