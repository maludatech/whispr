export function BackgroundBlobs() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 15% 5%, oklch(0.55 0.2 302 / 45%), transparent 42%), radial-gradient(circle at 100% 25%, oklch(0.6 0.24 340 / 35%), transparent 48%), radial-gradient(circle at 25% 100%, oklch(0.75 0.18 60 / 25%), transparent 42%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0 / 5%) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 5%) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(ellipse at 50% 20%, black, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-16 -left-8 size-44 rounded-full bg-violet-500/40 blur-3xl"
        style={{ animation: "whispr-float 9s ease-in-out infinite" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-28 -right-10 size-52 rounded-full bg-fuchsia-500/30 blur-3xl"
        style={{ animation: "whispr-float 11s ease-in-out infinite reverse" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-6 left-2/5 size-40 rounded-full bg-amber-400/25 blur-3xl"
        style={{ animation: "whispr-float 13s ease-in-out infinite" }}
      />
    </>
  );
}
