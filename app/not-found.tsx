import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BackgroundBlobs } from "@/components/decor/background-blobs";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-1 flex-col items-center justify-center overflow-hidden px-4 text-center">
      <BackgroundBlobs />

      <div className="relative flex max-w-sm flex-col items-center gap-5">
        <h1 className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-amber-300 bg-clip-text text-7xl font-extrabold tracking-tight text-transparent">
          404
        </h1>
        <p className="text-lg text-foreground/80">
          This whispr link doesn&apos;t exist — or it&apos;s gone quiet.
        </p>
        <Button
          render={<Link href="/" />}
          nativeButton={false}
          className="h-11 rounded-full bg-linear-to-r from-violet-500 via-fuchsia-500 to-amber-400 px-6 font-semibold text-white hover:opacity-90"
        >
          Back to whispr
        </Button>
      </div>
    </main>
  );
}
