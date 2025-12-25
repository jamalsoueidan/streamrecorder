"use client";
import { Anchor, Burger, Container, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import Link from "next/link";
import classes from "./header-menu.module.css";

const links = [
  { link: "/", label: "Home" },
  { link: "/product-updates", label: "Product updates" },
];

export function HeaderMenu() {
  const [opened, { toggle }] = useDisclosure(false);

  const items = links.map((link) => {
    return (
      <Anchor
        key={link.label}
        component={Link}
        href={link.link}
        className={classes.link}
      >
        {link.label}
      </Anchor>
    );
  });

  return (
    <header className={classes.header}>
      <Container size="md">
        <div className={classes.inner}>
          <Anchor component={Link} href="/">
            <strong>StreamRecorder</strong>
          </Anchor>
          <Group gap={5} visibleFrom="sm">
            {items}
          </Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
        </div>
      </Container>
    </header>
  );
}
