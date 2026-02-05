"use client";

import {
  Divider,
  Flex,
  Menu,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconBrandSafari,
  IconBrowser,
  IconDots,
  IconLink,
  IconLogout,
  IconPlayerRecordFilled,
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
import { RoleBadge } from "./role-badge";

export const navigation = [
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
        labelKey: "links.myList",
        url: "/my-list",
        icon: IconBrowser,
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
}: {
  close: () => void;
  opened: boolean;
}) {
  const router = useRouter();
  const user = useUser();
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("protected.navigation");
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
    return section.links?.map((item) => {
      const Icon = item.icon || IconPlayerRecordFilled;
      return (
        <UnstyledButton
          component={Link}
          data-active={pathname.startsWith(item.url || "") || undefined}
          key={item.labelKey}
          href={item.url || "#"}
          className={classes.link}
          onClick={(e) => handleLinkClick(e, item.url || "#")}
        >
          <Stack gap="2px" justify="center" align="center">
            <Icon
              stroke={2}
              style={{ width: "24px", height: "24px" }}
              color={item.color ? item.color : undefined}
            />
            <Text size="md">{t(item.labelKey)}</Text>
          </Stack>
        </UnstyledButton>
      );
    });
  });

  return (
    <nav>
      <Flex direction="column" justify="space-between" h="100dvh" px="xs">
        <Stack mt="xs" gap="xs">
          <UnstyledButton
            data-active={pathname.startsWith("/search") || undefined}
            component={Link}
            href="/search"
            onClick={(e) => handleLinkClick(e, "/search")}
            className={classes.link}
          >
            <Stack gap="2px" justify="center" align="center">
              <IconLink stroke={2} style={{ width: "24px", height: "24px" }} />
              <Text size="md">{t("actions.search")}</Text>
            </Stack>
          </UnstyledButton>

          {links}
        </Stack>

        <div>
          <Divider my="sm" />
          <Menu width={280}>
            <Menu.Target>
              <UnstyledButton className={classes.link} w="100%">
                <Stack gap="2px" justify="center" align="center">
                  <IconDots
                    stroke={2}
                    style={{ width: "24px", height: "24px" }}
                  />
                  <Text size="md">Menu</Text>
                </Stack>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Sub openDelay={120} closeDelay={150}>
                {user?.role && (
                  <Menu.Label>
                    <Flex justify="space-between">
                      <Text>{user.username}</Text>
                      <RoleBadge role={user?.role} size="sm" />
                    </Flex>
                  </Menu.Label>
                )}
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
                onClick={async (e) => {
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
        </div>
      </Flex>
    </nav>
  );
}
