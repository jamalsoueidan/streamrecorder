export function generateAvatarUrl(url?: string, fullUrl: boolean = false) {
  return (
    (fullUrl ? process.env.NEXT_PUBLIC_BASE_URL : "") +
    `/avatar/${url?.split("/").pop()}`
  );
}
