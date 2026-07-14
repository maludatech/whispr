import Link from "next/link";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-32 size-144 rounded-full bg-violet-600/50 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -right-40 size-144 rounded-full bg-fuchsia-500/40 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/4 size-120 rounded-full bg-amber-400/30 blur-[100px]"
      />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-block bg-linear-to-r from-violet-400 via-fuchsia-400 to-amber-300 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent"
          >
            whispr
          </Link>
          <p className="mt-2 text-xs font-semibold tracking-widest text-foreground/50 uppercase">
            {eyebrow}
          </p>
        </div>

        <div className="rounded-3xl border border-white/15 bg-card/80 p-7 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-9">
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-bold text-balance">{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground text-balance">
              {subtitle}
            </p>
          </div>

          {children}
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {footer}
        </p>
      </div>
    </main>
  );
}
