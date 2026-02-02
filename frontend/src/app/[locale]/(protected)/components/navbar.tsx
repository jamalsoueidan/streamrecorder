"use client";

import { Button, Divider, Group, Menu, Stack, Text } from "@mantine/core";
import {
  IconArrowDown,
  IconBrandSafari,
  IconHeart,
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
import AddFollowerForm from "./add-follower-form";
import classes from "./navbar.module.css";
import { RoleBadge } from "./role-badge";

export const navigation = [
  {
    titleKey: "sections.recordings",
    icon: IconVideo,
    links: [
      {
        labelKey: "links.explore",
        url: "/explore",
        icon: IconBrandSafari,
        color: null,
      },
      {
        labelKey: "links.following",
        url: "/following",
        icon: IconUsers,
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
    titleKey: "sections.creators",
    icon: IconUsers,
    links: [
      {
        labelKey: "links.discover",
        url: "/discover",
        icon: IconWorldSearch,
        color: null,
      },
      {
        labelKey: "links.myList",
        url: "/my-list",
        icon: IconHeart,
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
    const html = section.links?.map((item) => {
      const Icon = item.icon || IconPlayerRecordFilled;
      return (
        <Link
          className={classes.link}
          data-active={pathname.startsWith(item.url || "") || undefined}
          key={item.labelKey}
          href={item.url || "#"}
          onClick={(e) => handleLinkClick(e, item.url || "#")}
        >
          <Group gap="xs">
            <Icon
              className={classes.linkIcon}
              stroke={2}
              style={{ width: "28px", height: "28px" }}
              color={item.color ? item.color : undefined}
            />
            <span>{t(item.labelKey)}</span>
          </Group>
        </Link>
      );
    });

    return (
      <div key={section.titleKey}>
        <Text size="md" fw={400} c="dimmed" mb="xs">
          {t(section.titleKey)}
        </Text>
        {html}
      </div>
    );
  });

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Divider my="4px" color="transparent" />
        <AddFollowerForm />

        <Divider my="xs" color="transparent" />
        <Stack>{links}</Stack>
      </div>

      <div className={classes.footer}>
        <Menu width={280}>
          <Menu.Target>
            <Button
              fullWidth
              size="lg"
              variant="outline"
              c="white"
              color="gray.7"
              leftSection={<IconArrowDown size="18" stroke={1.5} />}
              rightSection={user?.role ? <RoleBadge role={user.role} /> : null}
            >
              {user?.username}
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
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
    </nav>
  );
}
