"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Film,
  Image as ImageIcon,
  Sparkles,
  Upload,
  Calendar,
  Send,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  X,
  Play,
  Check,
  Plus,
  Trash2,
  Info,
  Shield,
  Loader2,
  ExternalLink,
  Share2,
} from "lucide-react";
import { MediaUploader } from "@/components/admin/media-uploader";
import { YoutubeIcon, FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/ui/icons";

interface ContentEditorProps {
  initialData?: any;
  isEditing?: boolean;
}

interface MultiPublishResult {
  platform: string;
  name: string;
  success: boolean;
  postUrl?: string;
  error?: string;
  timeMs?: number;
}

export function ContentEditor({ initialData, isEditing }: ContentEditorProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Live Publishing Results Modal
  const [publishModal, setPublishModal] = useState<{
    isOpen: boolean;
    results: MultiPublishResult[];
  } | null>(null);

  // Form State
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [type, setType] = useState<string>(initialData?.type || "STANDARD_VIDEO");
  const [status, setStatus] = useState<string>(initialData?.status || "DRAFT");
  const [tags, setTags] = useState<string[]>(initialData?.tags || ["lospollitos", "tutorial", "crochet"]);
  const [tagInput, setTagInput] = useState("");
  const [scheduledDate, setScheduledDate] = useState<string>(
    initialData?.scheduledFor
      ? new Date(initialData.scheduledFor).toISOString().slice(0, 16)
      : ""
  );

  // Selected Media state
  const [selectedPrimaryMedia, setSelectedPrimaryMedia] = useState<any>(
    initialData?.media?.find((m: any) => m.role === "PRIMARY_VIDEO")?.media || null
  );
  const [selectedThumbnailMedia, setSelectedThumbnailMedia] = useState<any>(
    initialData?.media?.find((m: any) => m.role === "THUMBNAIL")?.media || null
  );

  // Media Library Picker Modal
  const [showMediaModal, setShowMediaModal] = useState<"primary" | "thumbnail" | null>(null);
  const [mediaLibrary, setMediaLibrary] = useState<any[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [mediaModalTab, setMediaModalTab] = useState<"library" | "upload">("library");

  // Platform publishing selection
  const [targetPlatforms, setTargetPlatforms] = useState<string[]>([
    "YOUTUBE",
    "INSTAGRAM",
    "FACEBOOK",
    "TIKTOK",
  ]);

  // YouTube Specific Settings
  const [ytPrivacy, setYtPrivacy] = useState<string>("private");
  const [ytTargetChannel, setYtTargetChannel] = useState<string>("TESTING_ADRIAN");
  const [ytMadeForKids, setYtMadeForKids] = useState<boolean>(false);

  // Load existing media from R2 for picker
  const loadMediaLibrary = async () => {
    try {
      setIsLoadingMedia(true);
      const res = await fetch("/api/media");
      if (res.ok) {
        const data = await res.json();
        setMediaLibrary(data.media || []);
      }
    } catch (err) {
      console.error("Error loading media:", err);
    } finally {
      setIsLoadingMedia(false);
    }
  };

  useEffect(() => {
    if (showMediaModal) {
      loadMediaLibrary();
    }
  }, [showMediaModal]);

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const clean = tagInput.replace(/^#/, "").trim().toLowerCase();
    if (!tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const togglePlatform = (p: string) => {
    if (targetPlatforms.includes(p)) {
      setTargetPlatforms(targetPlatforms.filter((item) => item !== p));
    } else {
      setTargetPlatforms([...targetPlatforms, p]);
    }
  };

  const handleSubmit = async (submitStatus: "DRAFT" | "READY" | "SCHEDULED" | "PUBLISH_NOW") => {
    if (!title.trim()) {
      setErrorMessage("Por favor ingresa un título para el contenido.");
      return;
    }

    if (submitStatus === "PUBLISH_NOW" && !selectedPrimaryMedia) {
      setErrorMessage("Para publicar en redes se requiere asignar un archivo multimedia de Cloudflare R2.");
      return;
    }

    // Validate Instagram 90s limit for Reels
    if (
      submitStatus === "PUBLISH_NOW" &&
      targetPlatforms.includes("INSTAGRAM") &&
      selectedPrimaryMedia?.mediaType === "VIDEO" &&
      selectedPrimaryMedia?.durationSec > 90
    ) {
      setErrorMessage(
        `Instagram limita los videos vía API a 90 segundos. El video seleccionado dura ${Math.round(
          selectedPrimaryMedia.durationSec
        )}s. Por favor desmarca Instagram o recorta el video.`
      );
      return;
    }

    // Validate TikTok video requirement
    if (
      submitStatus === "PUBLISH_NOW" &&
      targetPlatforms.includes("TIKTOK") &&
      selectedPrimaryMedia?.mediaType !== "VIDEO"
    ) {
      setErrorMessage("TikTok requiere un archivo de video para publicar.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const mediaIds: any[] = [];
      if (selectedPrimaryMedia) {
        mediaIds.push({
          mediaId: selectedPrimaryMedia.id,
          role: "PRIMARY_VIDEO",
          sortOrder: 0,
        });
      }
      if (selectedThumbnailMedia) {
        mediaIds.push({
          mediaId: selectedThumbnailMedia.id,
          role: "THUMBNAIL",
          sortOrder: 1,
        });
      }

      const contentStatus =
        submitStatus === "PUBLISH_NOW"
          ? "PUBLISHING"
          : submitStatus === "SCHEDULED"
          ? "SCHEDULED"
          : submitStatus === "READY"
          ? "READY"
          : "DRAFT";

      const payload = {
        title,
        description,
        type,
        status: contentStatus,
        tags,
        scheduledFor:
          submitStatus === "SCHEDULED" && scheduledDate
            ? new Date(scheduledDate).toISOString()
            : null,
        mediaIds,
        targetPlatforms,
        customMetadata: {
          youtube: {
            privacyStatus: ytPrivacy,
            targetChannel: ytTargetChannel,
            selfDeclaredMadeForKids: ytMadeForKids,
          },
          meta: {
            instagramShareToFeed: true,
          },
          tiktok: {
            is_aigc: false,
          },
        },
      };

      const url = isEditing ? `/api/content/${initialData.id}` : "/api/content";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error al guardar el contenido.");
      }

      const savedData = await res.json();
      const contentId = savedData.content.id;

      // Multi-Platform Publishing Execution (Parallel)
      if (submitStatus === "PUBLISH_NOW") {
        const publishResults: MultiPublishResult[] = [];

        // 1. YouTube Pipeline
        if (targetPlatforms.includes("YOUTUBE")) {
          try {
            const ytRes = await fetch("/api/publish/youtube", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ contentId, privacyStatus: ytPrivacy }),
            });
            const ytData = await ytRes.json();
            publishResults.push({
              platform: "YOUTUBE",
              name: `YouTube (${ytTargetChannel === "TESTING_ADRIAN" ? "@AdrianLeblancMorales" : "@LosPollitosTejen"})`,
              success: ytRes.ok && ytData.success,
              postUrl: ytData.videoUrl,
              error: ytData.error,
              timeMs: ytData.executionTimeMs,
            });
          } catch (err: any) {
            publishResults.push({
              platform: "YOUTUBE",
              name: "YouTube",
              success: false,
              error: err.message,
            });
          }
        }

        // 2. Meta (Facebook & Instagram) Pipeline
        const metaPlatforms = targetPlatforms.filter(
          (p) => p === "FACEBOOK" || p === "INSTAGRAM"
        );

        if (metaPlatforms.length > 0) {
          try {
            const metaRes = await fetch("/api/publish/meta", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contentId,
                platforms: metaPlatforms,
              }),
            });
            const metaData = await metaRes.json();
            if (metaData.results) {
              for (const r of metaData.results) {
                publishResults.push({
                  platform: r.platform,
                  name: r.platform === "FACEBOOK" ? "Facebook Page" : "Instagram Reels / Feed",
                  success: r.success,
                  postUrl: r.postUrl,
                  error: r.errorMessage,
                  timeMs: r.executionTimeMs,
                });
              }
            }
          } catch (err: any) {
            publishResults.push({
              platform: "META",
              name: "Meta (Facebook/IG)",
              success: false,
              error: err.message,
            });
          }
        }

        // 3. TikTok Pipeline
        if (targetPlatforms.includes("TIKTOK")) {
          try {
            const ttRes = await fetch("/api/publish/tiktok", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ contentId }),
            });
            const ttData = await ttRes.json();
            publishResults.push({
              platform: "TIKTOK",
              name: "TikTok (Direct Post)",
              success: ttRes.ok && ttData.success,
              postUrl: ttData.postUrl,
              error: ttData.error,
              timeMs: ttData.executionTimeMs,
            });
          } catch (err: any) {
            publishResults.push({
              platform: "TIKTOK",
              name: "TikTok",
              success: false,
              error: err.message,
            });
          }
        }

        setPublishModal({
          isOpen: true,
          results: publishResults,
        });
      } else {
        router.push("/admin/content");
        router.refresh();
      }
    } catch (err: any) {
      console.error("Save error:", err);
      setErrorMessage(err.message || "Ocurrió un error al guardar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Main Editing Canvas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Format / Content Type Selector */}
          <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
              Formato de Contenido
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                {
                  id: "STANDARD_VIDEO",
                  label: "Video Estándar",
                  sub: "16:9 Horizontal",
                  icon: "🎬",
                },
                {
                  id: "SHORT_VIDEO",
                  label: "Short / Reel / TikTok",
                  sub: "9:16 Vertical (≤90s)",
                  icon: "📱",
                },
                {
                  id: "POST_IMAGE",
                  label: "Foto / Post",
                  sub: "1:1 o 4:5",
                  icon: "📸",
                },
                {
                  id: "CAROUSEL",
                  label: "Carrusel",
                  sub: "Hasta 10 items",
                  icon: "📚",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setType(item.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    type === item.id
                      ? "bg-amber-500/10 border-amber-500 text-amber-300 shadow-md shadow-amber-500/10"
                      : "bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                  }`}
                >
                  <span className="text-xl block mb-1">{item.icon}</span>
                  <p className="text-xs font-bold text-white">{item.label}</p>
                  <p className="text-[10px] text-neutral-500">{item.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Primary Details Form */}
          <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-5">
            {/* Title with Character Counter */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-neutral-200">
                  Título del Video / Publicación *
                </label>
                <span
                  className={`text-[11px] font-mono ${
                    title.length > 90 ? "text-amber-400 font-bold" : "text-neutral-500"
                  }`}
                >
                  {title.length} / 100 caracteres (YouTube)
                </span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                placeholder="Ej: Gorro de Venom a crochet paso a paso para principiantes..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/50 shadow-inner"
              />
            </div>

            {/* Description / Caption */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-neutral-200">
                  Descripción & Caption (Multi-red)
                </label>
                <span className="text-[11px] text-neutral-500 font-mono">
                  {description.length} caracteres
                </span>
              </div>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe el tutorial, materiales necesarios (aguja, número de lana), puntos empleados y enlaces..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/50 resize-y shadow-inner leading-relaxed"
              />
            </div>

            {/* Tags & Hashtags */}
            <div>
              <label className="text-xs font-bold text-neutral-200 block mb-2">
                Etiquetas / Hashtags
              </label>

              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Escribe una etiqueta y presiona Enter..."
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/50"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs cursor-pointer"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>

          {/* Media Attachments Section */}
          <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Multimedia Asignada (Cloudflare R2)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Primary Video / File */}
              <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Film className="w-4 h-4 text-amber-400" />
                      <span>Archivo Principal</span>
                    </span>
                    {selectedPrimaryMedia && (
                      <button
                        type="button"
                        onClick={() => setSelectedPrimaryMedia(null)}
                        className="text-neutral-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {selectedPrimaryMedia ? (
                    <div className="space-y-2">
                      <div className="relative aspect-video rounded-xl bg-neutral-900 overflow-hidden">
                        {selectedPrimaryMedia.mediaType === "IMAGE" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={selectedPrimaryMedia.publicUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : selectedPrimaryMedia.thumbnailUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={selectedPrimaryMedia.thumbnailUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-neutral-500">
                            <Play className="w-6 h-6 text-amber-400" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-white truncate">
                        {selectedPrimaryMedia.name}
                      </p>
                      <p className="text-[10px] text-neutral-400">
                        {selectedPrimaryMedia.aspectRatio || "16:9"} •{" "}
                        {selectedPrimaryMedia.durationSec ? `${Math.round(selectedPrimaryMedia.durationSec)}s • ` : ""}
                        {(Number(selectedPrimaryMedia.fileSize) / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500 py-4 text-center">
                      No hay video o imagen principal seleccionada.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setShowMediaModal("primary")}
                  className="w-full py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>{selectedPrimaryMedia ? "Cambiar Archivo" : "Seleccionar / Subir a R2"}</span>
                </button>
              </div>

              {/* Custom Thumbnail */}
              <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-purple-400" />
                      <span>Miniatura Personalizada</span>
                    </span>
                    {selectedThumbnailMedia && (
                      <button
                        type="button"
                        onClick={() => setSelectedThumbnailMedia(null)}
                        className="text-neutral-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {selectedThumbnailMedia ? (
                    <div className="space-y-2">
                      <div className="relative aspect-video rounded-xl bg-neutral-900 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={selectedThumbnailMedia.publicUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs font-semibold text-white truncate">
                        {selectedThumbnailMedia.name}
                      </p>
                      <p className="text-[10px] text-neutral-400">
                        1280×720 (JPEG/PNG)
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500 py-4 text-center">
                      Opcional. YouTube, Instagram y TikTok usarán portada automática si no se especifica.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setShowMediaModal("thumbnail")}
                  className="w-full py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                  <span>{selectedThumbnailMedia ? "Cambiar Miniatura" : "Elegir Miniatura"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Channel Target & Publishing Actions */}
        <div className="space-y-6">
          {/* Target Platforms */}
          <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Canales de Distribución
            </h3>

            <div className="space-y-2.5">
              {/* YouTube */}
              <div
                onClick={() => togglePlatform("YOUTUBE")}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  targetPlatforms.includes("YOUTUBE")
                    ? "bg-red-500/10 border-red-500/40 text-white shadow-sm"
                    : "bg-neutral-950/60 border-neutral-800 text-neutral-400 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <YoutubeIcon className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-xs font-bold text-white">YouTube</p>
                      <p className="text-[10px] text-amber-400 font-semibold">
                        {ytTargetChannel === "TESTING_ADRIAN"
                          ? "Canal Pruebas (@AdrianLeblancMorales)"
                          : "Canal Oficial (@LosPollitosTejen)"}
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    readOnly
                    checked={targetPlatforms.includes("YOUTUBE")}
                    className="accent-red-500 w-4 h-4 rounded"
                  />
                </div>
              </div>

              {/* Instagram */}
              <div
                onClick={() => togglePlatform("INSTAGRAM")}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  targetPlatforms.includes("INSTAGRAM")
                    ? "bg-pink-500/10 border-pink-500/40 text-white shadow-sm"
                    : "bg-neutral-950/60 border-neutral-800 text-neutral-400 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <InstagramIcon className="w-5 h-5 text-pink-400" />
                    <div>
                      <p className="text-xs font-bold text-white">Instagram</p>
                      <p className="text-[10px] text-pink-400 font-semibold">
                        Reels & Feed (API v26.0)
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    readOnly
                    checked={targetPlatforms.includes("INSTAGRAM")}
                    className="accent-pink-500 w-4 h-4 rounded"
                  />
                </div>
              </div>

              {/* Facebook */}
              <div
                onClick={() => togglePlatform("FACEBOOK")}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  targetPlatforms.includes("FACEBOOK")
                    ? "bg-blue-500/10 border-blue-500/40 text-white shadow-sm"
                    : "bg-neutral-950/60 border-neutral-800 text-neutral-400 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FacebookIcon className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-xs font-bold text-white">Facebook Page</p>
                      <p className="text-[10px] text-blue-400 font-semibold">
                        Página Oficial & Videos
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    readOnly
                    checked={targetPlatforms.includes("FACEBOOK")}
                    className="accent-blue-500 w-4 h-4 rounded"
                  />
                </div>
              </div>

              {/* TikTok */}
              <div
                onClick={() => togglePlatform("TIKTOK")}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  targetPlatforms.includes("TIKTOK")
                    ? "bg-teal-500/10 border-teal-500/40 text-white shadow-sm"
                    : "bg-neutral-950/60 border-neutral-800 text-neutral-400 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <TikTokIcon className="w-5 h-5 text-teal-400" />
                    <div>
                      <p className="text-xs font-bold text-white">TikTok</p>
                      <p className="text-[10px] text-teal-400 font-semibold">
                        Content Posting API v2
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    readOnly
                    checked={targetPlatforms.includes("TIKTOK")}
                    className="accent-teal-500 w-4 h-4 rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="p-5 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-3 shadow-xl">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit("PUBLISH_NOW")}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publicando en {targetPlatforms.length} Redes...</span>
                </div>
              ) : (
                <>
                  <Share2 className="w-4 h-4 stroke-[2.5]" />
                  <span>Publicar Ahora ({targetPlatforms.length} Redes)</span>
                </>
              )}
            </button>

            {scheduledDate && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit("SCHEDULED")}
                className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
              >
                <Clock className="w-4 h-4" />
                <span>Programar con Inngest</span>
              </button>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit("READY")}
                className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs border border-amber-500/30 flex items-center justify-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Listo</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit("DRAFT")}
                className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Borrador</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Platform Live Publishing Result Modal */}
      {publishModal && (
        <div className="fixed inset-0 z-50 bg-neutral-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 text-center shadow-2xl space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 text-neutral-950 flex items-center justify-center text-2xl mx-auto shadow-lg shadow-amber-500/20">
              🚀
            </div>

            <div>
              <h3 className="text-lg font-black text-white">
                Resultado de Publicación Multi-Red
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Transmisión simultánea desde Cloudflare R2 hacia YouTube, Meta y TikTok
              </p>
            </div>

            {/* Platform Results List */}
            <div className="space-y-2.5 text-left">
              {publishModal.results.map((res, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 shrink-0">
                      {res.platform === "YOUTUBE" && <YoutubeIcon className="w-4 h-4 fill-red-500" />}
                      {res.platform === "INSTAGRAM" && <InstagramIcon className="w-4 h-4 text-pink-400" />}
                      {res.platform === "FACEBOOK" && <FacebookIcon className="w-4 h-4 text-blue-400" />}
                      {res.platform === "TIKTOK" && <TikTokIcon className="w-4 h-4 text-teal-400" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate">{res.name}</p>
                      {res.success ? (
                        <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Publicado {res.timeMs ? `(${(res.timeMs / 1000).toFixed(1)}s)` : ""}</span>
                        </p>
                      ) : (
                        <p className="text-[10px] text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{res.error || "Fallo"}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {res.success && res.postUrl && (
                    <a
                      href={res.postUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-[11px] font-bold text-amber-300 flex items-center gap-1 shrink-0"
                    >
                      <span>Abrir</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setPublishModal(null);
                router.push("/admin/content");
                router.refresh();
              }}
              className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs cursor-pointer"
            >
              Cerrar y Ver Contenidos
            </button>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 z-50 bg-neutral-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Seleccionar {showMediaModal === "primary" ? "Archivo Principal" : "Miniatura"} de Cloudflare R2
                </h3>
                <p className="text-xs text-neutral-400">
                  Elige un archivo de tu biblioteca o sube uno nuevo directamente
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowMediaModal(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-neutral-800 px-5 pt-3 gap-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setMediaModalTab("library")}
                className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                  mediaModalTab === "library"
                    ? "border-amber-400 text-amber-300"
                    : "border-transparent text-neutral-400 hover:text-white"
                }`}
              >
                Biblioteca R2 ({mediaLibrary.length})
              </button>
              <button
                type="button"
                onClick={() => setMediaModalTab("upload")}
                className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                  mediaModalTab === "upload"
                    ? "border-amber-400 text-amber-300"
                    : "border-transparent text-neutral-400 hover:text-white"
                }`}
              >
                Subir Nuevo Archivo
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto">
              {mediaModalTab === "upload" ? (
                <MediaUploader
                  onSuccess={(newMedia) => {
                    if (showMediaModal === "primary") {
                      setSelectedPrimaryMedia(newMedia);
                    } else {
                      setSelectedThumbnailMedia(newMedia);
                    }
                    setShowMediaModal(null);
                  }}
                />
              ) : isLoadingMedia ? (
                <div className="p-12 text-center text-neutral-400 flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                  <span className="text-xs">Cargando biblioteca R2...</span>
                </div>
              ) : mediaLibrary.length === 0 ? (
                <div className="p-12 text-center text-neutral-500">
                  <p className="text-xs mb-3">No hay archivos en tu biblioteca R2.</p>
                  <button
                    type="button"
                    onClick={() => setMediaModalTab("upload")}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs"
                  >
                    Subir Archivo Ahora
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  {mediaLibrary.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (showMediaModal === "primary") {
                          setSelectedPrimaryMedia(item);
                        } else {
                          setSelectedThumbnailMedia(item);
                        }
                        setShowMediaModal(null);
                      }}
                      className="group p-2.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 cursor-pointer transition-all flex flex-col justify-between"
                    >
                      <div className="relative aspect-video rounded-xl bg-neutral-900 overflow-hidden mb-2">
                        {item.mediaType === "IMAGE" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.publicUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : item.thumbnailUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.thumbnailUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-neutral-500">
                            <Film className="w-6 h-6 text-amber-400" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-white truncate" title={item.name}>
                        {item.name}
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">
                        {item.mediaType} • {(Number(item.fileSize) / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
