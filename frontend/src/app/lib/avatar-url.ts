export function generateAvatarUrl(url: string, fullUrl?: boolean): string;
export function generateAvatarUrl(
  url: undefined | null,
  fullUrl?: boolean,
): undefined;
export function generateAvatarUrl(
  url?: string | null,
  fullUrl?: boolean,
): string | undefined;
export function generateAvatarUrl(
  url?: string | null,
  fullUrl: boolean = false,
) {
  if (!url) return undefined;
  const filename = url.split("/").pop();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (baseUrl) {
    const host = new URL(baseUrl).hostname.replace(/^www\./, "");
    const hasThumb =
      filename?.endsWith(".png") ||
      filename?.endsWith(".jpg") ||
      filename?.endsWith(".jpeg");
    return `https://image.${host}/${hasThumb ? "thumbnail_" : ""}${filename}`;
  }
  return (fullUrl ? baseUrl : "") + `/avatar/${filename}`;
}
