"use client";

import { logout } from "@/app/actions/auth";
import { useNavigation } from "@/app/providers/navigation-provider";
import { useUser } from "@/app/providers/user-provider";
import { Menu, SegmentedControl, Stack, Text } from "@mantine/core";
import { spotlight } from "@mantine/spotlight";
import {
  IconDotsVertical,
  IconLogout,
  IconUser,
  IconUserPlus,
} from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { iconMap } from "./navbar";

export function MobileBar() {
  const [isPending, startTransition] = useTransition();
  const navigation = useNavigation();
  const user = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const iconProps = {
    style: { display: "block" },
    size: 20,
    stroke: 1.5,
  };

  const currentValue =
    (navigation?.data?.links || []).find((item) =>
      pathname.startsWith(item.url || "")
    )?.url || "";

  const links = (navigation?.data?.links || []).map((item) => {
    const Icon = iconMap[item.icon || "IconPlayerRecord"];

    return {
      value: item.url || "",
      label: (
        <Stack gap="0" align="center">
          <Icon
            {...iconProps}
            style={{ width: "18px", height: "18px" }}
            color={item.color ? item.color : undefined}
          />
          <Text c="dimmed" size="xs">
            {item.label}
          </Text>
        </Stack>
      ),
    };
  });

  const handleChange = (value: string) => {
    if (value === "menu") return;
    startTransition(() => {
      router.push(value);
    });
  };

  return (
    <SegmentedControl
      w="100%"
      value={currentValue}
      onChange={handleChange}
      data={[
        ...links,
        {
          value: "menu",
          label: (
            <Menu shadow="md" width={200} position="top-end">
              <Menu.Target>
                <Stack
                  gap="0"
                  align="center"
                  onClick={(e) => e.stopPropagation()}
                >
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
  );
}
