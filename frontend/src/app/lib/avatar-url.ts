const MEDIA_PROXY = process.env.NEXT_PUBLIC_MEDIA_PROXY_HOST;

export function generateAvatarUrl(url: string, fullUrl?: boolean): string;
export function generateAvatarUrl(url: undefined | null, fullUrl?: boolean): undefined;
export function generateAvatarUrl(url?: string | null, fullUrl?: boolean): string | undefined;
export function generateAvatarUrl(url?: string | null, fullUrl: boolean = false) {
  if (!url) return undefined;
  if (MEDIA_PROXY) {
    const filename = url.split("/").pop();
    return `https://${MEDIA_PROXY}/streamavatars-nbg/thumbnail_${filename}`;
  }
  const filename = url.split("/").pop();
  return (
    (fullUrl ? process.env.NEXT_PUBLIC_BASE_URL : "") +
    `/avatar/${filename}`
  );
}
