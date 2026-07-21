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

type MessageCardProps = {
  id: string;
  username: string;
  type: "text" | "image" | "audio" | "video";
  content: string | null;
  mediaUrl: string | null;
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

function MediaBody({
  type,
  content,
  mediaUrl,
  full = false,
}: Pick<MessageCardProps, "type" | "content" | "mediaUrl"> & { full?: boolean }) {
  if (type === "text") {
    return <p className={`text-balance ${full ? "text-base" : "text-sm"} text-foreground/90`}>{content}</p>;
  }
  if (type === "image" && mediaUrl) {
    return (
      <img
        src={mediaUrl}
        alt="Anonymous submission"
        className={`w-full rounded-2xl ${full ? "max-h-[70vh] object-contain" : "max-h-80 object-cover"}`}
      />
    );
  }
  if (type === "audio" && mediaUrl) {
    return <audio controls src={mediaUrl} className="w-full" />;
  }
  if (type === "video" && mediaUrl) {
    return (
      <video
        controls
        src={mediaUrl}
        className={`w-full rounded-2xl ${full ? "max-h-[70vh]" : "max-h-80 object-cover"}`}
      />
    );
  }
  return null;
}

export function MessageCard({ id, username, type, content, mediaUrl, topic, createdAt }: MessageCardProps) {
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
            <span className={`rounded-full px-2.5 py-1 text-[10.5px] font-bold tracking-wide uppercase ${LABEL_STYLES[type]}`}>
              {LABELS[type]}
            </span>
            {topic && (
              <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10.5px] font-medium text-muted-foreground">
                {topic}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{formatDate(createdAt)}</span>
        </div>
        <MediaBody type={type} content={content} mediaUrl={mediaUrl} />
      </DialogTrigger>

      <DialogContent className="max-w-md sm:max-w-lg" showCloseButton>
        <div className="flex flex-col gap-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className={`rounded-full px-2.5 py-1 text-[10.5px] font-bold tracking-wide uppercase ${LABEL_STYLES[type]}`}>
                {LABELS[type]}
              </span>
              {topic && (
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10.5px] font-medium text-muted-foreground">
                  {topic}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{formatDate(createdAt)}</span>
          </div>

          <MediaBody type={type} content={content} mediaUrl={mediaUrl} full />

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
