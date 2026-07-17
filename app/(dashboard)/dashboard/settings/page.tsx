import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { BackgroundBlobs } from "@/components/decor/background-blobs";
import { ProfileForm } from "@/components/settings/profile-form";
import { PasswordForm } from "@/components/settings/password-form";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { username: true, email: true },
  });
  if (!user) redirect("/login");

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundBlobs />

      <main className="relative mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-12">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>

        <div className="rounded-3xl border border-white/15 bg-card/80 p-7 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-9">
          <h1 className="mb-6 text-xl font-bold">Account</h1>
          <ProfileForm username={user.username} email={user.email} />
        </div>

        <div className="rounded-3xl border border-white/15 bg-card/80 p-7 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-9">
          <h1 className="mb-6 text-xl font-bold">Password</h1>
          <PasswordForm />
        </div>
      </main>
    </div>
  );
}
