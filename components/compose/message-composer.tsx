"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Paperclip, Mic, Send, Sparkles, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AttachmentStrip, type PickedAttachment } from "@/components/compose/attachment-strip";
import { VoiceRecorder } from "@/components/compose/voice-recorder";
import { validateMediaFile, MAX_ATTACHMENTS, MAX_CONTENT_LENGTH } from "@/lib/validations/message";
import { uploadAttachment } from "@/lib/upload-client";
import { sendMessage, type SendMessageInput, type SendMessageState } from "@/app/[username]/actions";
import { cn } from "@/lib/utils";

const HEIC_BRANDS = ["heic", "heix", "hevc", "hevx", "heim", "heis", "hevm", "hevs", "mif1", "msf1"];

async function isHeic(file: File): Promise<boolean> {
  const type = file.type.toLowerCase();
  if (type === "image/heic" || type === "image/heif") return true;
  if (/\.hei[cf]$/i.test(file.name)) return true;

  // Extension/mime can lie (some transfer tools relabel HEIC as .jpg without
  // re-encoding), so also sniff the ISOBMFF `ftyp` box for a HEIC/HEIF brand.
  try {
    const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    if (header.length < 12) return false;
    const boxType = String.fromCharCode(...header.slice(4, 8));
    if (boxType !== "ftyp") return false;
    const brand = String.fromCharCode(...header.slice(8, 12)).trim().toLowerCase();
    return HEIC_BRANDS.includes(brand);
  } catch {
    return false;
  }
}

async function toJpegIfHeic(file: File): Promise<File> {
  if (!(await isHeic(file))) return file;
  const heic2any = (await import("heic2any")).default;
  const result = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.85 });
  const converted = Array.isArray(result) ? result[0] : result;
  return new File([converted], file.name.replace(/\.hei[cf]$/i, ".jpg") || "photo.jpg", {
    type: "image/jpeg",
  });
}

export function MessageComposer({ username }: { username: string }) {
  const [resetKey, setResetKey] = useState(0);
  return (
    <ComposerBody
      key={resetKey}
      username={username}
      onSendAnother={() => setResetKey((k) => k + 1)}
    />
  );
}

