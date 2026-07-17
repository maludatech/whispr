"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/auth/submit-button";
import { updateProfile, type ProfileState } from "@/app/(dashboard)/dashboard/settings/actions";

export function ProfileForm({ username, email }: { username: string; email: string }) {
  const [state, formAction] = useActionState<ProfileState, FormData>(updateProfile, undefined);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="username">Username</Label>
        <div className="flex h-11 items-center gap-1 rounded-xl border border-input bg-input/30 pl-3 has-focus-visible:border-ring has-focus-visible:ring-3 has-focus-visible:ring-ring/50">
          <span className="text-sm text-muted-foreground">whispr.app/</span>
          <Input
            id="username"
            name="username"
            defaultValue={username}
            required
            className="h-full border-0 bg-transparent px-0 focus-visible:ring-0"
          />
        </div>
        {state?.errors?.username && (
          <p className="text-xs text-destructive">{state.errors.username[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={email}
          required
          className="h-11 rounded-xl"
        />
        {state?.errors?.email && (
          <p className="text-xs text-destructive">{state.errors.email[0]}</p>
        )}
      </div>

      {state?.message && (
        <p className="text-center text-sm text-destructive">{state.message}</p>
      )}

      <SubmitButton>Save changes</SubmitButton>
      <p className="text-center text-xs text-muted-foreground">
        You&apos;ll be signed out to refresh your session after saving.
      </p>
    </form>
  );
}
