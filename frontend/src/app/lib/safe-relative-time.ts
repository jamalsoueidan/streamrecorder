import { useFormatter } from "next-intl";

export function safeRelativeTime(
  format: ReturnType<typeof useFormatter>,
  date: string | null | undefined,
  options: { now?: Date; style?: "long" | "short" | "narrow" } = {},
) {
  if (!date) return "";

  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return "";

  return format.relativeTime(parsed, options);
}
