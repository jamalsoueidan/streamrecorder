"use client";
import { ActionIcon, Anchor, Group } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";

import Link from "next/link";
import classes from "./footer.module.css";

const links = [
  { link: "/", label: "Home" },
  { link: "/product-updates", label: "Product updates" },
  { link: "/privacy", label: "Privacy Policy" },
  { link: "/terms", label: "Terms & Conditions" },
  { link: "/dmca", label: "DMCA policy" },
  { link: "/faq", label: "Faq" },
];

export function Footer() {
  const items = links.map((link) => (
    <Anchor
      c="dimmed"
      component={Link}
      key={link.label}
      href={link.link}
      lh={1}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
        <Anchor component={Link} href="/">
          <strong>StreamRecorder</strong>
        </Anchor>
        <Group className={classes.links}>{items}</Group>
        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <ActionIcon
            size="lg"
            variant="default"
            radius="xl"
            component={Link}
            href="#"
          >
            <IconBrandGithub size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
      </div>
    </div>
  );
}
