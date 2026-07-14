export default function DashboardLoading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-8 px-4 py-12">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-3 w-20 animate-pulse rounded-full bg-white/10" />
          <div className="h-6 w-32 animate-pulse rounded-full bg-white/10" />
        </div>
        <div className="h-9 w-20 animate-pulse rounded-full bg-white/10" />
      </div>

      <div className="flex flex-col gap-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-3xl border border-white/10 bg-card/70"
          />
        ))}
      </div>
    </main>
  );
}
