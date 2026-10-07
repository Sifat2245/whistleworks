import { FiUser, FiSliders, FiAward, FiBarChart2, FiTrendingUp } from "react-icons/fi";
import { SUGGESTED_PROMPTS } from "../data/aiAssistantData";

const ICON_MAP = {
  "Referee History": FiUser,
  "Compare Referees": FiSliders,
  "Highest Performers": FiAward,
  "Evaluator Insights": FiBarChart2,
  "Camp Analytics": FiTrendingUp,
};

const AiChatEmptyState = ({ onSelectPrompt }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full px-2 sm:px-4 py-2 sm:py-6 text-center space-y-3.5 sm:space-y-6 my-auto">
      {/* Title */}
      <div className="space-y-1 sm:space-y-2">
        <h2 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
          How can WhistleWorks AI assist you today?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Query referee evaluations, compare officials head-to-head, or analyze camp performance metrics.
        </p>
      </div>

      {/* Suggested Quick Queries (Clean ChatGPT Style List / Cards) */}
      <div className="w-full space-y-2">
        <p className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider text-left pl-0.5">
          Suggested AI Queries
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 text-left">
          {SUGGESTED_PROMPTS.map((item, idx) => {
            const Icon = ICON_MAP[item.title] || FiUser;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectPrompt(item.prompt)}
                className="group p-2.5 sm:p-3.5 bg-white hover:bg-slate-50/80 border border-slate-200/90 hover:border-slate-300 rounded-xl sm:rounded-2xl shadow-2xs hover:shadow-xs transition-all flex items-start gap-2.5 sm:gap-3 cursor-pointer text-left"
              >
                <div className="size-7 sm:size-8 rounded-lg sm:rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 mt-0.5 group-hover:text-primary transition-colors">
                  <Icon className="size-3.5 sm:size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-slate-900 text-xs block mb-0.5">
                    {item.title}
                  </span>
                  <p className="text-[11px] text-slate-500 leading-snug line-clamp-1 sm:line-clamp-2">
                    {item.prompt}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AiChatEmptyState;
