"use client";

import { X, Video as VideoIcon, Mic } from "lucide-react";
import { useObjectUrlRef } from "@/lib/use-object-url";

export type PickedAttachment = {
  id: string;
  type: "image" | "video";
  file: File;
};

function Thumb({ attachment, onRemove }: { attachment: PickedAttachment; onRemove: () => void }) {
  const imgRef = useObjectUrlRef<HTMLImageElement>(attachment.type === "image" ? attachment.file : null);
  const videoRef = useObjectUrlRef<HTMLVideoElement>(attachment.type === "video" ? attachment.file : null);

  return (
    <div className="relative size-18 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-black/40">
      {attachment.type === "image" ? (
        <img ref={imgRef} alt="Attached" className="size-full object-cover" />
      ) : (
        <>
          <video ref={videoRef} muted className="size-full object-cover" />
          <VideoIcon className="absolute right-1 bottom-1 size-3.5 text-white drop-shadow" />
        </>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/70 text-white"
      >
        <X className="size-3" />
      </button>
    </div>
  );
}

export function AttachmentStrip({
  attachments,
  audioFile,
  onRemove,
  onRemoveAudio,
}: {
  attachments: PickedAttachment[];
  audioFile: File | null;
  onRemove: (id: string) => void;
  onRemoveAudio: () => void;
}) {
  if (attachments.length === 0 && !audioFile) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {audioFile && (
        <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-white/5 py-2 pr-3 pl-2.5 text-xs font-medium text-amber-300">
          <Mic className="size-3.5" />
          Voice note
          <button type="button" onClick={onRemoveAudio} className="ml-0.5 text-muted-foreground hover:text-foreground">
            <X className="size-3.5" />
          </button>
        </div>
      )}
      {attachments.map((attachment) => (
        <Thumb key={attachment.id} attachment={attachment} onRemove={() => onRemove(attachment.id)} />
      ))}
    </div>
  );
}
