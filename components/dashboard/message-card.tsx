"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ShareRow } from "@/components/dashboard/share-row";
import { deleteMessage } from "@/app/(dashboard)/dashboard/actions";

type AttachmentType = "image" | "audio" | "video";

type Attachment = {
  id: string;
  type: AttachmentType;
  mediaUrl: string;
};

type MessageCardProps = {
  id: string;
  username: string;
  content: string | null;
  attachments: Attachment[];
  topic: string | null;
  createdAt: Date;
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);

const LABEL_STYLES: Record<AttachmentType | "text", string> = {
  text: "text-fuchsia-300 bg-fuchsia-500/15",
  image: "text-violet-300 bg-violet-500/15",
  audio: "text-amber-300 bg-amber-500/15",
  video: "text-rose-300 bg-rose-500/15",
};

const LABELS: Record<AttachmentType | "text", string> = {
  text: "Text",
  image: "Image",
  audio: "Voice",
  video: "Video",
};

function TypeBadges({ content, attachments }: Pick<MessageCardProps, "content" | "attachments">) {
  const types: (AttachmentType | "text")[] = [];
  if (content) types.push("text");
  for (const attachment of attachments) {
    if (!types.includes(attachment.type)) types.push(attachment.type);
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {types.map((type) => (
        <span
          key={type}
          className={`rounded-full px-2.5 py-1 text-[10.5px] font-bold tracking-wide uppercase ${LABEL_STYLES[type]}`}
        >
          {LABELS[type]}
        </span>
      ))}
    </div>
  );
}

const MAX_GRID_TILES = 4;

function VisualGrid({ items, full }: { items: Attachment[]; full: boolean }) {
  if (items.length === 0) return null;

  if (items.length === 1) {
    const item = items[0];
    return item.type === "image" ? (
      <img
        src={item.mediaUrl}
        alt="Anonymous submission"
        className={`w-full rounded-2xl ${full ? "max-h-[70vh] object-contain" : "max-h-80 object-cover"}`}
      />
    ) : (
      <video
        controls
        src={item.mediaUrl}
        className={`w-full rounded-2xl ${full ? "max-h-[70vh]" : "max-h-80 object-cover"}`}
      />
    );
  }

  const tiles = items.slice(0, MAX_GRID_TILES);
  const overflowCount = items.length - MAX_GRID_TILES;

  return (
    <div className="grid grid-cols-2 gap-1.5">
      {tiles.map((item, index) => {
        const isLastTile = index === tiles.length - 1;
        const showOverflow = isLastTile && overflowCount > 0;
        return (
          <div key={item.id} className="relative aspect-square overflow-hidden rounded-xl bg-black/40">
            {item.type === "image" ? (
              <img src={item.mediaUrl} alt="Anonymous submission" className="size-full object-cover" />
            ) : (
              <video src={item.mediaUrl} muted className="size-full object-cover" />
            )}
            {item.type === "video" && !showOverflow && (
              <span className="absolute right-1.5 bottom-1.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                Video
              </span>
            )}
            {showOverflow && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-lg font-bold text-white">
                +{overflowCount}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MessageBody({
  content,
  attachments,
  full = false,
}: Pick<MessageCardProps, "content" | "attachments"> & { full?: boolean }) {
  const visual = attachments.filter((a) => a.type === "image" || a.type === "video");
  const audio = attachments.filter((a) => a.type === "audio");

  return (
    <div className="flex flex-col gap-3">
      {content && (
        <p className={`text-balance ${full ? "text-base" : "text-sm"} text-foreground/90`}>
          {content}
        </p>
      )}
      <VisualGrid items={visual} full={full} />
      {audio.map((attachment) => (
        <audio key={attachment.id} controls src={attachment.mediaUrl} className="w-full" />
      ))}
    </div>
  );
}

export function MessageCard({ id, username, content, attachments, topic, createdAt }: MessageCardProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteMessage(id);
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="w-full rounded-3xl border border-white/10 bg-card/75 p-5 text-left backdrop-blur-xl transition-colors hover:border-white/20"
          />
        }
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TypeBadges content={content} attachments={attachments} />
            {topic && (
              <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10.5px] font-medium text-muted-foreground">
                {topic}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{formatDate(createdAt)}</span>
        </div>
        <MessageBody content={content} attachments={attachments} />
      </DialogTrigger>

      <DialogContent className="max-w-md sm:max-w-lg" showCloseButton>
        <div className="flex flex-col gap-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <TypeBadges content={content} attachments={attachments} />
              {topic && (
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10.5px] font-medium text-muted-foreground">
                  {topic}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{formatDate(createdAt)}</span>
          </div>

          <MessageBody content={content} attachments={attachments} full />

          <ShareRow username={username} />

          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="outline"
                  disabled={pending}
                  className="w-full gap-2 rounded-full border-destructive/30 text-destructive hover:bg-destructive/10"
                />
              }
            >
              {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              Delete whisper
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this whisper?</AlertDialogTitle>
                <AlertDialogDescription>
                  This can&apos;t be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-white hover:bg-destructive/90"
                  onClick={handleDelete}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}
