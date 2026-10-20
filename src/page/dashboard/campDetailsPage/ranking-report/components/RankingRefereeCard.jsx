import badge from "@/assets/svg/badge.svg";
import Icon from "@/components/common/Icon";
import { LEVEL_LABELS } from "@/lib/recommendedLevels";
import { LuMapPin, LuAward, LuUser } from "react-icons/lu";

export default function RankingRefereeCard({ record, levels = [] }) {
  // Collect all recommended levels that have at least 1 vote
  const activeLevels = levels.filter(
    (lvl) => (record?.levelCounts?.[lvl] || 0) > 0,
  );

  const getRankBadgeClasses = (rank) => {
    if (rank === 1) {
      return "bg-amber-100 text-amber-900 border-amber-300 ring-1 ring-amber-200";
    }
    if (rank === 2) {
      return "bg-slate-100 text-slate-800 border-slate-300 ring-1 ring-slate-200";
    }
    if (rank === 3) {
      return "bg-orange-100 text-orange-900 border-orange-300 ring-1 ring-orange-200";
    }
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  const metrics = [
    { label: "Call Accur.", value: record.callAccur },
    { label: "Mechanics", value: record.mech },
    { label: "Fit / Mob", value: record.fitMob },
    { label: "Comm.", value: record.comm },
    { label: "Consistency", value: record.consistency },
    { label: "Game Aware", value: record.gA },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-200 space-y-4">
      {/* Top Header: Rank & Overall Score */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getRankBadgeClasses(
            record.rank,
          )}`}
        >
          <Icon src={badge} className="size-4 shrink-0" />
          <span>Rank #{record.rank}</span>
        </div>

        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs sm:text-sm font-bold">
          <LuAward className="size-3.5 shrink-0" />
          <span>Score: {Number(record.overall || 0).toFixed(3)}</span>
        </div>
      </div>

      {/* Referee Profile Details */}
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          {record.avatarUrl ? (
            <img
              src={record.avatarUrl}
              alt={record.name || "Referee"}
              className="w-12 h-12 rounded-full object-cover border border-slate-200"
              onError={(e) => {
                e.target.style.display = "none";
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = "flex";
                }
              }}
            />
          ) : null}
          <div
            className={`w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 ${
              record.avatarUrl ? "hidden" : "flex"
            }`}
          >
            <LuUser className="size-6" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">
              {record.name || "Unnamed Referee"}
            </h3>
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
              {record.totalEvaluations} eval
              {record.totalEvaluations !== 1 ? "s" : ""}
            </span>
          </div>

          {record.address && (
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
              <LuMapPin className="size-3 text-slate-400 shrink-0" />
              <span className="truncate">{record.address}</span>
            </p>
          )}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Scoring Metrics
        </p>
        <div className="grid grid-cols-3 gap-2">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="bg-white p-2 rounded-lg border border-slate-100 text-center shadow-2xs"
            >
              <span className="text-[10px] text-slate-500 font-medium block truncate">
                {metric.label}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                {metric.value !== undefined && metric.value !== null
                  ? Number(metric.value).toFixed(1)
                  : "-"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Levels (if any) */}
      {activeLevels.length > 0 && (
        <div className="pt-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Recommended Levels
          </p>
          <div className="flex flex-wrap gap-1.5">
            {activeLevels.map((lvl) => (
              <span
                key={lvl}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
              >
                <span>{LEVEL_LABELS[lvl] || lvl}</span>
                <span className="font-bold text-primary">
                  ×{record.levelCounts[lvl]}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
