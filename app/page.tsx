import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-1 flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-32 size-144 rounded-full bg-violet-600/50 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 -right-40 size-144 rounded-full bg-fuchsia-500/40 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/4 size-120 rounded-full bg-amber-400/30 blur-[100px]"
      />

      <div className="relative flex max-w-lg flex-col items-center gap-7">
        <h1 className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-amber-300 bg-clip-text text-6xl font-extrabold tracking-tight text-transparent sm:text-7xl">
          whispr
        </h1>
        <p className="max-w-md text-xl text-balance text-foreground/80">
          Anonymous texts, pics, voice notes, and videos — sent straight to
          your personal link. No names attached. 👀
        </p>
        <div className="mt-2 flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <Button
            render={<Link href="/register" />}
            className="h-13 flex-1 rounded-full bg-linear-to-r from-violet-500 via-fuchsia-500 to-amber-400 px-8 text-base font-semibold text-white shadow-lg shadow-fuchsia-500/30 hover:opacity-90"
          >
            Get your link
          </Button>
          <Button
            render={<Link href="/login" />}
            variant="outline"
            className="h-13 flex-1 rounded-full border-white/20 bg-white/5 px-8 text-base font-semibold backdrop-blur-sm hover:bg-white/10"
          >
            Log in
          </Button>
        </div>
      </div>
    </main>
  );
}
