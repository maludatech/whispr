import { MessageSquareText } from "lucide-react";

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

export function MessageCard({ type, content, mediaUrl, createdAt }: MessageCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-card/70 p-5 backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-medium capitalize">
          {type}
        </span>
        <span>{formatDate(createdAt)}</span>
      </div>

      {type === "text" && (
        <p className="flex items-start gap-2 text-sm text-balance">
          <MessageSquareText className="mt-0.5 size-4 shrink-0 text-fuchsia-400" />
          {content}
        </p>
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
