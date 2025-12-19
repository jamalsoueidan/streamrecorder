"use client";

import { follow } from "@/app/actions/followers";
import { useActionState } from "react";

export default function AddFollowerForm() {
  const [state, formAction, pending] = useActionState(follow, null);

  return (
    <section style={{ marginBottom: 24 }}>
      <h2>Add Follower</h2>
      {state?.error && <p style={{ color: "red" }}>{state.error}</p>}
      <form action={formAction} style={{ display: "flex", gap: 8 }}>
        <select name="type">
          <option value="tiktok">TikTok</option>
          <option value="twitch">Twitch</option>
        </select>
        <input name="username" type="text" placeholder="Username" required style={{ flex: 1 }} />
        <button type="submit" disabled={pending}>
          {pending ? "Adding..." : "Follow"}
        </button>
      </form>
    </section>
  );
}
