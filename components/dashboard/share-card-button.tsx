"use client";

import { useState } from "react";
import { ImageDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function captureVideoFrame(container: HTMLElement | null): string | null {
  const video = container?.querySelector("video");
  if (!video || video.readyState < 2) return null;

  try {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.85);
  } catch {
    return null;
  }
}

export function ShareCardButton({
  messageId,
  hasVideo,
  containerRef,
}: {
  messageId: string;
  hasVideo: boolean;
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const [pending, setPending] = useState(false);

  const handleShare = async () => {
    setPending(true);
    try {
      const frameDataUrl = hasVideo ? captureVideoFrame(containerRef.current) : null;

      const res = await fetch(`/api/share-card/${messageId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frameDataUrl }),
      });

      if (!res.ok) throw new Error("Couldn't generate the image");

      const blob = await res.blob();
      const file = new File([blob], "whispr-whisper.png", { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "whispr",
          text: "Send me anonymous whispers 👀",
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "whispr-whisper.png";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        toast.success("Image saved — share it to your Story!");
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      toast.error("Couldn't create the shareable image, try again");
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      variant="outline"
      disabled={pending}
      onClick={handleShare}
      className="w-full gap-2 rounded-full border-white/15"
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : <ImageDown className="size-4" />}
      Share as image
    </Button>
  );
}
