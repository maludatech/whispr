import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="welcome back"
      title="Log in to Whispr"
      subtitle="See what people have been sending you"
      footer={
        <>
          New here?{" "}
          <Link href="/register" className="font-medium text-foreground underline underline-offset-4">
            Create your link
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
