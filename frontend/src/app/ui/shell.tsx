"use client";

import { AppShell, Burger, Group, useMatches } from "@mantine/core";
import { useDisclosure, useMounted } from "@mantine/hooks";
import { Navbar } from "./navbar";

export function Shell({ children }: { children: React.ReactNode }) {
  const [opened, { close, open }] = useDisclosure(false);

  // mount and headerHeight is fix for SSR and the video player page
  const mounted = useMounted();
  const headerHeight = useMatches({
    base: 60,
    sm: 0,
  });

  return (
    <AppShell
      styles={{
        header: !headerHeight
          ? {
              display: "none",
            }
          : {},
      }}
      layout="alt"
      header={{
        height: mounted ? headerHeight : 0,
        collapsed: headerHeight === 0,
      }}
      navbar={{
        width: 300,

        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={open} hiddenFrom="sm" size="sm" />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar opened={opened} close={close} />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
