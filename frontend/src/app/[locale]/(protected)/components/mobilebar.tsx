"use client";

import { useChangeLanguage } from "@/app/hooks/use-change-language";
import { useUser } from "@/app/providers/user-provider";
import { Menu, SegmentedControl, Stack, Text } from "@mantine/core";
import { spotlight } from "@mantine/spotlight";
import {
  IconDotsVertical,
  IconDownload,
  IconLogout,
  IconPlayerPlayFilled,
  IconUser,
  IconUserPlus,
  IconWorldSearch,
} from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { usePWAInstall } from "react-use-pwa-install";
import { navConfig } from "../../(public)/components/nav";
import { navigation } from "./navbar";

export function MobileBar() {
  const [, startTransition] = useTransition();
  const user = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("protected.navigation");
  const locale = useLocale();
  const { switchLocale } = useChangeLanguage();

  // null = not supported OR already installed OR doesn't meet PWA criteria
  const install = usePWAInstall();

  useEffect(() => {
    console.log("🔍 install value:", install);
    console.log(
      "🔍 standalone mode:",
      window.matchMedia("(display-mode: standalone)").matches,
    );

    // Listen for the event manually to debug
    window.addEventListener("beforeinstallprompt", (e) => {
      console.log("✅ beforeinstallprompt FIRED!", e);
    });
  }, [install]);

  const iconProps = {
    style: { display: "block" },
    size: 20,
    stroke: 1.5,
  };

  const handleChange = (value: string) => {
    if (value.substring(0, 4) === "menu") return;
    startTransition(() => {
      router.push(value);
    });
  };

  const currentValue = (() => {
    const section = navigation.find((section) =>
      section.links?.some((link) => pathname.startsWith(link.url || "")),
    );
    return section ? "menu" + section.titleKey : "";
  })();

  const links =
    navigation?.map((section) => {
      const Icon = section.icon || IconPlayerPlayFilled;
      return {
        value: "menu" + section.titleKey,
        label: (
          <Menu position="top-start" offset={15}>
            <Menu.Target>
              <Stack gap={4} align="center">
                <Icon
                  {...iconProps}
                  style={{ width: "18px", height: "18px" }}
                />
                <Text c="dimmed" size="xs">
                  {t(section.titleKey)}
                </Text>
              </Stack>
            </Menu.Target>

            <Menu.Dropdown>
              {section.links?.map((item) => {
                const Icon = item.icon || IconPlayerPlayFilled;

                return (
                  <Menu.Item
                    key={item.labelKey}
                    leftSection={
                      <Icon
                        {...iconProps}
                        style={{ width: "18px", height: "18px" }}
                        color={item.color ? item.color : undefined}
                      />
                    }
                    onClick={() => handleChange(item.url || "#")}
                  >
                    {t(item.labelKey)}
                  </Menu.Item>
                );
              })}
            </Menu.Dropdown>
          </Menu>
        ),
      };
    }) || [];

  return (
    <SegmentedControl
      size="xl"
      fullWidth
      value={currentValue}
      onChange={handleChange}
      data={[
        ...links,
        {
          value: "menu",
          label: (
            <Menu offset={15} position="top-start">
              <Menu.Target>
                <Stack gap={4} align="center">
                  <IconDotsVertical
                    {...iconProps}
                    style={{ width: "18px", height: "18px" }}
                  />
                  <Text c="dimmed" size="xs">
                    {t("actions.more")}
                  </Text>
                </Stack>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>
                  <IconUser
                    size={14}
                    style={{ marginRight: 8, verticalAlign: "middle" }}
                  />
                  {user?.username || t("actions.guest")}
                </Menu.Label>

                <Menu.Divider />

                <Menu.Item
                  leftSection={<IconUserPlus size={16} />}
                  onClick={() => spotlight.open()}
                >
                  {t("actions.addCreator")}
                </Menu.Item>

                {/* Only show if install is available (not null) */}
                {install && (
                  <Menu.Item
                    leftSection={<IconDownload size={16} />}
                    onClick={install}
                  >
                    {t("actions.installApp")}
                  </Menu.Item>
                )}

                <Menu.Divider />

                <Menu.Sub openDelay={120} closeDelay={150}>
                  <Menu.Sub.Target>
                    <Menu.Sub.Item leftSection={<IconWorldSearch size={16} />}>
                      {t("actions.language")} {locale.toUpperCase()}
                    </Menu.Sub.Item>
                  </Menu.Sub.Target>

                  <Menu.Sub.Dropdown>
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
                  </Menu.Sub.Dropdown>
                </Menu.Sub>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={<IconLogout size={16} />}
                  onClick={async () => {
                    await fetch("/api/logout", { method: "POST" });
                    window.location.href = "/";
                  }}
                >
                  {t("actions.logout")}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ),
        },
      ]}
    />
  );
}
