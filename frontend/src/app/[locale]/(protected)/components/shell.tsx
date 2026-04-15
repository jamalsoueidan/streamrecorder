"use client";

import { useNavbarCollapsed } from "@/app/hooks/use-navbar-collapsed";
import { trackEvent } from "@/app/lib/analytics";
import { IsNewProvider } from "@/app/providers/is-new-provider";
import { useUser } from "@/app/providers/user-provider";
import { Link } from "@/i18n/navigation";
import {
  AppShell,
  Button,
  CloseButton,
  Flex,
  Group,
  Text,
  useMatches,
} from "@mantine/core";
import { useDisclosure, useLocalStorage, useMounted } from "@mantine/hooks";
import {
  IconBrandChrome,
  IconBrandGooglePlay,
  IconCrown,
  IconWorld,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { MobileBar } from "./mobilebar";
import { Navbar } from "./navbar";

const NAVBAR_WIDTH_EXPANDED = 310;
const NAVBAR_WIDTH_COLLAPSED = 80;
const ANDROID_TEST_CUTOFF = new Date("2026-04-09T00:00:00Z");

export function Shell({
  children,
  initialCollapsed = false,
}: {
  children: React.ReactNode;
  initialCollapsed?: boolean;
}) {
  const t = useTranslations("protected.premium");
  const tShell = useTranslations("protected.shell");
  const user = useUser();
  const isBasic = user?.role?.type === "authenticated";
  const [opened, { close, open }] = useDisclosure(false);
  const { collapsed, toggle } = useNavbarCollapsed(initialCollapsed);
  const [androidBannerDismissed, setAndroidBannerDismissed] = useLocalStorage({
    key: "android-test-banner-dismissed",
    defaultValue: false,
  });
  const [chromeBannerDismissed, setChromeBannerDismissed] = useLocalStorage({
    key: "chrome-extension-banner-dismissed",
    defaultValue: false,
  });
  const [mirrorBannerDismissed, setMirrorBannerDismissed] = useLocalStorage({
    key: "mirror-banner-dismissed",
    defaultValue: false,
  });
  const showAndroidBanner =
    !isBasic &&
    !androidBannerDismissed &&
    user?.email?.endsWith("@gmail.com") &&
    !!user?.createdAt &&
    new Date(user.createdAt) < ANDROID_TEST_CUTOFF;
  const isMobile = useMatches({
    base: true,
    sm: false,
  });
  const showChromeBanner =
    !isMobile && !showAndroidBanner && !chromeBannerDismissed;

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
          {!mirrorBannerDismissed && (
            <Flex
              align="center"
              justify="center"
              gap="xs"
              px="md"
              py={6}
              mb="sm"
              wrap="wrap"
              style={{
                background: "linear-gradient(150deg, #0d9488, #14b8a6)",
                borderRadius: 8,
              }}
            >
              <Group gap={4} wrap="nowrap">
                <IconWorld size={16} color="white" style={{ flexShrink: 0 }} />
                <Text c="white" fw={600} size="xs">
                  {tShell("mirrorBanner")}
                </Text>
              </Group>
              <Group gap={4} wrap="nowrap">
                <Button
                  component="a"
                  href="https://www.livestreamrecorder.net"
                  target="_blank"
                  variant="white"
                  radius="md"
                  size="compact-xs"
                  color="teal"
                >
                  livestreamrecorder.net
                </Button>
                <Button
                  component="a"
                  href="https://www.livestreamrecorder.org"
                  target="_blank"
                  variant="white"
                  radius="md"
                  size="compact-xs"
                  color="teal"
                >
                  livestreamrecorder.org
                </Button>
                <CloseButton
                  c="white"
                  size="sm"
                  onClick={() => setMirrorBannerDismissed(true)}
                />
              </Group>
            </Flex>
          )}
          {showChromeBanner && (
            <Flex
              align="center"
              justify="center"
              gap="sm"
              px="md"
              py={6}
              mb="sm"
              style={{
                background: "linear-gradient(150deg, #2563eb, #3b82f6)",
                borderRadius: 8,
              }}
            >
              <IconBrandChrome size={18} color="white" />
              <Text c="white" fw={600} size="sm" truncate>
                {tShell("chromeBanner")}
              </Text>
              <Button
                component="a"
                href="https://chromewebstore.google.com/detail/livestreamrecorder/jdofemnojahamgnbncleoekppkddnahi?utm_source=item-share-cb"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("chrome_extension_banner_click")}
                variant="white"
                radius="md"
                size="xs"
                color="blue"
                style={{ flexShrink: 0 }}
              >
                {tShell("chromeButton")}
              </Button>
              <CloseButton
                c="white"
                size="sm"
                onClick={() => setChromeBannerDismissed(true)}
                style={{ flexShrink: 0 }}
              />
            </Flex>
          )}
          {showAndroidBanner && (
            <Flex
              align="center"
              justify="center"
              gap="sm"
              px="md"
              py={6}
              mb="sm"
              style={{
                background: "linear-gradient(150deg, #1a7f37, #2ea043)",
                borderRadius: 8,
              }}
            >
              <IconBrandGooglePlay size={18} color="white" />
              <Text c="white" fw={600} size="sm" truncate>
                {tShell("androidTestBanner")}
              </Text>
              <Button
                component="a"
                href="https://play.google.com/apps/testing/com.livestreamrecorder.twa"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("android_test_banner_click")}
                variant="white"
                radius="md"
                size="xs"
                color="green"
                style={{ flexShrink: 0 }}
              >
                {tShell("androidTestButton")}
              </Button>
              <CloseButton
                c="white"
                size="sm"
                onClick={() => setAndroidBannerDismissed(true)}
                style={{ flexShrink: 0 }}
              />
            </Flex>
          )}
          {children}
        </AppShell.Main>
        <AppShell.Footer>
          <MobileBar />
        </AppShell.Footer>
      </AppShell>
    </IsNewProvider>
  );
}
