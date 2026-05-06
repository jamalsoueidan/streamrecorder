"use client";

import {
  Button,
  Card,
  Group,
  Loader,
  Stack,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import { notifications as toast } from "@mantine/notifications";
import { IconBell, IconSend } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import {
  disablePushNotifications,
  enablePushNotifications,
  sendTestPushNotification,
} from "../actions/push";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

// VAPID public key needs to be passed to the browser as a Uint8Array.
// The standard base64url → Uint8Array conversion.
function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

type State =
  | { kind: "loading" }
  | { kind: "unsupported" }
  | { kind: "denied" }
  | { kind: "ready"; subscribed: boolean };

export function NotificationsCard() {
  const t = useTranslations("protected.settings.notifications");
  const [state, setState] = useState<State>({ kind: "loading" });
  const [pending, setPending] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    (async () => {
      if (
        typeof window === "undefined" ||
        !("serviceWorker" in navigator) ||
        !("PushManager" in window)
      ) {
        setState({ kind: "unsupported" });
        return;
      }
      if (Notification.permission === "denied") {
        setState({ kind: "denied" });
        return;
      }
      // Make sure a SW is registered. `serviceWorker.ready` hangs forever
      // if there isn't one, which leaves the toggle stuck on "loading".
      try {
        // Migrate away from any legacy SW scope (/serwist/, etc) so
        // existing users with the old registration don't get a stuck
        // "loading" toggle. Then register fresh at scope "/".
        const origin = window.location.origin;
        const registrations =
          await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          if (reg.scope !== `${origin}/`) {
            await reg.unregister();
          }
        }
        const existing = await navigator.serviceWorker.getRegistration("/");
        if (!existing) {
          await navigator.serviceWorker.register("/serwist/sw.js", {
            scope: "/",
          });
        }
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        setState({ kind: "ready", subscribed: sub !== null });
      } catch (err) {
        console.warn("[notifications-card] SW init failed", err);
        // SW registration failed (private mode, http, etc). Show the
        // toggle anyway — clicking will retry the registration.
        setState({ kind: "ready", subscribed: false });
      }
    })();
  }, []);

  const subscribe = async () => {
    setPending(true);
    try {
      if (!VAPID_PUBLIC_KEY) {
        throw new Error(
          "Notifications are not configured (missing VAPID public key)",
        );
      }
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState({ kind: "denied" });
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        // PushManager wants BufferSource; the Uint8Array → ArrayBuffer copy
        // satisfies the lib.dom typing without runtime overhead.
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
          .buffer as ArrayBuffer,
      });
      const result = await enablePushNotifications(sub.toJSON() as any);
      if (!result.success) throw new Error(result.error ?? "Save failed");
      setState({ kind: "ready", subscribed: true });
      toast.show({ color: "green", title: t("enabled"), message: "" });
    } catch (err: any) {
      toast.show({
        color: "red",
        title: t("error"),
        message: err?.message ?? String(err),
      });
    } finally {
      setPending(false);
    }
  };

  const sendTest = async () => {
    setTesting(true);
    try {
      const result = await sendTestPushNotification();
      if (result.success) {
        toast.show({
          color: "green",
          title: t("testSent"),
          message: t("testSentMessage"),
        });
      } else {
        toast.show({
          color: "red",
          title: t("error"),
          message: result.error ?? "",
        });
      }
    } finally {
      setTesting(false);
    }
  };

  const unsubscribe = async () => {
    setPending(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) await sub.unsubscribe();
      await disablePushNotifications();
      setState({ kind: "ready", subscribed: false });
      toast.show({ color: "blue", title: t("disabled"), message: "" });
    } catch (err: any) {
      toast.show({
        color: "red",
        title: t("error"),
        message: err?.message ?? String(err),
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <Card withBorder p="xl">
      <Stack gap="lg">
        <Group>
          <IconBell size={28} />
          <Title order={2}>{t("title")}</Title>
        </Group>
        <Text size="md" c="dimmed">
          {t("description")}
        </Text>

        {state.kind === "loading" && <Loader size="sm" />}
        {state.kind === "unsupported" && (
          <Text size="sm" c="dimmed">
            {t("unsupported")}
          </Text>
        )}
        {state.kind === "denied" && (
          <Text size="sm" c="red">
            {t("denied")}
          </Text>
        )}
        {state.kind === "ready" && (
          <Stack gap="md">
            <Switch
              size="md"
              checked={state.subscribed}
              disabled={pending}
              onChange={(e) =>
                e.currentTarget.checked ? subscribe() : unsubscribe()
              }
              label={state.subscribed ? t("on") : t("off")}
            />
            {state.subscribed && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  leftSection={<IconSend size={16} />}
                  loading={testing}
                  onClick={sendTest}
                  style={{ alignSelf: "flex-start" }}
                >
                  {t("sendTest")}
                </Button>
                <Text size="sm" c="dimmed">
                  {t("helpTitle")}
                </Text>
                <Text size="xs" c="dimmed" component="ul" style={{ paddingLeft: 18, margin: 0 }}>
                  <li>{t("helpPermission")}</li>
                  <li>{t("helpFocus")}</li>
                </Text>
              </>
            )}
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
