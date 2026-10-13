import { LuClipboardCheck, LuUsers, LuAward, LuLayers } from "react-icons/lu";

export default function EvaluationStatsCards({ statistics, overallLevelSummary }) {
  const totalEvaluations = statistics?.total_evaluations ?? 0;
  const uniqueReferees = statistics?.unique_referees_evaluated ?? 0;
  const levels = Array.isArray(overallLevelSummary) ? overallLevelSummary : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* ── Total Evaluations ── */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Evaluations
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
            {totalEvaluations}
          </p>
          <p className="text-xs text-slate-500">Submitted for this camp</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#00AEEF] flex items-center justify-center text-xl shrink-0 border border-blue-100">
          <LuClipboardCheck />
        </div>
      </div>

      {/* ── Referees Evaluated ── */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Referees Evaluated
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
            {uniqueReferees}
          </p>
          <p className="text-xs text-slate-500">Unique officials graded</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl shrink-0 border border-purple-100">
          <LuUsers />
        </div>
      </div>

      {/* ── Level Summary ── */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Level Summary
            </p>
            <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center text-xs">
              <LuAward />
            </div>
          </div>
          {levels.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto">
              {levels.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                >
                  <span className="font-semibold text-slate-900">{item.level}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white text-slate-600 font-bold">
                    {item.count}
                  </span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No level recommendations yet</p>
          )}
        </div>
        <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
          <LuLayers className="shrink-0" />
          Officiating level recommendations
        </p>
      </div>
    </div>
  );
}
