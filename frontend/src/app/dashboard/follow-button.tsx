"use client";

import { followUser } from "@/app/actions/followers";
import { useRouter } from "next/navigation";

export default function FollowButton(data: any) {
  const router = useRouter();

  async function handleClick() {
    await followUser(data);
    router.refresh();
  }

  return (
    <button type="button" onClick={handleClick}>
      Follow
    </button>
  );
}
