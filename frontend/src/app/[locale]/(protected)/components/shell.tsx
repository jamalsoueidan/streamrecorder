"use client";

import { useNavbarCollapsed } from "@/app/hooks/use-navbar-collapsed";
import { trackEvent } from "@/app/lib/analytics";
import { IsNewProvider } from "@/app/providers/is-new-provider";
import { useUser } from "@/app/providers/user-provider";
import { Link } from "@/i18n/navigation";
import { AppShell, Button, Flex, Text, useMatches } from "@mantine/core";
import { useDisclosure, useMounted } from "@mantine/hooks";
import { IconCrown } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("protected.premium");
  //const tShell = useTranslations("protected.shell");
  const user = useUser();
  const isBasic = user?.role?.type === "authenticated";
  const [opened, { close, open }] = useDisclosure(false);
  const { collapsed, toggle } = useNavbarCollapsed(initialCollapsed);

  // mount and headerHeight is fix for SSR and the video player page
  const mounted = useMounted();
  const headerHeight = useMatches({
    base: 55,
    sm: 0,
  });

  return (
    <IsNewProvider>
      <AppShell
        header={isBasic ? { height: 50 } : undefined}
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
        {isBasic && (
          <AppShell.Header
            style={{
              background: "linear-gradient(150deg, #6366f1, #a855f7)",
              borderBottom: "none",
            }}
          >
            <Flex
              direction="row"
              justify="center"
              align="center"
              h="100%"
              px="md"
              gap="md"
            >
              <Text
                c="white"
                fw="600"
                size={headerHeight === 0 ? "md" : "sm"}
                truncate
              >
                {t("descriptionShort")}
              </Text>
              <Button
                component={Link}
                href="/premium"
                onClick={() => trackEvent("premium_banner_click")}
                variant="outline"
                radius="md"
                size={headerHeight === 0 ? "sm" : "xs"}
                color="white"
                rightSection={<IconCrown color="gold" />}
              >
                {t("title")}
              </Button>
            </Flex>
          </AppShell.Header>
        )}
        <AppShell.Navbar>
          <Navbar
            opened={opened}
            close={close}
            collapsed={collapsed}
            onToggleCollapse={toggle}
          />
        </AppShell.Navbar>
        <AppShell.Main>
          {/*<Card radius="lg" bg="red" px="2px" py="2px" mb="sm">
            <Text c="white" fw={600} size="sm" ta="center">
              {tShell("highDemandBanner")}
            </Text>
          </Card> */}
          {children}
        </AppShell.Main>
        <AppShell.Footer>
          <MobileBar />
        </AppShell.Footer>
      </AppShell>
    </IsNewProvider>
  );
}