function ComposerBody({
  username,
  onSendAnother,
}: {
  username: string;
  onSendAnother: () => void;
}) {
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<PickedAttachment[]>([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [micOpen, setMicOpen] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [state, dispatch, isPending] = useActionState<SendMessageState, SendMessageInput>(
    sendMessage,
    undefined,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const reportError = (message: string) => {
    setLocalError(message);
    toast.error(message);
  };

  useEffect(() => {
    if (state?.status === "error") toast.error(state.message);
  }, [state]);

  if (state?.status === "success") {
    return (
      <div className="relative flex flex-col items-center gap-4 py-6 text-center">
        <span className="absolute top-2 left-[15%] size-2 rounded-xs bg-amber-300" style={{ animation: "whispr-float 4s ease-in-out infinite" }} />
        <span className="absolute top-10 right-[16%] size-1.5 rounded-full bg-fuchsia-300" style={{ animation: "whispr-float 5s ease-in-out infinite reverse" }} />
        <span className="absolute bottom-6 left-[20%] size-1.5 rounded-xs bg-violet-300" style={{ animation: "whispr-float 4.5s ease-in-out infinite" }} />
        <span className="flex size-16 items-center justify-center rounded-full bg-linear-to-br from-violet-500 via-fuchsia-500 to-amber-400 shadow-lg shadow-fuchsia-500/40">
          <Sparkles className="size-7 text-white" />
        </span>
        <div>
          <h2 className="text-xl font-bold">Sent 👀</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            @{username}
            {" "}has no idea it was you.
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-full border-white/20 bg-white/5"
          onClick={onSendAnother}
        >
          Send another
        </Button>
      </div>
    );
  }

  const handlePickFiles = async (fileList: FileList | null) => {
    if (!fileList) return;
    const remaining = MAX_ATTACHMENTS - attachments.length;
    const picked = Array.from(fileList).slice(0, remaining);

    const heicFlags = await Promise.all(picked.map(isHeic));
    const hasHeic = heicFlags.some(Boolean);
    if (hasHeic) setConverting(true);

    for (const original of picked) {
      let file: File;
      try {
        file = await toJpegIfHeic(original);
      } catch {
        reportError(`Couldn't process ${original.name || "that photo"} — try a different format`);
        continue;
      }

      const type = file.type.startsWith("video/") ? "video" : "image";
      const error = validateMediaFile(type, file);
      if (error) {
        reportError(error);
        continue;
      }
      setAttachments((prev) => [...prev, { id: crypto.randomUUID(), type, file }]);
    }

    if (hasHeic) setConverting(false);
    if (fileList.length > remaining) {
      reportError(`You can attach up to ${MAX_ATTACHMENTS} files`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    try {
      setUploading(true);
      const uploaded = await Promise.all([
        ...attachments.map((a) => uploadAttachment(username, a.type, a.file)),
        ...(audioFile ? [uploadAttachment(username, "audio", audioFile)] : []),
      ]);
      setUploading(false);
      dispatch({ username, content, attachments: uploaded });
    } catch (err) {
      setUploading(false);
      reportError(err instanceof Error ? err.message : "Upload failed, try again");
    }
  };

  const canSend = content.trim().length > 0 || attachments.length > 0 || !!audioFile;
  const busy = uploading || isPending;

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-3", busy && "opacity-70")}
      noValidate
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handlePickFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {micOpen ? (
        <div className="relative rounded-2xl border border-white/15 bg-white/4">
          <button
            type="button"
            onClick={() => setMicOpen(false)}
            className="absolute top-2.5 right-2.5 z-10 flex size-7 items-center justify-center rounded-full bg-black/50 text-white"
          >
            <X className="size-3.5" />
          </button>
          <VoiceRecorder
            file={audioFile}
            onFileChange={(file) => {
              setAudioFile(file);
              if (file) setMicOpen(false);
            }}
            onError={reportError}
          />
        </div>
      ) : (
        <>
          <AttachmentStrip
            attachments={attachments}
            audioFile={audioFile}
            onRemove={(id) => setAttachments((prev) => prev.filter((a) => a.id !== id))}
            onRemoveAudio={() => setAudioFile(null)}
          />
          {converting && (
            <span className="-mt-2 flex items-center gap-1.5 self-start text-xs text-muted-foreground">
              <Loader2 className="size-3 animate-spin" />
              Converting photo…
            </span>
          )}
          {attachments.length > 0 && (
            <span className="-mt-2 self-end text-xs text-muted-foreground">
              {attachments.length}/{MAX_ATTACHMENTS} attached
            </span>
          )}

          <div className="space-y-1.5">
            <textarea
              name="content"
              rows={3}
              maxLength={MAX_CONTENT_LENGTH}
              placeholder={`Say something anonymous to @${username}...`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full resize-none rounded-2xl border border-white/15 bg-input/30 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span />
              <span>{content.length}/{MAX_CONTENT_LENGTH}</span>
            </div>
          </div>
        </>
      )}

      {(localError || state?.status === "error") && (
        <p className="text-center text-sm text-destructive">
          {localError ?? (state?.status === "error" ? state.message : "")}
        </p>
      )}

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={attachments.length >= MAX_ATTACHMENTS || converting || busy}
          onClick={() => {
            setLocalError(null);
            fileInputRef.current?.click();
          }}
          className="size-12.5 shrink-0 rounded-full border-white/15 bg-white/5"
        >
          <Paperclip className="size-4.5" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={converting || busy}
          onClick={() => {
            setLocalError(null);
            setMicOpen(true);
          }}
          className={cn(
            "size-12.5 shrink-0 rounded-full border-white/15 bg-white/5",
            audioFile && "border-amber-400/50 text-amber-300",
          )}
        >
          <Mic className="size-4.5" />
        </Button>
        <Button
          type="submit"
          disabled={!canSend || busy || micOpen || converting}
          className="h-12.5 flex-1 gap-2 rounded-full border border-white/10 bg-white/5 text-base font-semibold text-muted-foreground shadow-none transition-transform enabled:border-transparent enabled:bg-linear-to-r enabled:from-violet-500 enabled:via-fuchsia-500 enabled:to-amber-400 enabled:text-white enabled:shadow-lg enabled:shadow-fuchsia-500/30 enabled:hover:scale-[1.01] enabled:hover:opacity-90"
        >
          {busy ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {uploading ? "Uploading…" : "Sending…"}
            </>
          ) : (
            <>
              <Send className="size-4" />
              Send
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
