import dayjs from "@/app/lib/dayjs";

export const getDateRange = (range: string | null) => {
  if (!range) return {};

  const ranges: Record<string, { $gte?: string; $lte?: string }> = {
    today: {
      $gte: dayjs().startOf("day").toISOString(),
    },
    yesterday: {
      $gte: dayjs().subtract(1, "day").startOf("day").toISOString(),
      $lte: dayjs().subtract(1, "day").endOf("day").toISOString(),
    },
    thisWeek: {
      $gte: dayjs().startOf("week").toISOString(),
    },
    lastWeek: {
      $gte: dayjs().subtract(1, "week").startOf("week").toISOString(),
      $lte: dayjs().subtract(1, "week").endOf("week").toISOString(),
    },
    thisMonth: {
      $gte: dayjs().startOf("month").toISOString(),
    },
    lastMonth: {
      $gte: dayjs().subtract(1, "month").startOf("month").toISOString(),
      $lte: dayjs().subtract(1, "month").endOf("month").toISOString(),
    },
  };

  return ranges[range] ? { createdAt: ranges[range] } : {};
};
