"use client";

import { useActionState } from "react";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/auth/submit-button";
import { resetPassword, type ResetPasswordState } from "@/app/(auth)/reset-password/actions";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction] = useActionState<ResetPasswordState, FormData>(
    resetPassword,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="token" value={token} />

      <div className="space-y-1.5">
        <Label htmlFor="password">New password</Label>
        <PasswordInput
          id="password"
          name="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
          className="h-11 rounded-xl"
        />
        {state?.errors?.password && (
          <p className="text-xs text-destructive">{state.errors.password[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          autoComplete="new-password"
          required
          className="h-11 rounded-xl"
        />
        {state?.errors?.confirmPassword && (
          <p className="text-xs text-destructive">{state.errors.confirmPassword[0]}</p>
        )}
      </div>

      {state?.message && (
        <p className="text-center text-sm text-destructive">{state.message}</p>
      )}

      <SubmitButton>Reset password</SubmitButton>
    </form>
  );
}
