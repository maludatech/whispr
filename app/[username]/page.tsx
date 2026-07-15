import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { BackgroundBlobs } from "@/components/decor/background-blobs";
import { MessageComposer } from "@/components/compose/message-composer";
import { UsernameNotFound } from "@/components/compose/username-not-found";

export const metadata: Metadata = {
  robots: { index: false },
};

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    select: { username: true },
  });

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <BackgroundBlobs />

      {!user ? (
        <div className="relative w-full max-w-md">
          <UsernameNotFound username={username} />
        </div>
      ) : (
        <div className="relative w-full max-w-md">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold tracking-widest text-foreground/50 uppercase">
              Send an anonymous whisper to
            </p>
            <h1 className="mt-2 bg-linear-to-r from-violet-400 via-fuchsia-400 to-amber-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
              @{user.username}
            </h1>
          </div>

          <div className="rounded-3xl border border-white/15 bg-card/80 p-7 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-9">
            <MessageComposer username={user.username} />
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Whispr never stores who sent this. Not even we know. 🤐
          </p>
        </div>
      )}
    </main>
  );
}
