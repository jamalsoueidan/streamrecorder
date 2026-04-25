import { createHmac, timingSafeEqual } from "crypto";

const SECRET = (() => {
  const v = process.env.VIEW_SESSION_SECRET;
  if (!v) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("VIEW_SESSION_SECRET is required in production");
    }
    return "dev-view-session-secret";
  }
  return v;
})();

function hmac(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

/**
 * Sign a short-lived view session. `subject` is userId or fingerprint.
 * Token shape: `<subject>.<exp>.<sig>` — all base64url-safe.
 */
export function signViewToken(subject: string, ttlSeconds: number): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const body = `${Buffer.from(subject).toString("base64url")}.${exp}`;
  return `${body}.${hmac(body)}`;
}

export function verifyViewToken(token: string | undefined): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [subEnc, expStr, sig] = parts;
  const body = `${subEnc}.${expStr}`;
  const expected = hmac(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return null;
  try {
    return Buffer.from(subEnc, "base64url").toString("utf8");
  } catch {
    return null;
  }
}
