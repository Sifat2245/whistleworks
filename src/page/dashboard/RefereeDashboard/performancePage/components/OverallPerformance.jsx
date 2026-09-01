import { LuStar, LuTrophy, LuClipboardCheck, LuTrendingUp } from "react-icons/lu";

export default function OverallPerformance({
  ranking,
  overallPerformance,
  hasEvaluations,
}) {
  const score = overallPerformance.score || 0;
  const totalEvals = overallPerformance.total_evaluations || 0;
  const positionText = ranking?.position ? `Top ${ranking.position}` : "Unranked";

  return (
    <div className="w-full bg-white rounded-xl border border-[#E8E8E8] md:p-6 p-4 shadow-xs font-sans">
      {/* Title */}
      <div className="border-b border-[#E8E8E8] pb-4 mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl md:text-2xl font-semibold text-[#333]">
            Overall Performance Overview
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Summary of your officiating ratings and evaluator feedback metrics.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#00AEEF] text-xs font-bold uppercase tracking-wider">
          <LuTrendingUp className="text-sm" />
          <span>Live Metrics</span>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Overall Score */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 flex items-center gap-4">
          <div className="size-12 rounded-xl bg-blue-50 text-[#00AEEF] flex items-center justify-center text-2xl shrink-0 border border-blue-100">
            <LuStar />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Overall Score
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-none mt-1">
              {score > 0 ? score.toFixed(1) : "0.0"}
              <span className="text-sm font-medium text-slate-400">/10</span>
            </p>
          </div>
        </div>

        {/* Rank Position */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 flex items-center gap-4">
          <div className="size-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl shrink-0 border border-amber-100">
            <LuTrophy />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Camp Ranking
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-none mt-1">
              {hasEvaluations ? positionText : "N/A"}
            </p>
          </div>
        </div>

        {/* Total Evaluations */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 flex items-center gap-4">
          <div className="size-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl shrink-0 border border-emerald-100">
            <LuClipboardCheck />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Evaluations
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-none mt-1">
              {totalEvals}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
