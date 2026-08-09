"use client";

import { useEffect } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type LightboxItem = { id: string; type: "image" | "video"; mediaUrl: string };

export function MediaLightbox({
  items,
  index,
  onIndexChange,
  onClose,
}: {
  items: LightboxItem[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const open = index !== null;
  const current = index !== null ? items[index] : null;
  const hasPrev = index !== null && index > 0;
  const hasNext = index !== null && index < items.length - 1;

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && hasNext && index !== null) onIndexChange(index + 1);
      if (e.key === "ArrowLeft" && hasPrev && index !== null) onIndexChange(index - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, index, hasPrev, hasNext, onIndexChange]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-100 bg-black/95 duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup
          className="fixed top-1/2 left-1/2 z-100 flex h-[92vh] w-[96vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center outline-none duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
        >
          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute top-2 right-2 z-10 flex size-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
          >
            <X className="size-5" />
          </DialogPrimitive.Close>

          {current?.type === "image" ? (
            <img
              src={current.mediaUrl}
              alt="Anonymous submission"
              className="max-h-[88vh] max-w-full rounded-lg object-contain"
            />
          ) : current ? (
            <video
              src={current.mediaUrl}
              controls
              autoPlay
              playsInline
              className="max-h-[88vh] max-w-full rounded-lg"
            />
          ) : null}

          {items.length > 1 && index !== null && (
            <>
              {hasPrev && (
                <button
                  type="button"
                  onClick={() => onIndexChange(index - 1)}
                  aria-label="Previous"
                  className="absolute top-1/2 left-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                >
                  <ChevronLeft className="size-5" />
                </button>
              )}
              {hasNext && (
                <button
                  type="button"
                  onClick={() => onIndexChange(index + 1)}
                  aria-label="Next"
                  className="absolute top-1/2 right-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                >
                  <ChevronRight className="size-5" />
                </button>
              )}
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white">
                {index + 1} / {items.length}
              </span>
            </>
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
