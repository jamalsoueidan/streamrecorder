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
];

export const typeIcons: Record<string, React.ReactNode> = {
  tiktok: <IconBrandTiktok size={20} />,
  twitch: <IconBrandTwitch size={20} />,
  youtube: <IconBrandYoutube size={20} />,
  kick: <IconBrandKick size={20} />,
  afreecatv: <IconAlphabetKorean size={20} />,
};
