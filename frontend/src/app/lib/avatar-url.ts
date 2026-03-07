export function generateAvatarUrl(url?: string, fullUrl: boolean = false) {
  const filename = url?.split("/").pop();
  const location = url?.includes("nbg1") ? "nbg1" : "";
  const query = location ? `?location=${location}` : "";
  return (
    (fullUrl ? process.env.NEXT_PUBLIC_BASE_URL : "") +
    `/avatar/${filename}${query}`
  );
}
