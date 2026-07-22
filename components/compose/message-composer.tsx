"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Paperclip, Mic, Send, Sparkles, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AttachmentStrip, type PickedAttachment } from "@/components/compose/attachment-strip";
import { VoiceRecorder } from "@/components/compose/voice-recorder";
import { validateMediaFile, MAX_ATTACHMENTS, MAX_CONTENT_LENGTH } from "@/lib/validations/message";
import { sendMessage, type SendMessageState } from "@/app/[username]/actions";
import { cn } from "@/lib/utils";

function syncFileInput(ref: React.RefObject<HTMLInputElement | null>, files: File[]) {
  if (!ref.current) return;
  const dt = new DataTransfer();
  files.forEach((file) => dt.items.add(file));
  ref.current.files = dt.files;
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

  const [state, formAction, isPending] = useActionState<SendMessageState, FormData>(
    sendMessage,
    undefined,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);
  const videosInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  useEffect(
    () => syncFileInput(imagesInputRef, attachments.filter((a) => a.type === "image").map((a) => a.file)),
    [attachments],
  );
  useEffect(
    () => syncFileInput(videosInputRef, attachments.filter((a) => a.type === "video").map((a) => a.file)),
    [attachments],
  );
  useEffect(() => syncFileInput(audioInputRef, audioFile ? [audioFile] : []), [audioFile]);

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

  const handlePickFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const remaining = MAX_ATTACHMENTS - attachments.length;
    const picked = Array.from(fileList).slice(0, remaining);

    for (const file of picked) {
      const type = file.type.startsWith("video/") ? "video" : "image";
      const error = validateMediaFile(type, file);
      if (error) {
        setLocalError(error);
        continue;
      }
      setAttachments((prev) => [...prev, { id: crypto.randomUUID(), type, file }]);
    }
    if (fileList.length > remaining) {
      setLocalError(`You can attach up to ${MAX_ATTACHMENTS} files`);
    }
  };

  const canSend = content.trim().length > 0 || attachments.length > 0 || !!audioFile;

  return (
    <form
      action={formAction}
      className={cn("flex flex-col gap-3", isPending && "opacity-70")}
      noValidate
    >
      <input type="hidden" name="username" value={username} />
      <input ref={imagesInputRef} type="file" name="images" className="hidden" />
      <input ref={videosInputRef} type="file" name="videos" className="hidden" />
      <input ref={audioInputRef} type="file" name="audio" className="hidden" />
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
            onError={setLocalError}
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
          disabled={!canSend || isPending || micOpen}
          className="h-12.5 flex-1 gap-2 rounded-full bg-linear-to-r from-violet-500 via-fuchsia-500 to-amber-400 text-base font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition-transform hover:scale-[1.01] hover:opacity-90 disabled:from-white/10 disabled:via-white/10 disabled:to-white/10 disabled:text-muted-foreground disabled:shadow-none disabled:hover:scale-100"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending…
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
