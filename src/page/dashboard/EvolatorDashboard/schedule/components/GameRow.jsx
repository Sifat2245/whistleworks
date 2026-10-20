import {
  LuCalendarDays,
  LuClock,
  LuMapPin,
  LuLayoutGrid,
  LuUsers,
} from "react-icons/lu";
import GameCard from "./GameCard";

export { GameCard };

const STATUS_STYLES = {
  completed: "bg-green-50 text-green-700 border-green-200",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
  scheduled: "bg-gray-50 text-gray-600 border-gray-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function GameRow({ game, onRefereeClick, onCrewClick }) {
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
    <>
      {/* Desktop Table Row View (md and up) */}
      <div className="hidden md:grid md:grid-cols-[2fr_1.2fr_1fr_2.5fr] gap-4 px-5 md:px-6 py-5 hover:bg-primary/[0.04] transition-colors group">
        {/* Date & Time */}
        <div className="flex items-start gap-3">
          <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
            <LuCalendarDays size={18} />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-[#333]">{game.date}</span>
              {showStatus && (
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border ${statusClass}`}
                >
                  {statusLabel}
                </span>
              )}
            </div>
            <span className="flex items-center gap-1.5 text-sm text-[#666] mt-1">
              <LuClock size={14} className="text-[#999]" />
              {game.time}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center justify-center text-center gap-2 text-gray-700 capitalize px-1">
          <LuMapPin size={16} className="text-primary shrink-0" />
          <span className="truncate">{game.location}</span>
        </div>

        {/* Court */}
        <div className="flex items-center justify-center gap-2">
          <LuLayoutGrid size={16} className="text-primary shrink-0" />
          <span className="font-medium text-[#333]">{game.court}</span>
        </div>

        {/* Referees */}
        <div className="flex flex-wrap justify-center items-center gap-2">
          {hasReferees ? (
            game.referees.map((referee, idx) =>
              referee.type === "individual" ? (
                <button
                  key={idx}
                  onClick={() => handleRefClick(referee)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#00AEEF]/10 text-[#00AEEF] hover:bg-[#00AEEF]/20 transition-all cursor-pointer"
                  title={`Click to view ${referee.name || "referee"} details`}
                >
                  <LuUsers size={13} className="shrink-0" />
                  {referee.displayName || referee.name || "Unnamed Referee"}
                </button>
              ) : (
                <button
                  key={idx}
                  onClick={() => handleCrewClick(referee)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 transition-all cursor-pointer"
                  title={`Click to view ${referee.crew_name || "crew"} details`}
                >
                  <LuUsers size={13} className="shrink-0" />
                  {referee.displayName || "Crew: Unnamed Crew"}
                </button>
              ),
            )
          ) : (
            <span className="text-gray-400 text-sm italic">No Game</span>
          )}
        </div>
      </div>

      {/* Mobile Card View (below md) */}
      <div className="block md:hidden">
        <GameCard
          game={game}
          onRefereeClick={onRefereeClick}
          onCrewClick={onCrewClick}
        />
      </div>
    </>
  );
}
