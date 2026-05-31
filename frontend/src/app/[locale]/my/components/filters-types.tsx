"use client";

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
import { useTranslations } from "next-intl";

export const usePlatformOptions = () => {
  const t = useTranslations("protected.filters");

  return [
    {
      value: "all",
      label: (
        <Center style={{ gap: 8 }}>
          <IconWorld size={18} />
          <Text size="sm">{t("platforms.all")}</Text>
        </Center>
      ),
    },
    {
      value: "tiktok",
      label: (
        <Center style={{ gap: 8 }}>
          <IconBrandTiktok size={18} />
          <Text size="sm">{t("platforms.tiktok")}</Text>
        </Center>
      ),
    },
    {
      value: "twitch",
      label: (
        <Center style={{ gap: 8 }}>
          <IconBrandTwitch size={18} />
          <Text size="sm">{t("platforms.twitch")}</Text>
        </Center>
      ),
    },
    {
      value: "youtube",
      label: (
        <Center style={{ gap: 8 }}>
          <IconBrandYoutube size={18} />
          <Text size="sm">{t("platforms.youtube")}</Text>
        </Center>
      ),
    },
    {
      value: "kick",
      label: (
        <Center style={{ gap: 8 }}>
          <IconBrandKick size={18} />
          <Text size="sm">{t("platforms.kick")}</Text>
        </Center>
      ),
    },
    {
      value: "afreecatv",
      label: (
        <Center style={{ gap: 8 }}>
          <IconDeviceTv size={18} />
          <Text size="sm">{t("platforms.afreecatv")}</Text>
        </Center>
      ),
    },
    {
      value: "pandalive",
      label: (
        <Center style={{ gap: 8 }}>
          <IconBrandFunimation size={18} />
          <Text size="sm">{t("platforms.pandalive")}</Text>
        </Center>
      ),
    },
    {
      value: "liveme",
      label: (
        <Center style={{ gap: 8 }}>
          <IconBrandFunimation size={18} />
          <Text size="sm">{t("platforms.liveme")}</Text>
        </Center>
      ),
    },
    {
      value: "mixch",
      label: (
        <Center style={{ gap: 8 }}>
          <IconBrandFunimation size={18} />
          <Text size="sm">{t("platforms.mixch")}</Text>
        </Center>
      ),
    },
    {
      value: "twitcast",
      label: (
        <Center style={{ gap: 8 }}>
          <IconBrandFunimation size={18} />
          <Text size="sm">{t("platforms.twitcast")}</Text>
        </Center>
      ),
    },
    {
      value: "trovo",
      label: (
        <Center style={{ gap: 8 }}>
          <IconBrandFunimation size={18} />
          <Text size="sm">{t("platforms.trovo")}</Text>
        </Center>
      ),
    },
    {
      value: "joilive",
      label: (
        <Center style={{ gap: 8 }}>
          <IconBrandFunimation size={18} />
          <Text size="sm">{t("platforms.joilive")}</Text>
        </Center>
      ),
    },
    {
      value: "live17",
      label: (
        <Center style={{ gap: 8 }}>
          <IconBrandFunimation size={18} />
          <Text size="sm">{t("platforms.live17")}</Text>
        </Center>
      ),
    },
    {
      value: "kwai",
      label: (
        <Center style={{ gap: 8 }}>
          <IconBrandFunimation size={18} />
          <Text size="sm">{t("platforms.kwai")}</Text>
        </Center>
      ),
    },
    {
      value: "nimotv",
      label: (
        <Center style={{ gap: 8 }}>
          <IconBrandFunimation size={18} />
          <Text size="sm">{t("platforms.nimotv")}</Text>
        </Center>
      ),
    },
    {
      value: "vklive",
      label: (
        <Center style={{ gap: 8 }}>
          <IconBrandFunimation size={18} />
          <Text size="sm">{t("platforms.vklive")}</Text>
        </Center>
      ),
    },
    {
      value: "chzzk",
      label: (
        <Center style={{ gap: 8 }}>
          <IconBrandFunimation size={18} />
          <Text size="sm">{t("platforms.chzzk")}</Text>
        </Center>
      ),
    },
  ];
};

// Keep static version for non-hook contexts
export const PLATFORM_OPTIONS = [
  {
    value: "all",
    labelKey: "platforms.all",
    icon: IconWorld,
  },
  {
    value: "tiktok",
    labelKey: "platforms.tiktok",
    icon: IconBrandTiktok,
  },
  {
    value: "twitch",
    labelKey: "platforms.twitch",
    icon: IconBrandTwitch,
  },
  {
    value: "youtube",
    labelKey: "platforms.youtube",
    icon: IconBrandYoutube,
  },
  {
    value: "kick",
    labelKey: "platforms.kick",
    icon: IconBrandKick,
  },
  {
    value: "afreecatv",
    labelKey: "platforms.afreecatv",
    icon: IconDeviceTv,
  },
  {
    value: "pandalive",
    labelKey: "platforms.pandalive",
    icon: IconBrandFunimation,
  },
  {
    value: "bigo",
    labelKey: "platforms.bigo",
    icon: IconBrandFunimation,
  },
  {
    value: "liveme",
    labelKey: "platforms.liveme",
    icon: IconBrandFunimation,
  },
  {
    value: "mixch",
    labelKey: "platforms.mixch",
    icon: IconBrandFunimation,
  },
  {
    value: "twitcast",
    labelKey: "platforms.twitcast",
    icon: IconBrandFunimation,
  },
  {
    value: "trovo",
    labelKey: "platforms.trovo",
    icon: IconBrandFunimation,
  },
  {
    value: "joilive",
    labelKey: "platforms.joilive",
    icon: IconBrandFunimation,
  },
  {
    value: "live17",
    labelKey: "platforms.live17",
    icon: IconBrandFunimation,
  },
  {
    value: "kwai",
    labelKey: "platforms.kwai",
    icon: IconBrandFunimation,
  },
  {
    value: "nimotv",
    labelKey: "platforms.nimotv",
    icon: IconBrandFunimation,
  },
  {
    value: "vklive",
    labelKey: "platforms.vklive",
    icon: IconBrandFunimation,
  },
  {
    value: "chzzk",
    labelKey: "platforms.chzzk",
    icon: IconBrandFunimation,
  },
];

export const typeIcons: Record<string, React.ReactNode> = {
  tiktok: <IconBrandTiktok size={20} />,
  twitch: <IconBrandTwitch size={20} />,
  youtube: <IconBrandYoutube size={20} />,
  kick: <IconBrandKick size={20} />,
  afreecatv: <IconAlphabetKorean size={20} />,
};
