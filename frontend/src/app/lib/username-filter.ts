/**
 * Build a Strapi filter for username that matches both decoded and URL-encoded versions.
 * Needed because some usernames are stored encoded in the DB (e.g. Korean characters).
 */
export function usernameFilter(username: string) {
  const decoded = decodeURIComponent(username).replace(/^@/, "");
  const encoded = encodeURIComponent(decoded);
  if (decoded === encoded) {
    // ASCII username — no encoding difference
    return { $eqi: decoded };
  }
  // Unicode username — search both
  return { $eqi: decoded, $or: undefined } as never;
}

/**
 * Build a $or filter for username matching both decoded and encoded versions.
 */
export function usernameOrFilter(username: string) {
  const decoded = decodeURIComponent(username).replace(/^@/, "");
  const encoded = encodeURIComponent(decoded);
  if (decoded === encoded) {
    return { username: { $eqi: decoded } };
  }
  return {
    $or: [
      { username: { $eqi: decoded } },
      { username: { $eqi: encoded } },
    ],
  };
}

/**
 * Decode a username for display purposes.
 */
export function decodeUsername(username: string): string {
  try {
    return decodeURIComponent(username);
  } catch {
    return username;
  }
}
