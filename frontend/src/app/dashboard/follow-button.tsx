"use client";

import { followUser } from "@/app/actions/followers";

export default function FollowButton(data: any) {
  async function handleClick() {
    await followUser(data);
  }

  return <button onClick={handleClick}>Follow</button>;
}
