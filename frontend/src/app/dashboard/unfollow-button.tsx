"use client";

import { unfollow } from "@/app/actions/followers";
import { Button } from "@mantine/core";

export default function UnfollowButton({ id }: { id: number }) {
  async function handleClick() {
    await unfollow(id);
  }

  return (
    <Button color="gray" size="xs" type="button" onClick={handleClick}>
      Following
    </Button>
  );
}
