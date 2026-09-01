import { LuListChecks, LuShieldCheck } from "react-icons/lu";

const EvaluationGuideline = () => {
  const guidelines = [
    "Rate each criteria category objectively from 1 to 10.",
    "Be consistent, fair, and unbiased across all game evaluations.",
    "Provide actionable, specific feedback in the written comments.",
    "Highlight key strengths alongside areas for development.",
    "Select the highest appropriate officiating competition level.",
  ];

  const scoreScale = [
    { range: "9-10", label: "Excellent", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { range: "7-8", label: "Proficient", color: "bg-blue-50 text-[#00AEEF] border-blue-200" },
    { range: "4-6", label: "Developing", color: "bg-amber-50 text-amber-700 border-amber-200" },
    { range: "1-3", label: "Needs Work", color: "bg-red-50 text-red-600 border-red-200" },
  ];

  return (
    <div className="w-full bg-white rounded-xl border border-[#E8E8E8] md:p-6 p-4 shadow-xs font-sans space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[#E8E8E8] pb-3">
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#00AEEF] flex items-center justify-center text-lg">
          <LuListChecks />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-[#333]">
            Evaluation Guidelines
          </h3>
          <p className="text-xs text-gray-500">
            Tips for fair and consistent referee scoring.
          </p>
        </div>
      </div>

      {/* Guidelines List */}
      <ul className="space-y-3">
        {guidelines.map((item, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-slate-700 text-xs sm:text-sm leading-relaxed"
          >
            <span className="w-5 h-5 rounded-md bg-blue-50 text-[#00AEEF] flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 border border-blue-100">
              {index + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {/* Score Scale Legend */}
      <div className="border-t border-[#E8E8E8] pt-5 space-y-3">
        <div className="flex items-center gap-2">
          <LuShieldCheck className="text-[#00AEEF] text-base" />
          <h4 className="font-semibold text-slate-800 text-xs sm:text-sm">
            Score Scale Reference
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {scoreScale.map((item) => (
            <div
              key={item.range}
              className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50 px-3.5 py-2 text-xs"
            >
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${item.color}`}
              >
                Score: {item.range}
              </span>
              <span className="font-semibold text-slate-700">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EvaluationGuideline;
