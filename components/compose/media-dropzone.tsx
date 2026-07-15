"use client";

import { useEffect, useMemo, useState } from "react";
import { UploadCloud, X, Check } from "lucide-react";
import { MEDIA_LIMITS, validateMediaFile, type MediaType } from "@/lib/validations/message";
import { cn } from "@/lib/utils";

const NOUNS: Record<MediaType, string> = {
  image: "an image",
  audio: "a voice note",
  video: "a video",
};

export function MediaDropzone({
  type,
  file,
  onFileChange,
  onError,
}: {
  type: "image" | "video";
  file: File | null;
  onFileChange: (file: File | null) => void;
  onError: (message: string) => void;
}) {
  const [dragActive, setDragActive] = useState(false);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const accept = `${type}/*`;

  const handleFile = (candidate: File | undefined | null) => {
    if (!candidate) return;
    const error = validateMediaFile(type, candidate);
    if (error) {
      onError(error);
      return;
    }
    onFileChange(candidate);
  };

  if (file) {
    return (
      <div className="flex flex-col gap-3">
        <div className="relative h-50 overflow-hidden rounded-2xl border border-white/15 bg-black/40">
          {type === "image" ? (
            <img src={previewUrl!} alt="Attached" className="size-full object-cover" />
          ) : (
            <video src={previewUrl!} controls muted playsInline className="size-full object-cover" />
          )}
          <button
            type="button"
            onClick={() => onFileChange(null)}
            className="absolute top-2.5 right-2.5 flex size-7 items-center justify-center rounded-full bg-black/70 text-white"
          >
            <X className="size-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Check className="size-3.5 text-emerald-400" />
          {file.name} · {(file.size / (1024 * 1024)).toFixed(1)}MB of{" "}
          {MEDIA_LIMITS[type].label} max
        </div>
      </div>
    );
  }

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        handleFile(e.dataTransfer.files?.[0]);
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-4 py-10 text-center transition-colors",
        dragActive
          ? "border-fuchsia-400 bg-fuchsia-500/10"
          : "border-white/20 bg-white/5 hover:bg-white/8",
      )}
    >
      <UploadCloud className="size-6 text-muted-foreground" />
      <span className="text-sm font-medium">
        Drop {NOUNS[type]} here, or click to browse
      </span>
      <span className="text-xs text-muted-foreground">
        up to {MEDIA_LIMITS[type].label}
      </span>
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </label>
  );
}
