"use client";

import { unfollow } from "@/app/actions/followers";
import { useRouter } from "next/navigation";

export default function UnfollowButton({ id }: { id: number }) {
  const router = useRouter();

  async function handleClick() {
    if (!confirm("Unfollow?")) return;
    await unfollow(id);
    router.refresh();
  }

  return (
    <button type="button" onClick={handleClick}>
      Unfollow
    </button>
  );
}
