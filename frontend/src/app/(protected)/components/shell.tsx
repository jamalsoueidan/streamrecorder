"use client";

import { AppShell, useMatches } from "@mantine/core";
import { useDisclosure, useMounted } from "@mantine/hooks";
import { MobileBar } from "./mobilebar";
import { Navbar } from "./navbar";

export function Shell({ children }: { children: React.ReactNode }) {
  const [opened, { close, open }] = useDisclosure(false);

  // mount and headerHeight is fix for SSR and the video player page
  const mounted = useMounted();
  const headerHeight = useMatches({
    base: 68,
    sm: 0,
  });

  return (
    <AppShell
      styles={{
        footer: !headerHeight
          ? {
              display: "none",
            }
          : {},
      }}
      layout="alt"
      footer={{
        height: mounted ? headerHeight : 0,
        collapsed: headerHeight === 0,
      }}
      navbar={{
        width: 310,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding={{ base: "xs", sm: "md" }}
    >
      <AppShell.Header></AppShell.Header>
      <AppShell.Navbar>
        <Navbar opened={opened} close={close} />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
      <AppShell.Footer>
        <MobileBar />
      </AppShell.Footer>
    </AppShell>
  );
}
