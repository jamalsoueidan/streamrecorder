export function generateAvatarUrl(url: string, fullUrl?: boolean): string;
export function generateAvatarUrl(url: undefined | null, fullUrl?: boolean): undefined;
export function generateAvatarUrl(url?: string | null, fullUrl?: boolean): string | undefined;
export function generateAvatarUrl(url?: string | null, fullUrl: boolean = false) {
  if (!url) return undefined;
  const filename = url.split("/").pop();
  const location = url.includes("nbg1") ? "nbg1" : "";
  const query = location ? `?location=${location}` : "";
  return (
    (fullUrl ? process.env.NEXT_PUBLIC_BASE_URL : "") +
    `/avatar/${filename}${query}`
  );
}
