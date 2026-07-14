import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { logout } from "./actions";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-8 px-4 py-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="text-2xl font-bold">@{session?.user?.username}</h1>
        </div>
        <form action={logout}>
          <Button
            type="submit"
            variant="outline"
            className="rounded-full border-white/15"
          >
            Log out
          </Button>
        </form>
      </div>

      <div className="rounded-3xl border border-white/10 bg-card/70 p-8 text-center text-muted-foreground backdrop-blur-xl">
        Your inbox is coming in Stage 7 — messages sent to whispr.app/
        {session?.user?.username} will show up here.
      </div>
    </main>
  );
}
