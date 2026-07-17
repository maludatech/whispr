import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <AuthShell
      eyebrow="reset your password"
      title="Choose a new password"
      subtitle="Make it something you haven't used before"
      footer={
        <>
          Back to{" "}
          <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
            Log in
          </Link>
        </>
      }
    >
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <p className="text-center text-sm text-destructive">
          This reset link is missing a token. Request a new one from the{" "}
          <Link href="/forgot-password" className="underline underline-offset-4">
            forgot password
          </Link>{" "}
          page.
        </p>
      )}
    </AuthShell>
  );
}
