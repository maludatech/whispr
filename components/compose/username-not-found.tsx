import Link from "next/link";
import { Button } from "@/components/ui/button";

export function UsernameNotFound({ username }: { username: string }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <span className="text-6xl font-extrabold tracking-tight text-foreground/25">
        ¿
      </span>
      <div>
        <h1 className="text-xl font-bold text-balance">
          @{username} isn&apos;t a whispr
        </h1>
        <p className="mt-2 max-w-65 text-sm text-balance text-muted-foreground">
          This link doesn&apos;t exist — double-check the username, or maybe
          they haven&apos;t claimed it yet.
        </p>
      </div>
      <Button
        render={<Link href="/register" />}
        nativeButton={false}
        className="h-11 rounded-full bg-linear-to-r from-violet-500 via-fuchsia-500 to-amber-400 px-6 font-semibold text-white hover:opacity-90"
      >
        Get your own whispr link
      </Button>
    </div>
  );
}
