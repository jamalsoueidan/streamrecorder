"use client";

import { useUser } from "@/app/providers/user-provider";
import {
  Group,
  Menu,
  Modal,
  SegmentedControl,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { spotlight } from "@mantine/spotlight";
import {
  IconDotsVertical,
  IconDownload,
  IconLogout,
  IconPlayerPlayFilled,
  IconShare,
  IconSquarePlus,
  IconUser,
  IconUserPlus,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { navigation } from "./navbar";

// Check if running in standalone mode (outside component)
const getIsInstalled = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches;
};

export function MobileBar() {
  const [isPending, startTransition] = useTransition();
  const user = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("protected.navigation");

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(getIsInstalled);
  const [iosModalOpened, { open: openIosModal, close: closeIosModal }] =
    useDisclosure(false);

  useEffect(() => {
    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      openIosModal();
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

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
    <>
      <Modal
        opened={iosModalOpened}
        onClose={closeIosModal}
        title={t("installModal.title")}
      >
        <Stack gap="md">
          <Text>{t("installModal.description")}</Text>
          <Group gap="xs">
            <Text>1. {t("installModal.step1")}</Text>
            <IconShare size={20} />
            <Text>{t("installModal.shareButton")}</Text>
          </Group>
          <Group gap="xs">
            <Text>2. {t("installModal.step2")}</Text>
            <IconSquarePlus size={20} />
            <Text>&quot;{t("installModal.addToHomeScreen")}&quot;</Text>
          </Group>
          <Text>3. {t("installModal.step3")}</Text>
        </Stack>
      </Modal>

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

                  {!isInstalled && (
                    <Menu.Item
                      leftSection={<IconDownload size={16} />}
                      onClick={handleInstall}
                    >
                      {t("actions.installApp")}
                    </Menu.Item>
                  )}

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
    </>
  );
}
