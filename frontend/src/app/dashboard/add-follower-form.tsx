"use client";

import { follow } from "@/app/actions/followers";
import { useActionState } from "react";

export default function AddFollowerForm() {
  const [state, formAction, pending] = useActionState(follow, null);

  return (
    <section>
      <h2>Add Follower</h2>
      {state?.error && <p>{state.error}</p>}
      <form action={formAction}>
        <select name="type">
          <option value="tiktok">TikTok</option>
          <option value="twitch">Twitch</option>
        </select>
        <input name="username" type="text" placeholder="Username" required />
        <button type="submit" disabled={pending}>
          {pending ? "Adding..." : "Follow"}
        </button>
      </form>
    </section>
  );
}
