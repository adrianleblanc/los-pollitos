"use client";

import { useState } from "react";
import {
  Play,
  Heart,
  Sparkles,
  Users,
  Film,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { YoutubeIcon } from "@/components/ui/icons";
import { ChannelInfo, YouTubeVideo } from "@/services/youtube-public";
import { VideoModal } from "./video-modal";

interface HeroProps {
  channel: ChannelInfo;
  featuredVideo?: YouTubeVideo;
}

export function PublicHero({ channel, featuredVideo }: HeroProps) {
  const [activeModalVideo, setActiveModalVideo] =
    useState<YouTubeVideo | null>(null);

  return (
    <>
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 border-b border-amber-950/30">
        {/* Background glow & crochet pattern elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tutoriales de tejido con amor 🧶</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Aprende a tejer a crochet{" "}
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-rose-400 bg-clip-text text-transparent">
                  paso a paso
                </span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Descubre tutoriales detallados para todos los niveles: desde adorables
                trajes para gatos y perritos, gorros temáticos, hasta accesorios,
                flores y amigurumis explicados con paciencia y cariño.
              </p>

              {/* Badges / Stats Bar */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                  <Users className="w-4 h-4 text-amber-400" />
                  <div className="text-left">
                    <span className="text-xs font-bold text-white block">
                      {channel.subscriberCount}
                    </span>
                    <span className="text-[10px] text-neutral-400 block">
                      Suscriptores
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                  <Film className="w-4 h-4 text-rose-400" />
                  <div className="text-left">
                    <span className="text-xs font-bold text-white block">
                      {channel.videoCount}+
                    </span>
                    <span className="text-[10px] text-neutral-400 block">
                      Tutoriales Gratis
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <div className="text-left">
                    <span className="text-xs font-bold text-white block">
                      100%
                    </span>
                    <span className="text-[10px] text-neutral-400 block">
                      Hecho con Amor
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <a
                  href="https://www.youtube.com/@LosPollitosTejen?sub_confirmation=1"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-xl shadow-red-600/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-95"
                >
                  <YoutubeIcon className="w-5 h-5 fill-white" />
                  <span>Suscribirme al Canal</span>
                </a>

                <a
                  href="#videos"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span>Ver Todos los Videos</span>
                </a>
              </div>
            </div>

            {/* Right Featured Video Showcase */}
            <div className="lg:col-span-5">
              {featuredVideo && (
                <div className="relative group rounded-3xl p-3 bg-gradient-to-b from-amber-500/20 via-neutral-900/60 to-neutral-950 border border-amber-500/30 shadow-2xl">
                  <div
                    onClick={() => setActiveModalVideo(featuredVideo)}
                    className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer bg-neutral-950 shadow-inner group-hover:opacity-95 transition-opacity"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featuredVideo.thumbnailUrl}
                      alt={featuredVideo.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Play Overlay Button */}
                    <div className="absolute inset-0 bg-neutral-950/40 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center shadow-xl shadow-amber-400/30 transform transition-all group-hover:scale-110 group-hover:bg-amber-300">
                        <Play className="w-7 h-7 fill-neutral-950 ml-1" />
                      </div>
                    </div>

                    {/* Featured Top Badge */}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-amber-500 text-neutral-950 text-xs font-black uppercase tracking-wider shadow-md">
                      ⭐ Video Destacado
                    </div>

                    {/* Duration Badge */}
                    {featuredVideo.duration && (
                      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-neutral-950/90 text-xs font-mono font-bold text-white backdrop-blur-sm border border-neutral-800">
                        {featuredVideo.duration}
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-1.5">
                    <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                      {featuredVideo.title}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {featuredVideo.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <VideoModal
        video={activeModalVideo}
        onClose={() => setActiveModalVideo(null)}
      />
    </>
  );
}
