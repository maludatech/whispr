"use client";

import { useActionState, useState } from "react";
import {
  MessageSquareText,
  Image as ImageIcon,
  Mic,
  Video,
  UploadCloud,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/auth/submit-button";
import { sendTextMessage, type SendMessageState } from "@/app/[username]/actions";
import { cn } from "@/lib/utils";

type MessageType = "text" | "image" | "audio" | "video";

const TYPES: {
  id: MessageType;
  label: string;
  noun: string;
  icon: typeof MessageSquareText;
  limit: string;
  accept: string;
}[] = [
  { id: "text", label: "Text", noun: "text", icon: MessageSquareText, limit: "500 characters", accept: "" },
  { id: "image", label: "Image", noun: "an image", icon: ImageIcon, limit: "up to 10MB", accept: "image/*" },
  { id: "audio", label: "Voice", noun: "a voice note", icon: Mic, limit: "up to 20MB", accept: "audio/*" },
  { id: "video", label: "Video", noun: "a video", icon: Video, limit: "up to 50MB", accept: "video/*" },
];

const TEXT_MAX = 500;

export function MessageComposer({ username }: { username: string }) {
  const [type, setType] = useState<MessageType>("text");
  const [state, formAction] = useActionState<SendMessageState, FormData>(
    sendTextMessage,
    undefined,
  );
  const [charCount, setCharCount] = useState(0);
  const [sentAgainKey, setSentAgainKey] = useState(0);

  if (state?.status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-linear-to-r from-violet-500 via-fuchsia-500 to-amber-400">
          <Sparkles className="size-7 text-white" />
        </span>
        <div>
          <h2 className="text-xl font-bold">Sent 👀</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            @{username} has no idea it was you.
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-full border-white/20 bg-white/5"
          onClick={() => {
            setCharCount(0);
            setSentAgainKey((k) => k + 1);
          }}
        >
          Send another
        </Button>
      </div>
    );
  }

  const active = TYPES.find((t) => t.id === type)!;

  return (
    <div key={sentAgainKey} className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-1.5 rounded-full border border-white/10 bg-white/5 p-1.5">
        {TYPES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setType(t.id)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-full py-2 text-xs font-medium transition-colors",
              type === t.id
                ? "bg-linear-to-r from-violet-500 via-fuchsia-500 to-amber-400 text-white shadow-md shadow-fuchsia-500/20"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
            )}
          >
            <t.icon className="size-4" />
            {t.label}
          </button>
        ))}
      </div>

      {type === "text" ? (
        <form action={formAction} className="flex flex-col gap-3" noValidate>
          <input type="hidden" name="username" value={username} />
          <div className="space-y-1.5">
            <textarea
              name="content"
              rows={5}
              maxLength={TEXT_MAX}
              placeholder={`Say something anonymous to @${username}...`}
              onChange={(e) => setCharCount(e.target.value.length)}
              className="w-full resize-none rounded-2xl border border-white/15 bg-input/30 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{state?.status === "error" && (
                <span className="text-destructive">{state.message}</span>
              )}</span>
              <span>{charCount}/{TEXT_MAX}</span>
            </div>
          </div>
          <SubmitButton>Send whisper</SubmitButton>
        </form>
      ) : (
        <div className="flex flex-col gap-3">
          <label className="flex cursor-not-allowed flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-10 text-center opacity-60">
            <UploadCloud className="size-6 text-muted-foreground" />
            <span className="text-sm font-medium">
              Drop {active.noun} here, or click to browse
            </span>
            <span className="text-xs text-muted-foreground">{active.limit}</span>
            <input type="file" accept={active.accept} className="hidden" disabled />
          </label>
          <Button disabled className="h-11 w-full rounded-full">
            {active.label} whispers launch soon
          </Button>
        </div>
      )}
    </div>
  );
}
