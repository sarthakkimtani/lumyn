export const dateFromUnixSeconds = (timestamp: number) => {
  if (!Number.isFinite(timestamp)) return null;
  return new Date(timestamp * 1000);
};

const MINUTE = 60;
const HOUR = 3600;
const DAY = 86400;
const WEEK = 604800;

export const formatRelativeDate = (unixSeconds: number): string => {
  const date = dateFromUnixSeconds(unixSeconds);
  if (!date) return "";

  const now = Date.now();
  const diffSeconds = Math.floor((now - date.getTime()) / 1000);

  if (diffSeconds < MINUTE) return "Just now";
  if (diffSeconds < HOUR) return `${Math.floor(diffSeconds / MINUTE)}m ago`;
  if (diffSeconds < DAY) return `${Math.floor(diffSeconds / HOUR)}h ago`;

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";

  if (diffSeconds < WEEK) {
    return date.toLocaleDateString(undefined, { weekday: "short" });
  }

  const isSameYear = date.getFullYear() === today.getFullYear();
  if (isSameYear) {
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export type DateSection = "Today" | "Yesterday" | "This Week" | "Earlier";

export const getDateSection = (unixSeconds: number): DateSection => {
  const date = dateFromUnixSeconds(unixSeconds);
  if (!date) return "Earlier";

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 6);

  if (date >= today) return "Today";
  if (date >= yesterday) return "Yesterday";
  if (date >= weekAgo) return "This Week";
  return "Earlier";
};
