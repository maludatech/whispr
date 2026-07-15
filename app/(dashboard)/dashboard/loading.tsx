function Shimmer({ className }: { className: string }) {
  return (
    <div
      className={`rounded-md bg-[linear-gradient(90deg,oklch(1_0_0/6%)_25%,oklch(1_0_0/14%)_37%,oklch(1_0_0/6%)_63%)] bg-[length:400%_100%] ${className}`}
      style={{ animation: "whispr-shimmer 1.6s ease-in-out infinite" }}
    />
  );
}

export default function DashboardLoading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-12">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Shimmer className="h-2.5 w-20 rounded-full" />
          <Shimmer className="h-5 w-32 rounded-full" />
        </div>
        <Shimmer className="h-9 w-20 rounded-full" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 rounded-3xl border border-white/8 bg-card/70 p-5">
          <Shimmer className="h-4.5 w-15 rounded-full" />
          <Shimmer className="h-3.5 w-full" />
          <Shimmer className="h-3.5 w-2/3" />
        </div>
        <div className="flex flex-col gap-3 rounded-3xl border border-white/8 bg-card/70 p-5">
          <Shimmer className="h-4.5 w-15 rounded-full" />
          <Shimmer className="h-40 w-full rounded-2xl" />
        </div>
        <div className="flex flex-col gap-3 rounded-3xl border border-white/8 bg-card/70 p-5">
          <Shimmer className="h-4.5 w-15 rounded-full" />
          <Shimmer className="h-3.5 w-full" />
        </div>
      </div>
    </main>
  );
}
