"use server";

import api from "@/lib/api";

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function enablePushNotifications(
  subscription: {
    endpoint: string;
    expirationTime: number | null;
    keys: { p256dh: string; auth: string };
  },
  locale?: string,
): Promise<ActionResult> {
  try {
    // Locale travels alongside endpoint+keys so the backend can render
    // "X is live" in the language the user sees the app in. The autogen
    // type doesn't list locale yet — pass through with a cast.
    await api.user.setPushSubscription({
      ...subscription,
      ...(locale ? { locale } : {}),
    } as any);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error?.error?.message || "Failed to enable notifications",
    };
  }
}

export async function disablePushNotifications(): Promise<ActionResult> {
  try {
    await api.user.deletePushSubscription();
    return { success: true };
  } catch {
    return { success: false, error: "Failed to disable notifications" };
  }
}

export async function sendTestPushNotification(): Promise<ActionResult> {
  try {
    await api.user.testPushNotification();
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error?.error?.message || "Failed to send test notification",
    };
  }
}
