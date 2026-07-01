import { getToken } from "@/lib/token";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function isValidIanaTz(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("protected.dashboard");
  return {
    title: `${t("title")} | LiveStreamRecorder`,
  };
}

import { getAnnouncement } from "@/app/actions/announcement";
import { getUser } from "@/app/actions/user";
import { SwRegister } from "@/app/components/sw-register";
import { TimezoneCookie } from "@/app/components/timezone-cookie";
import { buildRulesFromStrapi } from "@/app/lib/ability";
import { AbilityProvider } from "@/app/providers/ability-provider";
import { QueryProvider } from "@/app/providers/query-provider";
import { UserProvider } from "@/app/providers/user-provider";
import api from "@/lib/api";
import { Shell } from "./components/shell";
import { FreezeModal } from "./components/freeze-modal";
import { computeFreeze, FREEZE_DISCOUNT_CODE } from "./lib/freeze";
import { HourCycleProvider } from "./lib/hour-cycle";
import { hourCycleFromTimeZone } from "./lib/hour-cycle-server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getToken();

  if (!token) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  const navbarCollapsed = cookieStore.get("navbar-collapsed")?.value === "true";
  const cookieTz = cookieStore.get("tz")?.value;
  const timeZone =
    cookieTz && isValidIanaTz(cookieTz) ? cookieTz : "UTC";
  const locale = await getLocale();
  const hourCycle = hourCycleFromTimeZone(timeZone, locale);

  let user;
  try {
    user = await getUser();
  } catch (error: any) {
    if (error?.response?.status === 401) {
      redirect("/api/logout");
    }
    throw error;
  }


  const role = user?.data?.role || null;

  // Payday freeze campaign (env-gated; inert unless FREEZE_START is set).
  const freeze = computeFreeze(user?.data);

  const permissions = await api.usersPermissionsUsersRoles.rolesDetail({
    id: role?.id?.toString() || "",
  });

  const rules = buildRulesFromStrapi(
    (permissions.data?.role as any)?.permissions || {},
  );

  const announcement = await getAnnouncement(locale);
  const messages = await getMessages();

  return (
    // Nested provider so /my/ pages format dates in the user's local TZ
    // (read from the `tz` cookie set by <TimezoneCookie/>) while public
    // pages outside this subtree keep using the static config from
    // getRequestConfig — that's what keeps them CDN-cacheable.
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone={timeZone}
    >
      <HourCycleProvider value={hourCycle}>
        <QueryProvider>
          <UserProvider user={user?.data}>
            <AbilityProvider rules={rules} role={role}>
              <SwRegister />
              <TimezoneCookie />
              {freeze ? (
                <FreezeModal
                  endsAt={freeze.endsAt}
                  discountCode={FREEZE_DISCOUNT_CODE}
                />
              ) : null}
              <Shell initialCollapsed={navbarCollapsed} announcement={announcement}>{children}</Shell>
            </AbilityProvider>
          </UserProvider>
        </QueryProvider>
      </HourCycleProvider>
    </NextIntlClientProvider>
  );
}
