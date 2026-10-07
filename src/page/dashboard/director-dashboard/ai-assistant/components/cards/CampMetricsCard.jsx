import { FiTrendingUp, FiUsers, FiFileText, FiAward, FiLayers } from "react-icons/fi";

const CampMetricsCard = ({ metrics }) => {
  if (!metrics) return null;

  return (
    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] uppercase font-bold tracking-wider">Total Camps</span>
          <FiLayers className="size-4 text-blue-500" />
        </div>
        <p className="text-2xl font-black text-slate-900">{metrics.totalCamps}</p>
        <p className="text-[11px] text-slate-500 font-medium mt-1">Multi-year sessions</p>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] uppercase font-bold tracking-wider">Referees Indexed</span>
          <FiUsers className="size-4 text-primary" />
        </div>
        <p className="text-2xl font-black text-primary">{metrics.totalRefereesTracked}</p>
        <p className="text-[11px] text-slate-500 font-medium mt-1">Active roster officials</p>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] uppercase font-bold tracking-wider">Evaluations Logged</span>
          <FiFileText className="size-4 text-emerald-600" />
        </div>
        <p className="text-2xl font-black text-emerald-600">{metrics.totalEvaluationsLogged}</p>
        <p className="text-[11px] text-slate-500 font-medium mt-1">Verified scorecards</p>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] uppercase font-bold tracking-wider">Average Score</span>
          <FiAward className="size-4 text-amber-500" />
        </div>
        <p className="text-2xl font-black text-amber-600">{metrics.averageCampScore} / 10</p>
        <p className="text-[11px] text-slate-500 font-medium mt-1">Cross-camp baseline</p>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between sm:col-span-2">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] uppercase font-bold tracking-wider">Referee Retention & Key Sport</span>
          <FiTrendingUp className="size-4 text-purple-600" />
        </div>
        <div className="flex items-baseline gap-3">
          <p className="text-2xl font-black text-purple-600">{metrics.retentionRate}</p>
          <span className="text-xs font-bold text-slate-700">({metrics.topSport})</span>
        </div>
        <p className="text-[11px] text-slate-500 font-medium mt-1">Officials attending repeat camp sessions</p>
      </div>
    </div>
  );
};

export default CampMetricsCard;
