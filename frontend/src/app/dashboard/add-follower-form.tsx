"use client";

import { follow } from "@/app/actions/followers";
import { Flex, Title } from "@mantine/core";
import { useActionState } from "react";

export default function AddFollowerForm() {
  const [state, formAction, pending] = useActionState(follow, null);

  return (
    <section style={{ marginBottom: 24 }}>
      <Title order={3}>Add Follower</Title>
      {state?.error && <p style={{ color: "red" }}>{state.error}</p>}
      <form
        action={formAction}
        style={{ display: "flex", flexDirection: "column", gap: 4 }}
      >
        <select name="type">
          <option value="tiktok">TikTok</option>
          <option value="twitch">Twitch</option>
        </select>

        <Flex gap={3}>
          <input
            name="username"
            type="text"
            placeholder="Username"
            required
            style={{ flex: 1 }}
          />
          <button type="submit" disabled={pending}>
            {pending ? "Adding..." : "Follow"}
          </button>
        </Flex>
      </form>
    </section>
  );
}
