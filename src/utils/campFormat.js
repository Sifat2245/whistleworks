import dayjs from "dayjs";

/**
 * Shared formatting helpers for camp detail pages.
 * Used by both the public (no-auth) camp details page and the
 * dashboard CampDetails component so date/price/duration formatting
 * stays consistent across the app.
 *
 * Note: dates arrive as "YYYY-MM-DD" strings from the API. `dayjs`
 * parses those as local time, avoiding the UTC-midnight off-by-one
 * that `new Date("YYYY-MM-DD")` causes in negative-offset timezones.
 */

export const formatDate = (dateStr) => {
  if (!dateStr) return "TBA";
  const d = dayjs(dateStr);
  if (!d.isValid()) return dateStr;
  return d.format("MMM D, YYYY");
};

export const getDurationDays = (start, end) => {
  if (!start || !end) return null;
  const s = dayjs(start);
  const e = dayjs(end);
  if (!s.isValid() || !e.isValid()) return null;
  const days = e.diff(s, "day") + 1;
  return days > 0 ? days : null;
};

export const formatPrice = (price) => {
  if (
    price === undefined ||
    price === null ||
    price === "" ||
    price === "N/A"
  )
    return "—";
  const num = Number(price);
  if (Number.isNaN(num)) return "—";
  if (num === 0) return "Free";
  return `$${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
