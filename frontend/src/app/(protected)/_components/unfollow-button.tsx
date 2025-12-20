"use client";

import { unfollow } from "@/app/actions/followers";
import { Button } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useTransition } from "react";

export default function UnfollowButton({
  id,
  onSuccess,
}: {
  id: number;
  onSuccess?: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await unfollow(id);
      onSuccess?.();
    });
  };

  return (
    <Button
      color="gray"
      size="xs"
      type="button"
      onClick={handleClick}
      loading={isPending}
      rightSection={<IconX size={14} />}
    >
      Following
    </Button>
  );
}
