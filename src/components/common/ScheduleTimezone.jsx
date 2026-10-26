import { cn } from "@/lib/utils";
import { formatScheduleTimezone } from "@/utils/scheduleTimezones";

// These are labels for already-local API times, not instructions to convert them.
export default function ScheduleTimezone({ timezones, date, time, className }) {
  const zones = [
    ...new Set(
      (Array.isArray(timezones) ? timezones : [timezones])
        .filter((zone) => typeof zone === "string" && zone.trim())
        .map((zone) => zone.trim()),
    ),
  ];
  if (!zones.length) return null;
  return (
    <span
      className={cn(
        "inline-flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] font-medium text-slate-500",
        className,
      )}
    >
      {zones.map((zone) => (
        <span key={zone} title={`Timezone: ${zone}`} className="break-words">
          {formatScheduleTimezone(zone, date, time)}
        </span>
      ))}
    </span>
  );
}
