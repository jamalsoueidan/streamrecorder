"use client";

import { unfollow } from "@/app/actions/followers";
import { Button } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useTransition } from "react";

export default function UnfollowButton({
  documentId,
  onSuccess,
}: {
  documentId: string;
  onSuccess?: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await unfollow(documentId);
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
