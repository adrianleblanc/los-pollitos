"use client";

import { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import { YoutubeIcon } from "@/components/ui/icons";
import { YouTubeVideo } from "@/services/youtube-public";

interface VideoModalProps {
  video: YouTubeVideo | null;
  onClose: () => void;
}

export function VideoModal({ video, onClose }: VideoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!video) return null;

  const isRealYoutubeId = !video.id.startsWith("demo_");
  const embedUrl = isRealYoutubeId
    ? `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`
    : `https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1`; // Fallback preview embed

  const watchUrl = isRealYoutubeId
    ? `https://www.youtube.com/watch?v=${video.id}`
    : `https://www.youtube.com/@LosPollitosTejen`;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-neutral-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between gap-4">
          <div className="min-w-0 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400 shrink-0">
              <YoutubeIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-white truncate">
                {video.title}
              </h3>
              <p className="text-xs text-neutral-400">Canal: Los Pollitos Tejen</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Embed */}
        <div className="relative aspect-video bg-black">
          <iframe
            src={embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Video Info Footer */}
        <div className="p-5 bg-neutral-950/80 border-t border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-neutral-400 line-clamp-2 max-w-xl">
            {video.description}
          </p>

          <a
            href={watchUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all shrink-0 self-start sm:self-auto"
          >
            <YoutubeIcon className="w-4 h-4 fill-white" />
            <span>Ver en YouTube</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
