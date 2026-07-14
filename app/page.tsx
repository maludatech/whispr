import Link from "next/link";
import { MessageSquareText, Image as ImageIcon, Mic, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackgroundBlobs } from "@/components/decor/background-blobs";

const formats = [
  { icon: MessageSquareText, label: "Text" },
  { icon: ImageIcon, label: "Images" },
  { icon: Mic, label: "Voice" },
  { icon: Video, label: "Video" },
];

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-1 flex-col items-center justify-center overflow-hidden px-4 py-20 text-center">
      <BackgroundBlobs />

      <div className="relative flex max-w-lg flex-col items-center gap-7">
        <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-foreground/70 uppercase backdrop-blur-sm">
          Anonymous · Multimedia · No names attached
        </span>

        <h1 className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-amber-300 bg-clip-text text-6xl font-extrabold tracking-tight text-transparent sm:text-7xl">
          whispr
        </h1>

        <p className="max-w-md text-xl text-balance text-foreground/80">
          Get honest anonymous texts, pics, voice notes, and videos on your
          own personal link. 👀
        </p>

        <div className="flex items-center gap-2">
          {formats.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-foreground/70"
            >
              <Icon className="size-3.5" />
              {label}
            </span>
          ))}
        </div>

        <div className="mt-2 flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <Button
            render={<Link href="/register" />}
            nativeButton={false}
            className="h-13 flex-1 rounded-full bg-linear-to-r from-violet-500 via-fuchsia-500 to-amber-400 px-8 text-base font-semibold text-white shadow-lg shadow-fuchsia-500/30 hover:opacity-90"
          >
            Get your link
          </Button>
          <Button
            render={<Link href="/login" />}
            nativeButton={false}
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
