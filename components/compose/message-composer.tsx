"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  MessageSquareText,
  Image as ImageIcon,
  Mic,
  Video,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaDropzone } from "@/components/compose/media-dropzone";
import { VoiceRecorder } from "@/components/compose/voice-recorder";
import {
  sendTextMessage,
  sendMediaMessage,
  type SendMessageState,
} from "@/app/[username]/actions";
import { cn } from "@/lib/utils";

type MessageType = "text" | "image" | "audio" | "video";

const TYPES: { id: MessageType; label: string; icon: typeof MessageSquareText }[] = [
  { id: "text", label: "Text", icon: MessageSquareText },
  { id: "image", label: "Image", icon: ImageIcon },
  { id: "audio", label: "Voice", icon: Mic },
  { id: "video", label: "Video", icon: Video },
];

const TEXT_MAX = 500;

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
  const [type, setType] = useState<MessageType>("text");
  const [charCount, setCharCount] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const [textState, textFormAction, textPending] = useActionState<SendMessageState, FormData>(
    sendTextMessage,
    undefined,
  );
  const [imageState, imageFormAction, imagePending] = useActionState<SendMessageState, FormData>(
    sendMediaMessage.bind(null, "image"),
    undefined,
  );
  const [audioState, audioFormAction, audioPending] = useActionState<SendMessageState, FormData>(
    sendMediaMessage.bind(null, "audio"),
    undefined,
  );
  const [videoState, videoFormAction, videoPending] = useActionState<SendMessageState, FormData>(
    sendMediaMessage.bind(null, "video"),
    undefined,
  );

  const stateByType = { text: textState, image: imageState, audio: audioState, video: videoState };
  const pendingByType = { text: textPending, image: imagePending, audio: audioPending, video: videoPending };
  const activeState = stateByType[type];
  const isPending = pendingByType[type];

  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const syncFileInput = (ref: React.RefObject<HTMLInputElement | null>, file: File | null) => {
    if (!ref.current) return;
    const dt = new DataTransfer();
    if (file) dt.items.add(file);
    ref.current.files = dt.files;
  };

  useEffect(() => syncFileInput(imageInputRef, imageFile), [imageFile]);
  useEffect(() => syncFileInput(audioInputRef, audioFile), [audioFile]);
  useEffect(() => syncFileInput(videoInputRef, videoFile), [videoFile]);

  if (activeState?.status === "success") {
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
            @{username} has no idea it was you.
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

  const activeAction = { text: textFormAction, image: imageFormAction, audio: audioFormAction, video: videoFormAction }[type];
  const canSend =
    type === "text" ? true : type === "image" ? !!imageFile : type === "video" ? !!videoFile : !!audioFile;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-1.5 rounded-full border border-white/10 bg-white/5 p-1.5">
        {TYPES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setType(t.id);
              setLocalError(null);
            }}
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

      <form action={activeAction} className={cn("flex flex-col gap-3", isPending && "opacity-70")} noValidate>
        <input type="hidden" name="username" value={username} />

        {type === "text" && (
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
              <span />
              <span>{charCount}/{TEXT_MAX}</span>
            </div>
          </div>
        )}

        {type === "image" && (
          <>
            <input ref={imageInputRef} type="file" name="file" className="hidden" />
            <MediaDropzone type="image" file={imageFile} onFileChange={setImageFile} onError={setLocalError} />
          </>
        )}

        {type === "video" && (
          <>
            <input ref={videoInputRef} type="file" name="file" className="hidden" />
            <MediaDropzone type="video" file={videoFile} onFileChange={setVideoFile} onError={setLocalError} />
          </>
        )}

        {type === "audio" && (
          <>
            <input ref={audioInputRef} type="file" name="file" className="hidden" />
            <VoiceRecorder file={audioFile} onFileChange={setAudioFile} onError={setLocalError} />
          </>
        )}

        {(localError || activeState?.status === "error") && (
          <p className="text-center text-sm text-destructive">
            {localError ?? (activeState?.status === "error" ? activeState.message : "")}
          </p>
        )}

        <Button
          type="submit"
          disabled={!canSend || isPending}
          className="h-12.5 w-full rounded-full bg-linear-to-r from-violet-500 via-fuchsia-500 to-amber-400 text-base font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition-transform hover:scale-[1.01] hover:opacity-90 disabled:from-white/10 disabled:via-white/10 disabled:to-white/10 disabled:text-muted-foreground disabled:shadow-none disabled:hover:scale-100"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending…
            </>
          ) : (
            "Send whisper"
          )}
        </Button>
      </form>
    </div>
  );
}
