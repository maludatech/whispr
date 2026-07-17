"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7l-5.5-7.2L4.5 22H1.4l8.2-9.3L1 2h7.2l5 6.6L18.9 2Zm-1.2 18h1.7L7.4 4H5.6l12.1 16Z" />
    </svg>
  );
}

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2a8.1 8.1 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.7.8-.8 1-.2.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.4 0-.5L9 8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.5 1.1 2.7c.1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  );
}

export function ShareRow({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);

  const text = `Someone just sent me an anonymous whisper 👀 Send yours:`;
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/${username}`
      : `https://whispr.app/${username}`;
  const shareText = `${text} ${url}`;

  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div className="flex items-center justify-center gap-2">
      {canNativeShare && (
        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-white/15"
          onClick={() => navigator.share({ text, url }).catch(() => {})}
        >
          <Share2 className="size-4" />
        </Button>
      )}
      <Button
        variant="outline"
        size="icon"
        className="rounded-full border-white/15"
        onClick={() =>
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
            "_blank",
          )
        }
      >
        <XIcon className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full border-white/15"
        onClick={() =>
          window.open(
            `https://wa.me/?text=${encodeURIComponent(shareText)}`,
            "_blank",
          )
        }
      >
        <WhatsAppIcon className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full border-white/15"
        onClick={async () => {
          await navigator.clipboard.writeText(shareText);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </Button>
    </div>
  );
}
