import {
  LuCalendarDays,
  LuMapPin,
  LuLayoutGrid,
  LuUsers,
} from "react-icons/lu";
import GameSlotDateTime from "@/page/dashboard/EvolatorDashboard/schedule/components/GameSlotDateTime";

const STATUS_STYLES = {
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  cancelled: "bg-rose-50 text-rose-600 border-rose-200",
  scheduled: "bg-slate-50 text-slate-600 border-slate-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function GameCard({
  game,
  onRefereeClick,
  onCrewClick,
  onNoteClick,
}) {
  const hasReferees = (game.referees || []).length > 0;
  const statusKey = (game.status || "").toLowerCase();
  const statusLabel = (game.status || "").replace(/_/g, " ");
  const showStatus = Boolean(statusKey) && statusKey !== "scheduled";
  const statusClass = STATUS_STYLES[statusKey] || STATUS_STYLES.scheduled;

  const handleRefClick = (referee) => {
    if (referee.type === "individual" && onRefereeClick) {
      onRefereeClick(referee);
    }
  };

  const handleCrewClick = (referee) => {
    if (referee.type === "crew" && onCrewClick) {
      onCrewClick(referee);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-200 space-y-3.5">
      {/* Card Header: Court & Status */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <LuLayoutGrid size={18} />
          </span>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Court Assignment
            </span>
            <span className="text-sm font-bold text-slate-900">
              {game.court || "Court TBD"}
            </span>
          </div>
        </div>

        {showStatus && (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide border ${statusClass}`}
          >
            {statusLabel}
          </span>
        )}
      </div>

      {/* Date, Time & Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
        {/* Date & Time */}
        <div className="flex items-start gap-2.5 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
          <LuCalendarDays className="size-4 text-primary shrink-0 mt-0.5" />
          <GameSlotDateTime game={game} onNoteClick={onNoteClick} />
        </div>

        {/* Location */}
        <div className="flex items-start gap-2.5 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
          <LuMapPin className="size-4 text-primary shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 text-xs sm:text-sm">
              Location
            </p>
            <p
              className="text-xs text-slate-500 truncate mt-0.5"
              title={game.location}
            >
              {game.location || "Location not specified"}
            </p>
          </div>
        </div>
      </div>

      {/* Assigned Officials */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <LuUsers className="size-3.5 text-slate-500" />
            Assigned Officials ({(game.referees || []).length})
          </span>
        </div>

        {hasReferees ? (
          <div className="flex flex-wrap gap-2">
            {game.referees.map((referee, idx) =>
              referee.type === "individual" ? (
                <button
                  key={idx}
                  onClick={() => handleRefClick(referee)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#00AEEF]/10 text-[#00AEEF] hover:bg-[#00AEEF]/20 active:scale-95 transition-all cursor-pointer"
                  title={`Click to view ${referee.name || "referee"} details`}
                >
                  <LuUsers size={13} className="shrink-0" />
                  <span>
                    {referee.displayName || referee.name || "Unnamed Referee"}
                  </span>
                </button>
              ) : (
                <button
                  key={idx}
                  onClick={() => handleCrewClick(referee)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 active:scale-95 transition-all cursor-pointer"
                  title={`Click to view ${referee.crew_name || "crew"} details`}
                >
                  <LuUsers size={13} className="shrink-0" />
                  <span>{referee.displayName || "Crew: Unnamed Crew"}</span>
                </button>
              ),
            )}
          </div>
        ) : (
          <p className="text-xs italic text-slate-400 py-1">
            No officials assigned to this slot yet
          </p>
        )}
      </div>
    </div>
  );
}
