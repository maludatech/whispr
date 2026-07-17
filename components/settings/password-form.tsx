"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/auth/submit-button";
import { changePassword, type PasswordState } from "@/app/(dashboard)/dashboard/settings/actions";

export function PasswordForm() {
  const [state, formAction] = useActionState<PasswordState, FormData>(changePassword, undefined);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="currentPassword">Current password</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          className="h-11 rounded-xl"
        />
        {state?.errors?.currentPassword && (
          <p className="text-xs text-destructive">{state.errors.currentPassword[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="newPassword">New password</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          className="h-11 rounded-xl"
        />
        {state?.errors?.newPassword && (
          <p className="text-xs text-destructive">{state.errors.newPassword[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
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

      <SubmitButton>Update password</SubmitButton>
    </form>
  );
}
