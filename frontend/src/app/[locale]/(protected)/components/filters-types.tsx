import { Center, Text } from "@mantine/core";
import {
  IconAlphabetKorean,
  IconBrandFunimation,
  IconBrandKick,
  IconBrandTiktok,
  IconBrandTwitch,
  IconBrandYoutube,
  IconDeviceTv,
  IconWorld,
} from "@tabler/icons-react";

export const PLATFORM_OPTIONS = [
  {
    value: "all",
    label: (
      <Center style={{ gap: 8 }}>
        <IconWorld size={18} />
        <Text size="sm">All</Text>
      </Center>
    ),
  },
  {
    value: "tiktok",
    label: (
      <Center style={{ gap: 8 }}>
        <IconBrandTiktok size={18} />
        <Text size="sm">TikTok</Text>
      </Center>
    ),
  },
  {
    value: "twitch",
    label: (
      <Center style={{ gap: 8 }}>
        <IconBrandTwitch size={18} />
        <Text size="sm">Twitch</Text>
      </Center>
    ),
  },
  {
    value: "youtube",
    label: (
      <Center style={{ gap: 8 }}>
        <IconBrandYoutube size={18} />
        <Text size="sm">Youtube</Text>
      </Center>
    ),
  },
  {
    value: "kick",
    label: (
      <Center style={{ gap: 8 }}>
        <IconBrandKick size={18} />
        <Text size="sm">Kick</Text>
      </Center>
    ),
  },
  {
    value: "afreecatv",
    label: (
      <Center style={{ gap: 8 }}>
        <IconDeviceTv size={18} />
        <Text size="sm">AfreecaTV</Text>
      </Center>
    ),
  },
  {
    value: "pandalive",
    label: (
      <Center style={{ gap: 8 }}>
        <IconBrandFunimation size={18} />
        <Text size="sm">PandaLive</Text>
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
