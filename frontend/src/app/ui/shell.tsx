"use client";

import { AppShell, Burger, Group, useMatches } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Navbar } from "./navbar";

export function Shell({ children }: { children: React.ReactNode }) {
  const [opened, { close, open }] = useDisclosure(false);
  const isMobile = useMatches({
    sm: true,
  });

  return (
    <AppShell
      layout="alt"
      header={{ height: 60, collapsed: !!isMobile }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      aside={{
        width: 300,
        breakpoint: "md",
        collapsed: { desktop: true, mobile: true },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={open} hiddenFrom="sm" size="sm" />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar opened={opened} toggle={close} />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
      <AppShell.Aside p="md">Aside</AppShell.Aside>
    </AppShell>
  );
}
