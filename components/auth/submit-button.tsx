"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-11 w-full rounded-full bg-linear-to-r from-violet-500 via-fuchsia-500 to-amber-400 text-base text-white font-semibold shadow-lg shadow-fuchsia-500/20 transition-transform hover:scale-[1.01] hover:opacity-90 disabled:opacity-70 disabled:hover:scale-100"
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : children}
    </Button>
  );
}
