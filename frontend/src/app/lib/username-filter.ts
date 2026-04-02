/**
 * Build a Strapi username filter that matches both decoded and URL-encoded versions.
 * Returns a filter object to spread inside a follower filter.
 *
 * For ASCII usernames: { username: { $eqi: "mrbeast" } }
 * For encoded usernames: { username: { $in: ["파타야피키누", "%ED%8C%8C..."] } }
 */
export function usernameOrFilter(username: string) {
  const decoded = decodeURIComponent(username).replace(/^@/, "");
  const encoded = encodeURIComponent(decoded);
  if (decoded === encoded) {
    return { username: { $eqi: decoded } };
  }
  // Use $in to match either version within the username field
  return { username: { $in: [decoded, encoded] } };
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
