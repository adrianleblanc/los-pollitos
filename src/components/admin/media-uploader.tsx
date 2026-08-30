"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface MediaUploadItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: "VIDEO" | "IMAGE" | "AUDIO" | "DOCUMENT";
  progress: number;
  status: "idle" | "uploading" | "extracting" | "success" | "error";
  errorMessage?: string;
  result?: any;
}

interface MediaUploaderProps {
  onSuccess?: (media: any) => void;
  allowedTypes?: ("VIDEO" | "IMAGE")[];
  className?: string;
}

export function MediaUploader({
  onSuccess,
  allowedTypes = ["VIDEO", "IMAGE"],
  className,
}: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<MediaUploadItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractVideoMetadata = (
    file: File
  ): Promise<{
    durationSec: number;
    width: number;
    height: number;
    aspectRatio: string;
    thumbnailDataUrl?: string;
  }> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.muted = true;
      video.playsInline = true;

      const url = URL.createObjectURL(file);
      video.src = url;

      video.onloadedmetadata = () => {
        const width = video.videoWidth || 1920;
        const height = video.videoHeight || 1080;
        const durationSec = video.duration || 0;
        const ratio = width / height;

        let aspectRatio = "16:9";
        if (ratio < 0.8) aspectRatio = "9:16";
        else if (ratio > 0.9 && ratio < 1.1) aspectRatio = "1:1";
        else if (ratio > 1.6) aspectRatio = "16:9";

        // Capture a frame snapshot
        video.currentTime = Math.min(1.0, durationSec / 2);
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = Math.min(640, video.videoWidth);
          canvas.height = Math.min(360, video.videoHeight);
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailDataUrl = canvas.toDataURL("image/jpeg", 0.7);
          URL.revokeObjectURL(url);

          resolve({
            durationSec: video.duration || 0,
            width: video.videoWidth,
            height: video.videoHeight,
            aspectRatio: video.videoWidth / video.videoHeight < 0.8 ? "9:16" : "16:9",
            thumbnailDataUrl,
          });
        } catch {
          URL.revokeObjectURL(url);
          resolve({
            durationSec: video.duration || 0,
            width: video.videoWidth,
            height: video.videoHeight,
            aspectRatio: "16:9",
          });
        }
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({
          durationSec: 0,
          width: 1920,
          height: 1080,
          aspectRatio: "16:9",
        });
      };
    });
  };

  const extractImageMetadata = (
    file: File
  ): Promise<{ width: number; height: number; aspectRatio: string }> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.src = url;

      img.onload = () => {
        const width = img.naturalWidth || 1080;
        const height = img.naturalHeight || 1080;
        const ratio = width / height;

        let aspectRatio = "1:1";
        if (ratio > 1.5) aspectRatio = "16:9";
        else if (ratio < 0.8) aspectRatio = "9:16";
        else if (ratio >= 0.8 && ratio <= 1.2) aspectRatio = "1:1";

        URL.revokeObjectURL(url);
        resolve({ width, height, aspectRatio });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ width: 1080, height: 1080, aspectRatio: "1:1" });
      };
    });
  };

  const processAndUploadFile = async (file: File) => {
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    const mediaType = isVideo ? "VIDEO" : isImage ? "IMAGE" : "DOCUMENT";
    const itemId = Math.random().toString(36).substring(2, 9);

    const newItem: MediaUploadItem = {
      id: itemId,
      file,
      name: file.name,
      size: file.size,
      type: mediaType,
      progress: 0,
      status: "extracting",
    };

    setUploadQueue((prev) => [newItem, ...prev]);

    try {
      // 1. Extract client metadata
      let width = 0;
      let height = 0;
      let durationSec = 0;
      let aspectRatio = "16:9";
      let thumbnailDataUrl: string | undefined;

      if (isVideo) {
        const meta = await extractVideoMetadata(file);
        width = meta.width;
        height = meta.height;
        durationSec = meta.durationSec;
        aspectRatio = meta.aspectRatio;
        thumbnailDataUrl = meta.thumbnailDataUrl;
      } else if (isImage) {
        const meta = await extractImageMetadata(file);
        width = meta.width;
        height = meta.height;
        aspectRatio = meta.aspectRatio;
      }

      setUploadQueue((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, status: "uploading" } : i))
      );

      // 2. Request Presigned URL from backend
      const presignedRes = await fetch("/api/media/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type || "application/octet-stream",
          fileSize: file.size,
        }),
      });

      if (!presignedRes.ok) {
        const errData = await presignedRes.json();
        throw new Error(errData.error || "No se pudo obtener la URL de subida");
      }

      const { uploadUrl, r2Key, publicUrl } = await presignedRes.json();

      // 3. Direct upload to Cloudflare R2 using XMLHttpRequest for real-time progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader(
          "Content-Type",
          file.type || "application/octet-stream"
        );

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            setUploadQueue((prev) =>
              prev.map((i) =>
                i.id === itemId ? { ...i, progress: percent } : i
              )
            );
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Error de subida a R2: ${xhr.statusText}`));
          }
        };

        xhr.onerror = () => reject(new Error("Error de red al conectar con Cloudflare R2"));
        xhr.send(file);
      });

      // 4. Register media in database
      const saveRes = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name.replace(/\.[^/.]+$/, ""),
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type || "application/octet-stream",
          mediaType,
          r2Key,
          publicUrl,
          width: width || null,
          height: height || null,
          durationSec: durationSec || null,
          aspectRatio,
          thumbnailUrl: thumbnailDataUrl || null,
        }),
      });

      if (!saveRes.ok) {
        throw new Error("El archivo se subió a R2 pero falló el registro en la base de datos.");
      }

      const savedData = await saveRes.json();

      setUploadQueue((prev) =>
        prev.map((i) =>
          i.id === itemId
            ? { ...i, progress: 100, status: "success", result: savedData.media }
            : i
        )
      );

      if (onSuccess) {
        onSuccess(savedData.media);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadQueue((prev) =>
        prev.map((i) =>
          i.id === itemId
            ? {
                ...i,
                status: "error",
                errorMessage: err.message || "Error al subir archivo",
              }
            : i
        )
      );
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      processAndUploadFile(file);
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Dropzone Container */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "p-8 rounded-3xl border-2 border-dashed text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-200",
          isDragging
            ? "border-amber-400 bg-amber-500/10 scale-[1.01]"
            : "border-neutral-800 bg-neutral-900/40 hover:border-amber-500/40 hover:bg-neutral-900/70"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="video/mp4,video/quicktime,image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3 shadow-lg shadow-amber-500/5">
          <UploadCloud className="w-7 h-7" />
        </div>

        <p className="text-sm font-bold text-white mb-1">
          Arrastra archivos multimedia aquí o haz clic para explorar
        </p>
        <p className="text-xs text-neutral-400 max-w-md leading-relaxed">
          Sube videos master en alta resolución (MP4, MOV hasta 4 GB) o imágenes (JPEG, PNG). Subida directa y segura a Cloudflare R2 sin límites de servidor.
        </p>
      </div>

      {/* Uploads Progress List */}
      {uploadQueue.length > 0 && (
        <div className="space-y-2.5">
          {uploadQueue.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center gap-3.5"
            >
              <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-amber-400 shrink-0">
                {item.type === "VIDEO" ? (
                  <Film className="w-4 h-4" />
                ) : (
                  <ImageIcon className="w-4 h-4" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-xs font-semibold text-white truncate">
                    {item.name}
                  </p>
                  <span className="text-[11px] font-mono text-neutral-400 shrink-0">
                    {(item.size / (1024 * 1024)).toFixed(1)} MB
                  </span>
                </div>

                {item.status === "uploading" && (
                  <div className="space-y-1">
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full transition-all duration-200"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-amber-400/90 font-medium">
                      Subiendo a R2: {item.progress}%
                    </p>
                  </div>
                )}

                {item.status === "extracting" && (
                  <p className="text-[10px] text-neutral-400 flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                    <span>Analizando resolución y metadata...</span>
                  </p>
                )}

                {item.status === "success" && (
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Completado y guardado en R2</span>
                  </p>
                )}

                {item.status === "error" && (
                  <p className="text-[10px] text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{item.errorMessage || "Error en la subida"}</span>
                  </p>
                )}
              </div>

              <button
                onClick={() =>
                  setUploadQueue((prev) => prev.filter((i) => i.id !== item.id))
                }
                className="p-1 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
