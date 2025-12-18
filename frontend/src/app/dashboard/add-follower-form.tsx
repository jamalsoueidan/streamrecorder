"use client";

import { follow } from "@/app/actions/followers";
import { useActionState } from "react";

export default function AddFollowerForm() {
  const [state, formAction, pending] = useActionState(follow, null);

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: 20,
        marginBottom: 32,
        borderRadius: 8,
      }}
    >
      <h2 style={{ marginBottom: 16 }}>Add Follower</h2>
      {state?.error && <p style={{ color: "red" }}>{state.error}</p>}
      <form action={formAction} style={{ display: "flex", gap: 12 }}>
        <select name="type" style={{ padding: 8 }}>
          <option value="tiktok">TikTok</option>
          <option value="twitch">Twitch</option>
        </select>
        <input
          name="username"
          type="text"
          placeholder="Username"
          required
          style={{ flex: 1, padding: 8 }}
        />
        <button
          type="submit"
          disabled={pending}
          style={{ padding: "8px 16px" }}
        >
          {pending ? "Adding..." : "Follow"}
        </button>
      </form>
    </div>
  );
}
