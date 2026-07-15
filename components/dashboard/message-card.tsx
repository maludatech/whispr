type MessageCardProps = {
  type: "text" | "image" | "audio" | "video";
  content: string | null;
  mediaUrl: string | null;
  createdAt: Date;
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);

const LABEL_STYLES: Record<MessageCardProps["type"], string> = {
  text: "text-fuchsia-300 bg-fuchsia-500/15",
  image: "text-violet-300 bg-violet-500/15",
  audio: "text-amber-300 bg-amber-500/15",
  video: "text-rose-300 bg-rose-500/15",
};

const LABELS: Record<MessageCardProps["type"], string> = {
  text: "Text",
  image: "Image",
  audio: "Voice",
  video: "Video",
};

export function MessageCard({ type, content, mediaUrl, createdAt }: MessageCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-card/75 p-5 backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`rounded-full px-2.5 py-1 text-[10.5px] font-bold tracking-wide uppercase ${LABEL_STYLES[type]}`}
        >
          {LABELS[type]}
        </span>
        <span className="text-xs text-muted-foreground">{formatDate(createdAt)}</span>
      </div>

      {type === "text" && (
        <p className="text-sm text-balance text-foreground/90">{content}</p>
      )}

      {type === "image" && mediaUrl && (
        <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
          <img
            src={mediaUrl}
            alt="Anonymous submission"
            className="max-h-80 w-full rounded-2xl object-cover"
          />
        </a>
      )}

      {type === "audio" && mediaUrl && (
        <audio controls src={mediaUrl} className="w-full" />
      )}

      {type === "video" && mediaUrl && (
        <video controls src={mediaUrl} className="max-h-80 w-full rounded-2xl" />
      )}
    </div>
  );
}
