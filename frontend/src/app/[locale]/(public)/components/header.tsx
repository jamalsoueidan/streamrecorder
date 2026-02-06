"use client";

import { useChangeLanguage } from "@/app/hooks/use-change-language";
import {
  Burger,
  Button,
  Container,
  Drawer,
  Flex,
  Group,
  Menu,
  NavLink,
  Stack,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconWorld } from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { redirectLoginUri } from "../login/components/login-form";
import { navConfig } from "./nav";

interface HeaderProps {
  isLoggedIn?: boolean;
}

export function Header({ isLoggedIn = false }: HeaderProps) {
  const t = useTranslations("footer");
  const locale = useLocale();
  const { switchLocale } = useChangeLanguage();

  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure();

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
            <Group gap={50}>
              <Link
                href="/"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    background: "#e53935",
                    color: "white",
                    padding: "1px 6px",
                    borderRadius: 4,
                    fontSize: "var(--mantine-font-size-md)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#ffffff",
                      animation: "blink 1s ease-in-out infinite",
                    }}
                  />
                  Live
                </span>
                <Title order={2} size="lg" c="white" fw={700}>
                  Stream Recorder
                </Title>
              </Link>

              <Group gap={8} visibleFrom="md">
                <Button
                  variant="subtle"
                  c="white"
                  size="compact-md"
                  component={Link}
                  href="/creators/all"
                >
                  {t("header.creators")}
                </Button>
                <Button
                  variant="subtle"
                  c="white"
                  size="compact-md"
                  component={Link}
                  href="/recordings/all"
                >
                  {t("header.recordings")}
                </Button>
                <Button
                  variant="subtle"
                  c="white"
                  size="compact-md"
                  component={Link}
                  href="/shorts"
                >
                  {t("header.shorts")}
                </Button>
              </Group>
            </Group>

            <Group gap={12} visibleFrom="md">
              <Menu>
                <Menu.Target>
                  <Button
                    variant="subtle"
                    c="white"
                    leftSection={<IconWorld size={18} />}
                    rightSection={<IconChevronDown size={14} />}
                  >
                    {t("header.language")} {locale.toUpperCase()}
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
              </Menu>

              {isLoggedIn ? (
                <Button
                  component={Link}
                  href={redirectLoginUri}
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
                    radius="lg"
                    style={{
                      outline: "2px solid rgba(168, 85, 247, 0.5)",
                      outlineOffset: "3px",
                    }}
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
            <Title order={2} size="lg" c="white" fw={700}>
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

          <NavLink
            label={t("header.shorts")}
            href="/shorts"
            component={Link}
            onClick={closeDrawer}
          />

          <NavLink
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
          </NavLink>

          <Group gap={12} mt="xl">
            {isLoggedIn ? (
              <Button
                fullWidth
                component={Link}
                href={redirectLoginUri}
                variant="gradient"
                gradient={{ from: "#6366f1", to: "#a855f7", deg: 135 }}
                radius="md"
              >
                {t("header.dashboard")}
              </Button>
            ) : (
              <>
                <Button
                  fullWidth
                  component={Link}
                  href="/register"
                  variant="gradient"
                  gradient={{ from: "#6366f1", to: "#a855f7", deg: 135 }}
                  radius="md"
                  onClick={closeDrawer}
                >
                  {t("header.signUp")}
                </Button>
                <Button
                  fullWidth
                  component={Link}
                  href="/login"
                  variant="default"
                  radius="md"
                  onClick={closeDrawer}
                >
                  {t("header.login")}
                </Button>
              </>
            )}
          </Group>
        </Stack>
      </Drawer>
    </>
  );
}
