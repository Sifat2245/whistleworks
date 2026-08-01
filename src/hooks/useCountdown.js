import { useEffect, useState } from "react";
import dayjs from "dayjs";

/**
 * Live countdown to a target date.
 *
 * Returns `null` when there is no target or the target has passed,
 * otherwise `{ days, hours, minutes, seconds }` ticking every second.
 *
 * Uses dayjs so "YYYY-MM-DD" strings are parsed as local time,
 * consistent with the shared camp formatting helpers.
 */
const useCountdown = (targetDate) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!targetDate) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!targetDate) return null;
  const diff = dayjs(targetDate).valueOf() - now;
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
};

export default useCountdown;
