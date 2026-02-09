"use client";

import { useNavbarCollapsed } from "@/app/hooks/use-navbar-collapsed";
import { IsNewProvider } from "@/app/providers/is-new-provider";
import { AppShell, useMatches } from "@mantine/core";
import { useDisclosure, useMounted } from "@mantine/hooks";
import { MobileBar } from "./mobilebar";
import { Navbar } from "./navbar";

const NAVBAR_WIDTH_EXPANDED = 310;
const NAVBAR_WIDTH_COLLAPSED = 80;

export function Shell({
  children,
  initialCollapsed = false,
}: {
  children: React.ReactNode;
  initialCollapsed?: boolean;
}) {
  const [opened, { close, open }] = useDisclosure(false);
  const { collapsed, toggle } = useNavbarCollapsed(initialCollapsed);

  // mount and headerHeight is fix for SSR and the video player page
  const mounted = useMounted();
  const headerHeight = useMatches({
    base: 63,
    sm: 0,
  });

  return (
    <IsNewProvider>
      <AppShell
        styles={{
          footer: !headerHeight
            ? {
                display: "none",
              }
            : {},
          navbar: {
            transition: "width 200ms ease",
          },
        }}
        layout="alt"
        footer={{
          height: mounted ? headerHeight : 0,
          collapsed: headerHeight === 0,
        }}
        navbar={{
          width: collapsed ? NAVBAR_WIDTH_COLLAPSED : NAVBAR_WIDTH_EXPANDED,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding={{ base: "xs", sm: "md" }}
      >
        <AppShell.Header></AppShell.Header>
        <AppShell.Navbar>
          <Navbar
            opened={opened}
            close={close}
            collapsed={collapsed}
            onToggleCollapse={toggle}
          />
        </AppShell.Navbar>
        <AppShell.Main>{children}</AppShell.Main>
        <AppShell.Footer>
          <MobileBar />
        </AppShell.Footer>
      </AppShell>
    </IsNewProvider>
  );
}
