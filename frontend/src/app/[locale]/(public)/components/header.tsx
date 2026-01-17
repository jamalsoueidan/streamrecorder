"use client";

import {
  Burger,
  Button,
  Container,
  Drawer,
  Flex,
  Group,
  NavLink,
  Stack,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconUser } from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";

interface HeaderProps {
  isLoggedIn?: boolean;
}

export function Header({ isLoggedIn = false }: HeaderProps) {
  const t = useTranslations("footer");
  const locale = useLocale();
  const pathname = usePathname();
  const basePath = pathname.replace(/^\/ar/, "") || "/";

  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure();

  const switchLocale = useCallback(
    (newLocale: string) => {
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
      const href =
        newLocale === "en"
          ? basePath
          : `/ar${basePath === "/" ? "" : basePath}`;
      window.location.href = href;
    },
    [basePath],
  );

  return (
    <>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

      <header>
        <Container size="xl" py={12}>
          <Flex justify="space-between" align="center">
            {/* Logo */}
            <Link
              href="/"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  background: "#e53935",
                  color: "white",
                  padding: "4px 10px",
                  borderRadius: 4,
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#ffffff",
                    animation: "blink 1s ease-in-out infinite",
                  }}
                />
                Live
              </span>
              <Title order={4} c="white" fw={700}>
                Stream Recorder
              </Title>
            </Link>

            {/* Desktop Nav */}
            <Group gap={8} visibleFrom="md">
              <Button
                variant="subtle"
                c="white"
                component={Link}
                href="/creators/all"
              >
                {t("header.creators")}
              </Button>
              <Button
                variant="subtle"
                c="white"
                component={Link}
                href="/recordings/all"
              >
                {t("header.recordings")}
              </Button>
            </Group>

            <Group gap={12} visibleFrom="md">
              {/* <Menu>
                <Menu.Target>
                  <Button
                    variant="subtle"
                    c="white"
                    leftSection={<IconGlobe size={18} />}
                    rightSection={<IconChevronDown size={14} />}
                  >
                    {locale === "en" ? "EN" : "عربي"}
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  {navConfig.languages
                    .filter((lang) => locale !== lang.code)
                    .map((lang) => (
                      <Menu.Item
                        key={lang.code}
                        onClick={() => switchLocale(lang.code)}
                      >
                        {lang.label}
                      </Menu.Item>
                    ))}
                </Menu.Dropdown>
              </Menu>*/}

              {isLoggedIn ? (
                <Button
                  component={Link}
                  href="/following"
                  variant="gradient"
                  gradient={{ from: "#6366f1", to: "#a855f7", deg: 135 }}
                  radius="md"
                >
                  {t("header.dashboard")}
                </Button>
              ) : (
                <>
                  <Button
                    variant="subtle"
                    c="white"
                    component={Link}
                    href="/login"
                  >
                    {t("header.login")}
                  </Button>
                  <Button
                    component={Link}
                    href="/register"
                    variant="gradient"
                    gradient={{ from: "#6366f1", to: "#a855f7", deg: 135 }}
                    radius="md"
                  >
                    {t("header.signUp")}
                  </Button>
                </>
              )}
            </Group>

            {/* Mobile */}
            <Group gap={12} hiddenFrom="md">
              <Burger
                opened={drawerOpened}
                onClick={toggleDrawer}
                color="white"
              />
            </Group>
          </Flex>
        </Container>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        position="right"
        size="100%"
        title={
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
            onClick={closeDrawer}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                background: "#e53935",
                color: "white",
                padding: "4px 10px",
                borderRadius: 4,
                fontSize: "0.8rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#ffffff",
                  animation: "blink 1s ease-in-out infinite",
                }}
              />
              Live
            </span>
            <Title order={4} fw={700} c="white">
              Stream Recorder
            </Title>
          </Link>
        }
      >
        <Stack gap="xs" mt="md">
          <NavLink
            label={t("header.creators")}
            href="/creators/all"
            component={Link}
            onClick={closeDrawer}
          />
          <NavLink
            label={t("header.recordings")}
            href="/recordings/all"
            component={Link}
            onClick={closeDrawer}
          />

          {/*<NavLink
            label={t("header.language")}
            childrenOffset={28}
            defaultOpened={false}
          >
            {navConfig.languages.map((lang) => (
              <NavLink
                key={lang.code}
                label={lang.label}
                onClick={() => {
                  switchLocale(lang.code);
                  closeDrawer();
                }}
                active={locale === lang.code}
              />
            ))}
          </NavLink>*/}

          <Group gap={12} mt="xl">
            <Button
              variant="gradient"
              gradient={{ from: "#6366f1", to: "#a855f7", deg: 135 }}
              radius="lg"
              fullWidth
              component={Link}
              href="/register"
              onClick={closeDrawer}
            >
              {t("header.signUp")}
            </Button>
            <Button
              variant="default"
              radius="lg"
              fullWidth
              leftSection={<IconUser size={18} />}
              component={Link}
              href="/login"
              onClick={closeDrawer}
            >
              {t("header.login")}
            </Button>
          </Group>
        </Stack>
      </Drawer>
    </>
  );
}
