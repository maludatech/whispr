import { prisma } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";
import { STORAGE_BUCKET } from "@/lib/validations/message";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` automatically when
// CRON_SECRET is set as an env var. This keeps the endpoint from being usable
// by anyone who finds the URL, without exposing any real account credentials.
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const [userCount, storageResult, authResult] = await Promise.all([
    prisma.user.count(),
    supabaseAdmin.storage.from(STORAGE_BUCKET).list("", { limit: 1 }),
    // Whispr's own data lives in Neon, not Supabase's Postgres — the only
    // thing this project ever asks Supabase's DB for is auth.users, via the
    // admin API. Storage-only traffic may not register as "activity" against
    // Supabase's own database for their inactivity scan, so ping this too.
    supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1 }),
  ]);

  return Response.json({
    ok: true,
    ts: Date.now(),
    db: { reachable: true, userCount },
    storage: { reachable: !storageResult.error, error: storageResult.error?.message ?? null },
    supabaseAuth: { reachable: !authResult.error, error: authResult.error?.message ?? null },
  });
}
