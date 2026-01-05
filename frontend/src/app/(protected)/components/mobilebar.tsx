"use client";

import { logout } from "@/app/actions/auth";
import { useNavigation } from "@/app/providers/navigation-provider";
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
  IconShare,
  IconSquarePlus,
  IconUser,
  IconUserPlus,
} from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { iconMap } from "./navbar";

// Check if running in standalone mode (outside component)
const getIsInstalled = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches;
};

export function MobileBar() {
  const [isPending, startTransition] = useTransition();
  const navigation = useNavigation();
  const user = useUser();
  const pathname = usePathname();
  const router = useRouter();

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
    const section = navigation?.section?.find((section) =>
      section.links?.some((link) => pathname.startsWith(link.url || ""))
    );
    return section ? "menu" + section.title : "";
  })();

  const links =
    navigation?.section?.map((section) => {
      const Icon = iconMap[section.icon || "IconPlayerRecord"];
      return {
        value: "menu" + section.title,
        label: (
          <Menu position="top-start" offset={15}>
            <Menu.Target>
              <Stack gap={4} align="center">
                <Icon
                  {...iconProps}
                  style={{ width: "18px", height: "18px" }}
                />
                <Text c="dimmed" size="xs">
                  {section.title}
                </Text>
              </Stack>
            </Menu.Target>

            <Menu.Dropdown>
              {section.links?.map((item) => {
                const Icon = iconMap[item.icon || "IconPlayerRecord"];

                return (
                  <Menu.Item
                    key={item.id}
                    leftSection={
                      <Icon
                        {...iconProps}
                        style={{ width: "18px", height: "18px" }}
                        color={item.color ? item.color : undefined}
                      />
                    }
                    onClick={() => handleChange(item.url || "#")}
                  >
                    {item.label}
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
        title="Install App"
      >
        <Stack gap="md">
          <Text>To install this app on your iPhone:</Text>
          <Group gap="xs">
            <Text>1. Tap the</Text>
            <IconShare size={20} />
            <Text>Share button</Text>
          </Group>
          <Group gap="xs">
            <Text>2. Tap</Text>
            <IconSquarePlus size={20} />
            <Text>&quot;Add to Home Screen&quot;</Text>
          </Group>
          <Text>3. Tap &quot;Add&quot;</Text>
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
                      More
                    </Text>
                  </Stack>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>
                    <IconUser
                      size={14}
                      style={{ marginRight: 8, verticalAlign: "middle" }}
                    />
                    {user?.username || "Guest"}
                  </Menu.Label>

                  <Menu.Divider />

                  <Menu.Item
                    leftSection={<IconUserPlus size={16} />}
                    onClick={() => spotlight.open()}
                  >
                    Add Creator
                  </Menu.Item>

                  {!isInstalled && (
                    <Menu.Item
                      leftSection={<IconDownload size={16} />}
                      onClick={handleInstall}
                    >
                      Install App
                    </Menu.Item>
                  )}

                  <Menu.Divider />

                  <Menu.Item
                    color="red"
                    leftSection={<IconLogout size={16} />}
                    onClick={async () => await logout()}
                  >
                    Logout
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
