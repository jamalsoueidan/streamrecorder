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
  IconStar,
  IconUsers,
  IconVideo,
  IconWorldSearch,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";

const links = [
  { href: "#dashboard-new-creators", labelKey: "newCreators", icon: IconWorldSearch },
  { href: "#dashboard-favorites", labelKey: "favorites", icon: IconStar },
  { href: "#dashboard-most-viewed", labelKey: "mostViewed", icon: IconEye },
  { href: "#dashboard-most-downloaded", labelKey: "mostDownloaded", icon: IconDownload },
  { href: "#dashboard-my-feed", labelKey: "myFeed", icon: IconVideo },
  { href: "#dashboard-discover", labelKey: "discoverSection", icon: IconChartBar },
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
          {links.map(({ href, labelKey, icon: Icon }) => (
            <Anchor
              key={href}
              href={href}
              onClick={(e) => handleClick(e, href)}
              underline="never"
              c="var(--mantine-color-text)"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 999,
                background: "var(--mantine-color-default-hover)",
                fontSize: 13,
                fontWeight: 500,
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
