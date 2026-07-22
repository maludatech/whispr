import { redirect } from "next/navigation";
import Link from "next/link";
import { Inbox, Settings } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getSignedUrl } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { ShareLinkCard } from "@/components/dashboard/share-link-card";
import { MessageCard } from "@/components/dashboard/message-card";
import { BackgroundBlobs } from "@/components/decor/background-blobs";
import { logout } from "./actions";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");
  const username = session.user.username;

  const messages = await prisma.message.findMany({
    where: { receiver: { username } },
    orderBy: { createdAt: "desc" },
    include: { attachments: true },
  });

  const resolvedMessages = await Promise.all(
    messages.map(async (message) => ({
      ...message,
      attachments: await Promise.all(
        message.attachments.map(async (attachment) => ({
          ...attachment,
          mediaUrl: (await getSignedUrl(attachment.mediaUrl)) ?? attachment.mediaUrl,
        })),
      ),
    })),
  );

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundBlobs />

      <main className="relative mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-12">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back</p>
            <h1 className="text-2xl font-bold">@{username}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              render={<Link href="/dashboard/settings" />}
              nativeButton={false}
              variant="outline"
              size="icon"
              className="rounded-full border-white/15"
            >
              <Settings className="size-4" />
            </Button>
            <form action={logout}>
              <Button
                type="submit"
                variant="outline"
                className="rounded-full border-white/15"
              >
                Log out
              </Button>
            </form>
          </div>
        </div>

        <ShareLinkCard username={username} />

        {resolvedMessages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-3xl border border-white/12 bg-card/60 px-8 py-16 text-center backdrop-blur-xl">
            <span className="flex size-16 items-center justify-center rounded-full bg-linear-to-br from-violet-500 via-fuchsia-500 to-amber-400 shadow-lg shadow-fuchsia-500/40">
              <Inbox className="size-7 text-white" />
            </span>
            <div>
              <h2 className="text-lg font-bold">No whispers yet</h2>
              <p className="mt-1.5 max-w-58 text-sm text-balance text-muted-foreground">
                Share your link so people can start sending you anonymous
                texts, pics, voice notes & videos.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {resolvedMessages.map((message) => (
              <MessageCard
                key={message.id}
                id={message.id}
                username={username}
                content={message.content}
                attachments={message.attachments}
                topic={message.topic}
                createdAt={message.createdAt}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
