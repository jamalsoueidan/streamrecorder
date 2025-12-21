"use client";

import { ActionIcon, Code, Group, Text } from "@mantine/core";
import {
  IconArrowLeft,
  IconBellRinging,
  IconLogout,
  IconReceipt2,
  IconSettings,
} from "@tabler/icons-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AddFollowerForm from "../(protected)/_components/add-follower-form";
import { logout } from "../actions/auth";

import { useNavigation } from "../providers/navigation-provider";
import { useUser } from "../providers/user-provider";
import classes from "./navbar.module.css";

export const iconMap: Record<string, typeof IconBellRinging> = {
  IconBellRinging: IconBellRinging,
  IconReceipt2: IconReceipt2,
};

export function Navbar({
  toggle,
  opened,
}: {
  toggle: () => void;
  opened: boolean;
}) {
  const navigation = useNavigation();
  const user = useUser();
  const pathname = usePathname();

  const links = (navigation?.data?.links || []).map((item) => {
    const Icon = iconMap[item.icon || "IconReceipt2"] || IconSettings;
    return (
      <Link
        className={classes.link}
        data-active={pathname.startsWith(item.url || "") || undefined}
        href={item.url || "#"}
        key={item.label}
      >
        <Icon className={classes.linkIcon} stroke={1.5} />
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
              onClick={toggle}
              hiddenFrom="sm"
            >
              <IconArrowLeft stroke={1.4} />
            </ActionIcon>
            <Text> {user?.username}</Text>
          </Group>
          <Code fw={700}>{opened}v0.1.0</Code>
        </Group>
        <AddFollowerForm />
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
