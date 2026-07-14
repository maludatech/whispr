"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/auth/submit-button";
import { register, type RegisterState } from "@/app/(auth)/register/actions";

export function RegisterForm() {
  const [state, formAction] = useActionState<RegisterState, FormData>(
    register,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="username">Username</Label>
        <div className="flex h-11 items-center gap-1 rounded-xl border border-input bg-input/30 pl-3 has-focus-visible:border-ring has-focus-visible:ring-3 has-focus-visible:ring-ring/50">
          <span className="text-sm text-muted-foreground">whispr.app/</span>
          <Input
            id="username"
            name="username"
            placeholder="yourname"
            autoComplete="username"
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
          placeholder="you@example.com"
          autoComplete="email"
          required
          className="h-11 rounded-xl"
        />
        {state?.errors?.email && (
          <p className="text-xs text-destructive">{state.errors.email[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
          className="h-11 rounded-xl"
        />
        {state?.errors?.password && (
          <p className="text-xs text-destructive">{state.errors.password[0]}</p>
        )}
      </div>

      {state?.message && (
        <p className="text-center text-sm text-destructive">{state.message}</p>
      )}

      <SubmitButton>Create your link</SubmitButton>
    </form>
  );
}
