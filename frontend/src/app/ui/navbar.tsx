"use client";

import { Code, Group } from "@mantine/core";
import {
  IconBellRinging,
  IconLogout,
  IconReceipt2,
  IconSettings,
  IconSwitchHorizontal,
} from "@tabler/icons-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "../actions/auth";
import AddFollowerForm from "../dashboard/add-follower-form";
import { useNavigation } from "../lib/navigation-provider";
import { useUser } from "../lib/user-provider";
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
          {user?.username} <Code fw={700}>{opened}v3.1.2</Code>
        </Group>
        <AddFollowerForm />
        {links}
      </div>

      <div className={classes.footer}>
        <Link href="#" className={classes.link} onClick={toggle}>
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </Link>

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
