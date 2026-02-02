import { getRandomClips } from "@/app/actions/clip";
import { ClipsViewer } from "./clips-viewer";

export default async function ShortsPage() {
  const initialClips = await getRandomClips(3);

  return <ClipsViewer initialClips={initialClips as any} />;
}
