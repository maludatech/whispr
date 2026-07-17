"use client";

import { useActionState } from "react";
import { MailCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/auth/submit-button";
import {
  requestPasswordReset,
  type ForgotPasswordState,
} from "@/app/(auth)/forgot-password/actions";

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState<ForgotPasswordState, FormData>(
    requestPasswordReset,
    undefined,
  );

  if (state && "status" in state && state.status === "sent") {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-linear-to-r from-violet-500 via-fuchsia-500 to-amber-400">
          <MailCheck className="size-7 text-white" />
        </span>
        <h2 className="text-lg font-bold">Check your email</h2>
        <p className="text-sm text-muted-foreground">
          If that email is registered, a reset link is on its way.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          className="h-11 rounded-xl"
        />
        {state && "errors" in state && state.errors?.email && (
          <p className="text-xs text-destructive">{state.errors.email[0]}</p>
        )}
      </div>

      <SubmitButton>Send reset link</SubmitButton>
    </form>
  );
}
