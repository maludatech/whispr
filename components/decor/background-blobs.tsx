export function BackgroundBlobs() {
  return (
    <>
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
    </>
  );
}
