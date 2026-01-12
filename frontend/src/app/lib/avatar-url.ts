export function generateAvatarUrl(url?: string) {
  return `/avatar/${url?.split("/").pop()}`;
}
