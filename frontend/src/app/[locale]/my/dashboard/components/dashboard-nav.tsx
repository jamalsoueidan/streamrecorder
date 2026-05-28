"use client";

import {
  Anchor,
  Box,
  Group,
  ScrollArea,
} from "@mantine/core";
import {
  IconChartBar,
  IconDownload,
  IconEye,
  IconScissors,
  IconStar,
  IconUsers,
  IconVideo,
  IconWorldSearch,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";

const links = [
  {
    href: "#dashboard-new-creators",
    labelKey: "newCreators",
    icon: IconWorldSearch,
    background: "linear-gradient(150deg, #B4F4FF, #52DDE8)",
  },
  {
    href: "#dashboard-shorts",
    labelKey: "shorts",
    icon: IconScissors,
    background: "linear-gradient(150deg, #FFB4E5, #FF52A8)",
  },
  {
    href: "#dashboard-most-viewed",
    labelKey: "mostViewed",
    icon: IconEye,
    background: "linear-gradient(150deg, #E6CCFF, #9B6BFF)",
  },
  {
    href: "#dashboard-most-downloaded",
    labelKey: "mostDownloaded",
    icon: IconDownload,
    background: "linear-gradient(150deg, #C7E9FF, #4A9EFF)",
  },
  {
    href: "#dashboard-favorites",
    labelKey: "favorites",
    icon: IconStar,
    background: "linear-gradient(150deg, #FFF4B8, #FFD700)",
  },
  {
    href: "#dashboard-my-feed",
    labelKey: "myFeed",
    icon: IconVideo,
    background: "linear-gradient(150deg, #BDFF88, #5ABB91)",
  },
  {
    href: "#dashboard-discover",
    labelKey: "discoverSection",
    icon: IconChartBar,
    background: "linear-gradient(150deg, #FFCCCD, #F8888A)",
  },
];

export function DashboardNav() {
  const t = useTranslations("protected.dashboard");

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", href);
    }
  };

  return (
    <Box
      px={{ base: "xs", sm: "md" }}
      py="sm"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 5,
        background: "var(--mantine-color-body)",
        borderBottom: "1px solid var(--mantine-color-default-border)",
      }}
    >
      <ScrollArea
        type="never"
        offsetScrollbars={false}
        scrollbarSize={0}
      >
        <Group gap="xs" wrap="nowrap">
          {links.map(({ href, labelKey, icon: Icon, background }) => (
            <Anchor
              key={href}
              href={href}
              onClick={(e) => handleClick(e, href)}
              underline="never"
              c="black"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 999,
                background,
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <Icon size={16} />
              {t(labelKey)}
            </Anchor>
          ))}
        </Group>
      </ScrollArea>
    </Box>
  );
}
