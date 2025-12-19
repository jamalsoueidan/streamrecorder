"use client";

import { unfollow } from "@/app/actions/followers";

type Props = {
  id: number;
  onSuccess?: () => void;
};

export default function UnfollowButton({ id, onSuccess }: Props) {
  async function handleClick() {
    if (!confirm("Unfollow?")) return;
    await unfollow(id);
    onSuccess?.();
  }

  return (
    <button type="button" onClick={handleClick}>
      Unfollow
    </button>
  );
}
