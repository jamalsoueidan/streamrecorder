"use client";

import { unfollow } from "@/app/actions/followers";

export default function UnfollowButton({ id }: { id: number }) {
  async function handleClick() {
    await unfollow(id);
  }

  return (
    <button type="button" onClick={handleClick}>
      Unfollow
    </button>
  );
}
