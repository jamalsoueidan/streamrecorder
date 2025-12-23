"use client";

import { unfollow } from "@/app/actions/followers";
import { ActionIcon, Tooltip } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconUsersMinus } from "@tabler/icons-react";
import { useTransition } from "react";

export default function UnfollowButton({
  documentId,
  username,
  onSuccess,
}: {
  documentId: string;
  username?: string;
  onSuccess?: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await unfollow(documentId);

      notifications.show({
        title: "Unfollowed",
        message: username
          ? `You unfollowed ${username}`
          : "Successfully unfollowed",
        color: "green",
        icon: <IconCheck size={16} />,
      });
      onSuccess?.();
    });
  };

  return (
    <Tooltip label="Add Follower">
      <ActionIcon
        size="lg"
        color="gray"
        type="button"
        onClick={handleClick}
        loading={isPending}
      >
        <IconUsersMinus />
      </ActionIcon>
    </Tooltip>
  );
}
