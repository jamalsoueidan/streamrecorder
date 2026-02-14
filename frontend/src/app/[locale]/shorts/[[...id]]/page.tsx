import { getClipById, getRandomClips } from "@/app/actions/clip";
import { generateProfileUrl } from "@/app/lib/profile-url";
import { Metadata } from "next";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ClipsViewer } from "./clips-viewer";

interface Props {
  params: Promise<{ id?: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const clipId = id?.[0];

  if (!clipId) {
    const t = await getTranslations("shorts");
    return {
      title: t("meta.defaultTitle"),
      description: t("meta.defaultDescription"),
    };
  }

  const t = await getTranslations("shorts");
  const data = await getClipById(clipId);

  if (!data) {
    return {};
  }

  const format = await getFormatter();

  const creatorName =
    data.follower?.nickname || data.follower?.username || "Unknown";
  const platformName =
    (data.follower?.type?.charAt(0).toUpperCase() ?? "") +
    (data.follower?.type?.slice(1) ?? "");
  const createdDate = format.dateTime(new Date(data.createdAt || ""), {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const thumbnailUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/clip/${data.documentId}/thumbnail.jpg`;
  const clipUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/shorts/${data.documentId}`;

  const durationFormatted = `${data.duration || 0}s`;

  const translation = {
    creatorName,
    createdDate,
    platform: platformName,
    duration: durationFormatted,
    title: data.title || "",
  };

  return {
    title: t("meta.title", translation),
    description: data.description || t("meta.description", translation),
    keywords: t("meta.keywords", translation).split(", "),
    openGraph: {
      title: t("meta.title", translation),
      description: data.description || t("meta.description", translation),
      type: "video.other",
      url: clipUrl,
      siteName: "Live Stream Recorder",
      images: [
        {
          url: thumbnailUrl,
          width: 720,
          height: 1280,
          alt: `${creatorName} clip thumbnail`,
        },
      ],
      videos: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/clip/${data.documentId}/clip.mp4`,
          width: 720,
          height: 1280,
          type: "video/mp4",
        },
      ],
    },
    twitter: {
      card: "player",
      title: t("meta.title", translation),
      description: data.description || t("meta.description", translation),
      images: [thumbnailUrl],
    },
    alternates: {
      canonical: clipUrl,
    },
  };
}

export default async function ShortsPage({ params }: Props) {
  const { id } = await params;
  const clipId = id?.[0];
  const locale = await getLocale();
  const format = await getFormatter();
  const t = await getTranslations("shorts");

  let initialClips;
  let jsonLdData = null;

  if (clipId) {
    const specificClip = await getClipById(clipId);
    if (!specificClip) {
      notFound();
    }
    const randomClips = await getRandomClips(2);
    initialClips = [specificClip, ...randomClips];

    const creatorName =
      specificClip.follower?.username ||
      specificClip.follower?.nickname ||
      "Unknown";
    const createdDate = format.dateTime(
      new Date(specificClip.createdAt || ""),
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    );

    jsonLdData = {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name:
        specificClip.title || t("jsonLd.name", { creatorName, createdDate }),
      description:
        specificClip.description ||
        t("jsonLd.description", { creatorName, createdDate }),
      thumbnailUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/clip/${specificClip.documentId}/thumbnail.jpg`,
      uploadDate: specificClip.createdAt,
      duration: `PT${specificClip.duration || 0}S`,
      contentUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/clip/${specificClip.documentId}/clip.mp4`,
      embedUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/shorts/${specificClip.documentId}`,
      publisher: {
        "@type": "Organization",
        name: "Live Stream Recorder",
        url: process.env.NEXT_PUBLIC_BASE_URL,
      },
      ...(specificClip.follower && {
        author: {
          "@type": "Person",
          name: creatorName,
          alternateName: [specificClip.follower?.nickname, `@${specificClip.follower?.username}`].filter(Boolean),
          url: generateProfileUrl(specificClip.follower as never, true),
        },
      }),
      inLanguage: locale,
    };
  } else {
    initialClips = await getRandomClips(3);
  }

  return (
    <>
      {jsonLdData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      )}
      <ClipsViewer initialClips={initialClips} />
    </>
  );
}
