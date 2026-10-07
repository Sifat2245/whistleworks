import { FiCheckCircle } from "react-icons/fi";

const EvaluatorReportCard = ({ evaluators }) => {
  if (!evaluators || !evaluators.length) return null;

  return (
    <div className="mt-3 space-y-2.5">
      {evaluators.map((ev, i) => (
        <div
          key={i}
          className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs text-xs space-y-2"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div>
              <span className="font-extrabold text-slate-900 text-sm">{ev.name}</span>
              <p className="text-[11px] text-slate-500 font-medium">
                {ev.camps} Camps Staffed • {ev.evalsSubmitted} Evaluations Submitted
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold">
                Avg: {ev.avgScoreGiven}/10
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold flex items-center gap-1">
                <FiCheckCircle className="size-3" />
                <span>{ev.variance}</span>
              </span>
            </div>
          </div>

          <p className="text-slate-700 italic leading-relaxed">&ldquo;{ev.note}&rdquo;</p>
        </div>
      ))}
    </div>
  );
};

export default EvaluatorReportCard;
