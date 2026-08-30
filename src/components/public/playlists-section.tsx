"use client";

import { ListMusic, ExternalLink, Play, Sparkles } from "lucide-react";
import { YoutubeIcon } from "@/components/ui/icons";

export interface PlaylistInfo {
  id: string;
  title: string;
  videoCount: string;
  thumbnailUrl: string;
  description: string;
  updatedAt: string;
  url: string;
  categoryFilter?: string;
  tagFilter?: string;
}

export const OFFICIAL_PLAYLISTS: PlaylistInfo[] = [
  {
    id: "pl_accesorios_mascotas",
    title: "🐾 ACCESORIOS A CROCHET PARA MASCOTAS | Los Pollitos Tejen",
    videoCount: "5 vídeos",
    thumbnailUrl: "https://i.ytimg.com/vi/TfV5IsBMxIw/hqdefault.jpg",
    description: "Hamacas, camas y accesorios cómodos y resistentes para gatos y perros.",
    updatedAt: "Actualizada hace 7 días",
    url: "https://www.youtube.com/@LosPollitosTejen/playlists",
    categoryFilter: "mascotas",
    tagFilter: "mascotas",
  },
  {
    id: "pl_trajes_perros_gatos",
    title: "🐶🐱 TRAJES A CROCHET PARA PERROS Y GATOS | Los Pollitos Tejen",
    videoCount: "9 vídeos",
    thumbnailUrl: "https://i.ytimg.com/vi/bd25PBimhCM/hqdefault.jpg",
    description: "Serie completa de suéteres, chalecos, vestidos y trajes con medidas paso a paso.",
    updatedAt: "Actualizada hace 7 días",
    url: "https://www.youtube.com/@LosPollitosTejen/playlists",
    categoryFilter: "mascotas",
    tagFilter: "sueter",
  },
  {
    id: "pl_mi_granny_favorito",
    title: "🌸 Mi Granny Favorito",
    videoCount: "12 vídeos",
    thumbnailUrl: "https://i.ytimg.com/vi/Yu-XYOUPSy0/hqdefault.jpg",
    description: "Colección de cuadros de la abuela (granny squares) con flores, girasoles y relieves.",
    updatedAt: "Actualizada recientemente",
    url: "https://www.youtube.com/@LosPollitosTejen/playlists",
    categoryFilter: "granny",
    tagFilter: "grannysquare",
  },
  {
    id: "pl_coleccion_puntos",
    title: "🪡 Colección de Puntos a Crochet",
    videoCount: "33 vídeos",
    thumbnailUrl: "https://i.ytimg.com/vi/pMAbrvYM71A/hqdefault.jpg",
    description: "Muestrario completo de puntos: calados, trenzados, espigas, cestas y fantasía.",
    updatedAt: "Actualizada recientemente",
    url: "https://www.youtube.com/@LosPollitosTejen/playlists",
    categoryFilter: "tutorial",
    tagFilter: "puntos",
  },
  {
    id: "pl_curso_basico",
    title: "🧶 CURSO BÁSICO DE CROCHET | Aprende desde Cero Paso a Paso",
    videoCount: "10 lecciones",
    thumbnailUrl: "https://i.ytimg.com/vi/0A0otH_G1yY/hqdefault.jpg",
    description: "Materiales, nudo corredizo, cadenetas y primeros proyectos para principiantes.",
    updatedAt: "Actualizada hace 5 días",
    url: "https://www.youtube.com/playlist?list=PLDILFmFqvqpszAABF0Auy18729DF05P2t",
    categoryFilter: "tutorial",
    tagFilter: "principiantes",
  },
];

interface PlaylistsSectionProps {
  onSelectPlaylist?: (playlist: PlaylistInfo) => void;
}

export function PlaylistsSection({ onSelectPlaylist }: PlaylistsSectionProps) {
  const handlePlaylistClick = (playlist: PlaylistInfo) => {
    if (onSelectPlaylist) {
      onSelectPlaylist(playlist);
    } else {
      window.open(playlist.url, "_blank");
    }
  };

  return (
    <section id="listas-de-reproduccion" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-amber-950/20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold mb-2">
            <ListMusic className="w-3.5 h-3.5 text-amber-400" />
            <span>Colecciones Temáticas</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Listas de Reproducción Oficiales
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            Series completas y organizadas por temática para tejer tus proyectos favoritos.
          </p>
        </div>

        <a
          href="https://www.youtube.com/@LosPollitosTejen/playlists"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 bg-neutral-900 hover:bg-neutral-800 px-4 py-2 rounded-xl border border-neutral-800 transition-colors shrink-0"
        >
          <YoutubeIcon className="w-4 h-4" />
          <span>Ver todas en YouTube</span>
          <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
        </a>
      </div>

      {/* Playlist Cards Carousel / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {OFFICIAL_PLAYLISTS.map((playlist) => (
          <div
            key={playlist.id}
            onClick={() => handlePlaylistClick(playlist)}
            className="group flex flex-col rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-amber-500/40 transition-all duration-300 overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-amber-500/10"
          >
            {/* Layered Card Stack Effect for Playlists */}
            <div className="relative pt-1.5 px-1.5">
              {/* Stack effect layer */}
              <div className="absolute top-0 left-3 right-3 h-2 bg-neutral-800/60 rounded-t-xl" />
              
              <div className="relative aspect-video rounded-xl bg-neutral-950 overflow-hidden shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={playlist.thumbnailUrl}
                  alt={playlist.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Playlist Video Count Badge (Bottom-Right overlay like YouTube) */}
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-neutral-950/90 backdrop-blur-sm border border-neutral-800 text-[10px] font-bold text-white flex items-center gap-1.5 shadow-md">
                  <ListMusic className="w-3 h-3 text-amber-400" />
                  <span>{playlist.videoCount}</span>
                </div>

                {/* Play Hover Overlay */}
                <div className="absolute inset-0 bg-neutral-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 fill-neutral-950 ml-0.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Playlist Info */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h3 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                  {playlist.title}
                </h3>
                <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                  {playlist.description}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-800/50 flex items-center justify-between text-[10px] text-neutral-500">
                <span>{playlist.updatedAt}</span>
                <span className="text-amber-400 font-semibold group-hover:underline">
                  Ver lista →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
