import { Center } from "@mantine/core";
import {
  IconAlphabetKorean,
  IconBrandKick,
  IconBrandTiktok,
  IconBrandTwitch,
  IconBrandYoutube,
  IconWorld,
} from "@tabler/icons-react";

export const PLATFORM_OPTIONS = [
  {
    value: "all",
    label: (
      <Center style={{ gap: 8 }}>
        <IconWorld size={18} />
        <span>All</span>
      </Center>
    ),
  },
  {
    value: "tiktok",
    label: (
      <Center style={{ gap: 8 }}>
        <IconBrandTiktok size={18} />
        <span>TikTok</span>
      </Center>
    ),
  },
  {
    value: "twitch",
    label: (
      <Center style={{ gap: 8 }}>
        <IconBrandTwitch size={18} />
        <span>Twitch</span>
      </Center>
    ),
  },
  {
    value: "youtube",
    label: (
      <Center style={{ gap: 8 }}>
        <IconBrandYoutube size={18} />
        <span>Youtube</span>
      </Center>
    ),
  },
  {
    value: "kick",
    label: (
      <Center style={{ gap: 8 }}>
        <IconBrandKick size={18} />
        <span>Kick</span>
      </Center>
    ),
  },
  {
    value: "afreecatv",
    label: (
      <Center style={{ gap: 8 }}>
        <IconAlphabetKorean size={18} />
        <span>AfreecaTV</span>
      </Center>
    ),
  },
];

export const typeIcons: Record<string, React.ReactNode> = {
  tiktok: <IconBrandTiktok size={20} />,
  twitch: <IconBrandTwitch size={20} />,
  youtube: <IconBrandYoutube size={20} />,
  kick: <IconBrandKick size={20} />,
  afreecatv: <IconAlphabetKorean size={20} />,
};
