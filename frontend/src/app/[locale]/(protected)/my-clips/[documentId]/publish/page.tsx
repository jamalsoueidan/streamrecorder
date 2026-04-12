import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    documentId: string;
  }>;
}

// Redirect old /publish URL to /publish/tiktok for backward compat
export default async function PublishPage({ params }: PageProps) {
  const { documentId } = await params;
  redirect(`/my-clips/${documentId}/publish/tiktok`);
}
