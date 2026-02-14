"use client";

import {
  ActionIcon,
  Anchor,
  Button,
  Divider,
  Flex,
  Group,
  Menu,
  Paper,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconBrandSafari,
  IconHome,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconLibrary,
  IconLink,
  IconLogout,
  IconPlayerRecordFilled,
  IconScissors,
  IconSettings,
  IconSparkles,
  IconUsers,
  IconVideo,
  IconWorldSearch,
} from "@tabler/icons-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useRouter } from "next/navigation";

import { useChangeLanguage } from "@/app/hooks/use-change-language";
import { useUser } from "@/app/providers/user-provider";
import * as Sentry from "@sentry/nextjs";
import { useLocale, useTranslations } from "next-intl";
import { navConfig } from "../../(public)/components/nav";
import classes from "./navbar.module.css";

export const navigation = [
  {
    titleKey: "sections.home",
    icon: IconHome,
    links: [
      {
        labelKey: "links.dashboard",
        url: "/dashboard",
        icon: IconHome,
        color: null,
      },
    ],
  },
  {
    titleKey: "sections.studio",
    icon: IconVideo,
    links: [
      {
        labelKey: "links.myRecordings",
        url: "/following",
        icon: IconVideo,
        color: null,
      },
      {
        labelKey: "links.myClips",
        url: "/my-clips",
        icon: IconScissors,
        color: null,
      },
      {
        labelKey: "links.aiStudio",
        url: "/ai-studio",
        icon: IconSparkles,
        color: "violet",
      },
      {
        labelKey: "links.myList",
        url: "/my-list",
        icon: IconLibrary,
        color: null,
      },
      {
        labelKey: "links.live",
        url: "/live",
        icon: IconPlayerRecordFilled,
        color: "red",
      },
    ],
  },
  {
    titleKey: "sections.community",
    icon: IconUsers,
    links: [
      {
        labelKey: "links.explore",
        url: "/explore",
        icon: IconBrandSafari,
        color: null,
      },
      {
        labelKey: "links.friends",
        url: "/discover",
        icon: IconWorldSearch,
        color: null,
      },
    ],
  },
];

