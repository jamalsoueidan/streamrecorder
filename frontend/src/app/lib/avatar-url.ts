// Strapi only generates a `thumbnail_*` variant if the source image is
// larger than the thumbnail threshold (~245px). Many platforms hand us
// avatars below that size (e.g. Mixch), so blindly prefixing `thumbnail_`
// produces 404s.
//
// Accept either:
//   - the full avatar object (with `formats`) — preferred, uses
//     `formats.thumbnail.url` when present, falls back to `url`
//   - a bare URL string — works but uses the original (no prefix), so
//     no 404s but slightly larger payload
//
// Callers that have the full avatar object should pass it; callers that
// only have a URL stay backward compatible.

interface AvatarLike {
  url?: string | null;
  formats?: {
    thumbnail?: { url?: string | null } | null;
  } | null;
}

function pickFilename(input: string | AvatarLike): string | undefined {
  if (typeof input === "string") {
    return input.split("/").pop() || undefined;
  }
  const thumbUrl = input.formats?.thumbnail?.url;
  const target = thumbUrl ?? input.url ?? "";
  return target.split("/").pop() || undefined;
}

export function generateAvatarUrl(
  avatar: string | AvatarLike,
  fullUrl?: boolean,
): string;
export function generateAvatarUrl(
  avatar: undefined | null,
  fullUrl?: boolean,
): undefined;
export function generateAvatarUrl(
  avatar?: string | AvatarLike | null,
  fullUrl?: boolean,
): string | undefined;
export function generateAvatarUrl(
  avatar?: string | AvatarLike | null,
  fullUrl: boolean = false,
) {
  if (!avatar) return undefined;
  const filename = pickFilename(avatar);
  if (!filename) return undefined;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (baseUrl) {
    const host = new URL(baseUrl).hostname.replace(/^www\./, "");
    return `https://image.${host}/${filename}`;
  }
  return (fullUrl ? baseUrl : "") + `/avatar/${filename}`;
}
