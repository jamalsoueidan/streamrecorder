"use client";

import {
  ActionIcon,
  Divider,
  Group,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconArrowLeft,
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

import { useUser } from "@/app/providers/user-provider";
import { useTranslations } from "next-intl";
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
  const pathname = usePathname();
  const t = useTranslations("protected.navigation");

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
        <Group className={classes.header} justify="space-between">
          <Group>
            <ActionIcon
              component={Link}
              href="#"
              onClick={close}
              hiddenFrom="sm"
            >
              <IconArrowLeft stroke={1.4} />
            </ActionIcon>

            <Text>{user?.username}</Text>
          </Group>
          {user?.role ? <RoleBadge role={user.role} /> : null}
        </Group>

        <Divider my="sm" color="transparent" />
        <AddFollowerForm />

        <Divider my="xs" color="transparent" />
        <Stack>{links}</Stack>
      </div>

      <div className={classes.footer}>
        <UnstyledButton
          style={{ width: "100%" }}
          className={classes.link}
          onClick={async (e) => {
            await fetch("/api/logout", { method: "POST" });
            window.location.href = "/";
          }}
        >
          <Group gap="xs">
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>{t("actions.logout")}</span>
          </Group>
        </UnstyledButton>
      </div>
    </nav>
  );
}