export function Navbar({
  close,
  opened,
  collapsed,
  onToggleCollapse,
}: {
  close: () => void;
  opened: boolean;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const router = useRouter();
  const user = useUser();
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("protected.navigation");
  const tFooter = useTranslations("footer");
  const { switchLocale } = useChangeLanguage();

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    if (opened) {
      // only mobile
      e.preventDefault();
      close();
      setTimeout(() => router.push(url), 100);
    }
  };

  const links = navigation?.map((section) => {
    const html = section.links.map((item) => {
      const Icon = item.icon || IconPlayerRecordFilled;
      const isActive = pathname.startsWith(item.url || "");

      const linkContent = (
        <Link
          className={classes.link}
          data-active={isActive || undefined}
          data-collapsed={collapsed || undefined}
          key={item.labelKey}
          href={item.url || "#"}
          onClick={(e) => handleLinkClick(e, item.url || "#")}
        >
          {collapsed ? (
            <Icon
              className={classes.linkIcon}
              stroke={2}
              style={{ width: "28px", height: "28px" }}
              color={item.color ? item.color : undefined}
            />
          ) : (
            <Group gap="xs">
              <Icon
                className={classes.linkIcon}
                stroke={2}
                style={{ width: "28px", height: "28px" }}
                color={item.color ? item.color : undefined}
              />
              <span>{t(item.labelKey)}</span>
            </Group>
          )}
        </Link>
      );

      if (collapsed) {
        return (
          <Tooltip
            key={item.labelKey}
            label={t(item.labelKey)}
            position="right"
            withArrow
          >
            {linkContent}
          </Tooltip>
        );
      }

      return linkContent;
    });

    return (
      <div key={section.titleKey}>
        {!collapsed && (
          <Text size="md" fw={400} c="dimmed" mb="xs">
            {t(section.titleKey)}
          </Text>
        )}
        <Stack
          gap={collapsed ? 4 : "xs"}
          align={collapsed ? "center" : "stretch"}
        >
          {html}
        </Stack>
      </div>
    );
  });

  const searchContent = collapsed ? (
    <Tooltip label={t("actions.searchPlaceholder")} position="right" withArrow>
      <ActionIcon
        component={Link}
        href="/search"
        size="xl"
        variant="light"
        color="yellow"
        onClick={(e: React.MouseEvent<HTMLAnchorElement>) =>
          handleLinkClick(e, "/search")
        }
        style={{
          border: pathname.includes("/search") ? "1px solid gold" : undefined,
        }}
      >
        <IconLink size={24} />
      </ActionIcon>
    </Tooltip>
  ) : (
    <Link
      href="/search"
      style={{ textDecoration: "none" }}
      onClick={(e) => handleLinkClick(e, "/search")}
    >
      <Paper
        p="sm"
        radius="md"
        style={{
          cursor: "pointer",
          border: "1px solid gold",
          ...(pathname.includes("/search")
            ? {}
            : {
                animation: "glow 2s ease-in-out 2 forwards",
              }),
        }}
      >
        <Group>
          <IconLink size={24} color="gray" />
          <Text c="gray.3">{t("actions.searchPlaceholder")}</Text>
        </Group>
      </Paper>
    </Link>
  );

  return (
    <nav className={classes.navbar} data-collapsed={collapsed || undefined}>
      <div className={classes.navbarMain}>
        <Stack align={collapsed ? "center" : "stretch"}>{searchContent}</Stack>

        <Divider my="xs" color="transparent" />
        <Stack gap="md">{links}</Stack>
      </div>

      {!collapsed && (
        <Stack gap={4} mb="md">
          <Anchor href="/contact" size="md" c="dimmed">
            {tFooter("company.contact")}
          </Anchor>
          <Anchor href="/privacy" size="md" c="dimmed">
            {tFooter("legal.privacy")}
          </Anchor>
          <Anchor href="/terms" size="md" c="dimmed">
            {tFooter("legal.terms")}
          </Anchor>
          <Text size="sm" c="dimmed">
            @2026 LiveStreamRecorder
          </Text>
        </Stack>
      )}

      <div className={classes.footer}>
        <Flex
          direction={collapsed ? "column" : "row"}
          align="center"
          gap="xs"
          w="100%"
        >
          <Tooltip
            label={collapsed ? t("actions.expand") : t("actions.collapse")}
            position="right"
            withArrow
          >
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={onToggleCollapse}
              size="lg"
            >
              {collapsed ? (
                <IconLayoutSidebarLeftExpand />
              ) : (
                <IconLayoutSidebarLeftCollapse />
              )}
            </ActionIcon>
          </Tooltip>

          <Menu trigger="click-hover">
            <Menu.Target>
              {collapsed ? (
                <Tooltip
                  label={user?.username}
                  position="right"
                  withArrow
                  closeDelay={500}
                >
                  <ActionIcon size="xl" variant="outline" color="gray.7">
                    <IconSettings size={20} />
                  </ActionIcon>
                </Tooltip>
              ) : (
                <Button
                  w="100%"
                  size="lg"
                  variant="outline"
                  c="white"
                  color="gray.7"
                  leftSection={<IconSettings />}
                >
                  {user?.username}
                </Button>
              )}
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                component={Link}
                href="/settings"
                leftSection={<IconSettings size={16} />}
              >
                {t("actions.settings")}
              </Menu.Item>
              <Menu.Sub openDelay={120} closeDelay={150}>
                <Menu.Sub.Target>
                  <Menu.Sub.Item leftSection={<IconWorldSearch size={16} />}>
                    {t("actions.language")} {locale.toUpperCase()}
                  </Menu.Sub.Item>
                </Menu.Sub.Target>

                <Menu.Sub.Dropdown>
                  {navConfig.languages
                    .filter((lang) => locale !== lang.code)
                    .map((lang) => (
                      <Menu.Item
                        key={lang.code}
                        onClick={() => switchLocale(lang.code)}
                      >
                        {lang.label}
                      </Menu.Item>
                    ))}
                </Menu.Sub.Dropdown>
              </Menu.Sub>
              <Menu.Item
                onClick={async () => {
                  Sentry.setUser(null);
                  await fetch("/api/logout", { method: "POST" });
                  window.location.href = "/";
                }}
                leftSection={<IconLogout size={16} />}
              >
                {t("actions.logout")}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
      </div>
    </nav>
  );
}
