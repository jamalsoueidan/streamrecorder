// Payday "freeze" campaign: eligible FREE users get a hard 24h lockout with a
// subscribe-with-discount CTA. Computed server-side (un-bypassable) in the /my
// layout. Activated purely by env — set FREEZE_START to turn it on; leave it
// unset and the feature is completely inert.
//
//   FREEZE_START      ISO datetime, campaign window start (e.g. 2026-07-02T00:00:00Z)
//   FREEZE_HOURS      window length in hours (default 24)
//   FREEZE_MIN_AGE_DAYS  only lock accounts older than this (default 7)
//
// A fixed window (not per-user) so it needs no DB field / backend deploy.

export const FREEZE_DISCOUNT_CODE = "EXTRA20";

function config() {
  const startRaw = process.env.FREEZE_START;
  if (!startRaw) return null;
  const start = new Date(startRaw).getTime();
  if (Number.isNaN(start)) return null;
  const hours = Number(process.env.FREEZE_HOURS ?? 24);
  const minAgeDays = Number(process.env.FREEZE_MIN_AGE_DAYS ?? 7);
  // Fail safe: a non-numeric env var must NOT silently produce an unbounded
  // freeze (NaN end -> `now >= end` is always false -> window never closes).
  if (!Number.isFinite(hours) || hours <= 0) return null;
  if (!Number.isFinite(minAgeDays) || minAgeDays < 0) return null;
  return { start, end: start + hours * 3600_000, minAgeDays };
}

/**
 * Returns { endsAt } if this user must be frozen right now, else null.
 * `user` is the object from getUser().data (has `role.type` + `createdAt`).
 */
export function computeFreeze(user: any): { endsAt: number } | null {
  const cfg = config();
  if (!cfg) return null; // feature off

  // In this app "authenticated" IS the free role; every other role type
  // (premium / champion / admin / moderator / superadmin) is paid or staff and
  // is never frozen. Matches how the rest of the app gates free vs paid
  // (e.g. `user?.role?.type === "authenticated"`). Missing role = not frozen.
  const roleType: string | undefined = user?.role?.type;
  if (roleType !== "authenticated") return null;

  // account must be older than the min age
  const createdAt = user?.createdAt ? new Date(user.createdAt).getTime() : null;
  if (!createdAt || Number.isNaN(createdAt)) return null;
  const ageDays = (Date.now() - createdAt) / 86_400_000;
  if (ageDays < cfg.minAgeDays) return null;

  // only inside the campaign window
  const now = Date.now();
  if (now < cfg.start || now >= cfg.end) return null;

  return { endsAt: cfg.end };
}
