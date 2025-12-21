"use client";

import { follow } from "@/app/actions/followers";
import { ActionIcon, Flex, Input, Select, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAt, IconCheck, IconLoader, IconPlus } from "@tabler/icons-react";
import { useActionState, useEffect, useRef } from "react";

export default function AddFollowerForm() {
  const [state, formAction, pending] = useActionState(follow, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      notifications.show({
        title: "Followed!",
        message: `You are now following ${state.username}`,
        color: "green",
        icon: <IconCheck size={16} />,
      });
      formRef.current?.reset();
    }

    if (state?.error) {
      notifications.show({
        title: "Error",
        message: state.error,
        color: "red",
      });
    }
  }, [state]);

  return (
    <section>
      <Title order={3} mb="xs">
        Add Follower
      </Title>

      <form
        action={formAction}
        style={{ display: "flex", flexDirection: "column", gap: 4 }}
      >
        <Select name="type" data={["tiktok", "twitch"]} defaultValue="tiktok" />

        <Flex gap={3}>
          <Input
            placeholder="Your email"
            name="username"
            type="text"
            autoComplete="off"
            required
            leftSection={<IconAt size={16} />}
          />
          <ActionIcon size="lg" type="submit" disabled={pending}>
            {pending ? <IconLoader /> : <IconPlus />}
          </ActionIcon>
        </Flex>
      </form>
    </section>
  );
}
