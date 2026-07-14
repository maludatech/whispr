"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyLinkButton({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      onClick={async () => {
        await navigator.clipboard.writeText(
          `${window.location.origin}/${username}`,
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="h-11 rounded-full bg-linear-to-r from-violet-500 via-fuchsia-500 to-amber-400 px-6 font-semibold text-white hover:opacity-90"
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? "Copied!" : "Copy your link"}
    </Button>
  );
}
