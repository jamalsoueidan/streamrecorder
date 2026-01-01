"use client";

import { ActionIcon } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export function ModalClose() {
  const router = useRouter();

  return (
    <ActionIcon
      variant="subtle"
      color="white"
      size="xl"
      radius="xl"
      onClick={() => router.back()}
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        zIndex: 1001,
      }}
      aria-label="Close"
    >
      <IconX size={28} />
    </ActionIcon>
  );
}
