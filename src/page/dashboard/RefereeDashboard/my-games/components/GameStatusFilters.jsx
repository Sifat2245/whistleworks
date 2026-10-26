import { LuCalendarCheck, LuClock, LuHistory } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { GAME_STATUSES } from "@/page/dashboard/RefereeDashboard/my-games/constants/gameStatuses";

const statusIcons = {
  upcoming: LuCalendarCheck,
  ongoing: LuClock,
  past: LuHistory,
};

export default function GameStatusFilters({ value, onChange, statistics }) {
  return (
    <div
      role="group"
      aria-label="Filter games by status"
      className="grid w-full grid-cols-3 gap-2 sm:max-w-xl sm:gap-3"
    >
      {GAME_STATUSES.map(({ value: status, label, statisticKey }) => {
        const selected = value === status;
        const Icon = statusIcons[status];
        const count = statistics?.[statisticKey];

        return (
          <button
            key={status}
            type="button"
            aria-label={label}
            aria-pressed={selected}
            aria-controls="assigned-games-results"
            onClick={() => onChange(status)}
            className={cn(
              "flex min-h-14 min-w-0 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border px-1.5 py-3 text-xs font-semibold transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800 sm:flex-row sm:gap-2 sm:px-3 sm:text-sm",
              selected
                ? "border-primary bg-primary text-slate-950 shadow-xs"
                : "border-slate-200 bg-white text-slate-600 hover:border-primary/40 hover:bg-slate-50 hover:text-slate-900",
            )}
          >
            <span className="inline-flex items-center gap-1.5">
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              {typeof count === "number" && (
                <span
                  className={cn(
                    "min-w-5 rounded-md px-1.5 py-0.5 text-[10px] font-bold tabular-nums sm:order-last sm:text-xs",
                    selected ? "bg-white/40" : "bg-slate-100 text-slate-600",
                  )}
                >
                  {count}
                </span>
              )}
            </span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
