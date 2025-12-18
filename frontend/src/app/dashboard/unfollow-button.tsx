"use client";

import { unfollow } from "@/app/actions/followers";

export default function UnfollowButton({ id }: { id: number }) {
  async function handleClick() {
    if (!confirm("Unfollow?")) return;
    await unfollow(id);
  }

  return (
    <button onClick={handleClick} style={{ color: "red" }}>
      Unfollow
    </button>
  );
}
