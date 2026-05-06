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
): Promise<ActionResult> {
  try {
    await api.user.setPushSubscription(subscription);
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
