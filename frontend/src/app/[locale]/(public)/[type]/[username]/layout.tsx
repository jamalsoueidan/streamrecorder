import { isSupportedPlatform } from "@/app/lib/streaming-platforms";
import { notFound } from "next/navigation";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  // Unlisted platform types (clapper, tango, ...) are not publicly browsable.
  // Owner access lives under /my/[type], which is unaffected by this guard.
  if (!isSupportedPlatform(type)) notFound();
  return children;
}
