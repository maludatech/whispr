"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ShareLinkCard({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);

  const link =
    typeof window !== "undefined"
      ? `${window.location.origin}/${username}`
      : `/${username}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="rounded-3xl border border-white/15 bg-card/80 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl">
      <h2 className="text-lg font-bold">Share your link</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Anyone with this link can send you an anonymous whisper.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Input
          value={link}
          readOnly
          onFocus={(e) => e.currentTarget.select()}
          className="h-11 flex-1 rounded-xl font-mono text-xs sm:text-sm"
        />
        <Button
          onClick={handleCopy}
          className="h-11 shrink-0 gap-2 rounded-xl bg-linear-to-r from-violet-500 via-fuchsia-500 to-amber-400 px-5 font-semibold text-white hover:opacity-90"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
    </div>
  );
}
