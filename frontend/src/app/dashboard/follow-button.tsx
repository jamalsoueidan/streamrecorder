"use client";

import { followUser } from "@/app/actions/followers";

export default function FollowButton(data: any) {
  async function handleClick() {
    await followUser(data);
  }

  return (
    <button type="button" onClick={handleClick}>
      Follow
    </button>
  );
}
