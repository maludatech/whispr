"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getLatestMessageInfo } from "@/app/(dashboard)/dashboard/actions";

const POLL_INTERVAL_MS = 10_000;

export function DashboardPoller({
  count,
  latestId,
}: {
  count: number;
  latestId: string | null;
}) {
  const router = useRouter();
  const baseline = useRef({ count, latestId });

  useEffect(() => {
    baseline.current = { count, latestId };
  }, [count, latestId]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const latest = await getLatestMessageInfo();
      const changed =
        latest.count !== baseline.current.count || latest.latestId !== baseline.current.latestId;
      if (!changed) return;

      if (latest.count > baseline.current.count) {
        toast.success("New whisper received! 👀");
      }
      baseline.current = latest;
      router.refresh();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [router]);

  return null;
}
