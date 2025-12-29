"use client";

import { ActionIcon, Divider, Group, Text } from "@mantine/core";
import {
  IconArrowLeft,
  IconBellRinging,
  IconBrandSafari,
  IconFlower,
  IconHeart,
  IconLogout,
  IconPlayerPlayFilled,
  IconPlayerRecordFilled,
  IconQuestionMark,
  IconStar,
  IconUsers,
  IconVideo,
  IconWorldSearch,
} from "@tabler/icons-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { logout } from "../../actions/auth";

import { useRouter } from "next/navigation";
import { useNavigation } from "../../providers/navigation-provider";
import { useUser } from "../../providers/user-provider";
import AddFollowerForm from "./add-follower-form";
import classes from "./navbar.module.css";
import { RoleBadge } from "./role-badge";

export const iconMap: Record<string, typeof IconBellRinging> = {
  IconFlower: IconFlower,
  IconUsers: IconUsers,
  IconPlayerPlayFilled: IconPlayerPlayFilled,
  IconVideo: IconVideo,
  IconWorldSearch: IconWorldSearch,
  IconQuestionMark: IconQuestionMark,
  IconPlayerRecord: IconPlayerRecordFilled,
  IconBrandSafari: IconBrandSafari,
  IconHeart: IconHeart,
  IconStar: IconStar,
};

export function Navbar({
  close,
  opened,
}: {
  close: () => void;
  opened: boolean;
}) {
  const router = useRouter();
  const navigation = useNavigation();
  const user = useUser();
  const pathname = usePathname();

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    if (opened) {
      // only mobile
      e.preventDefault();
      close();
      setTimeout(() => router.push(url), 100);
    }
  };

  const links = (navigation?.data?.links || []).map((item) => {
    const Icon = iconMap[item.icon || "IconPlayerRecord"];
    return (
      <Link
        className={classes.link}
        data-active={pathname.startsWith(item.url || "") || undefined}
        key={item.label}
        href={item.url || "#"}
        onClick={(e) => handleLinkClick(e, item.url || "#")}
      >
        <Icon
          className={classes.linkIcon}
          stroke={2}
          style={{ width: "32px", height: "32px" }}
          color={item.color ? item.color : undefined}
        />
        <span>{item.label}</span>
      </Link>
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

        {links}
      </div>

      <div className={classes.footer}>
        <Link
          href="#"
          className={classes.link}
          onClick={async (e) => {
            e.preventDefault();
            await logout();
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </Link>
      </div>
    </nav>
  );
}
