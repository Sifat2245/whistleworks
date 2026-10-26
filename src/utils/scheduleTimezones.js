import { fromZonedTime } from "date-fns-tz";

export function formatScheduleTimezone(timezone, date, time) {
  if (typeof timezone !== "string" || !timezone.trim()) return "";
  const zone = timezone.trim();
  try {
    const day = typeof date === "string" ? date.slice(0, 10) : "";
    const hasDate = /^\d{4}-\d{2}-\d{2}$/.test(day);
    // A generic label (CT/ET) avoids guessing daylight saving when no game date exists.
    const instant = hasDate
      ? fromZonedTime(`${day}T${time || "12:00:00"}`, zone)
      : new Date(0);
    return (
      new Intl.DateTimeFormat("en-US", {
        timeZone: zone,
        timeZoneName: hasDate ? "short" : "shortGeneric",
      })
        .formatToParts(instant)
        .find((part) => part.type === "timeZoneName")?.value || zone
    );
  } catch {
    // Keep an unfamiliar API zone readable instead of inventing an abbreviation.
    return zone;
  }
}
