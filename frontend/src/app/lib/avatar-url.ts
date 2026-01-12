export function generateAvatarUrl(
  url?: string,
  fullUrl: boolean = false
): string {
  return (
    (fullUrl ? "https://www.livestreamrecorder.com" : "") +
    `/avatar/${url?.split("/").pop()}`
  );
}
