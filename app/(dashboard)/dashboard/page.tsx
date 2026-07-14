import { redirect } from "next/navigation";
import { Inbox } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { CopyLinkButton } from "@/components/dashboard/copy-link-button";
import { MessageCard } from "@/components/dashboard/message-card";
import { logout } from "./actions";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");
  const username = session.user.username;

  const messages = await prisma.message.findMany({
    where: { receiver: { username } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-8 px-4 py-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="text-2xl font-bold">@{username}</h1>
        </div>
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

      {messages.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-card/70 px-8 py-16 text-center backdrop-blur-xl">
          <span className="flex size-14 items-center justify-center rounded-full bg-linear-to-r from-violet-500 via-fuchsia-500 to-amber-400">
            <Inbox className="size-7 text-white" />
          </span>
          <div>
            <h2 className="text-lg font-bold">No whispers yet</h2>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Share your link so people can start sending you anonymous
              messages.
            </p>
          </div>
          <CopyLinkButton username={username} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <MessageCard
              key={message.id}
              type={message.type}
              content={message.content}
              mediaUrl={message.mediaUrl}
              createdAt={message.createdAt}
            />
          ))}
        </div>
      )}
    </main>
  );
}
