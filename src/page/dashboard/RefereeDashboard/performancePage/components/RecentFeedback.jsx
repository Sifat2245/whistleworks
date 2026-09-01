import { format } from "date-fns";
import { LuMessageSquareQuote, LuUser, LuCalendar } from "react-icons/lu";

export default function RecentFeedback({ feedbackList = [] }) {
  if (feedbackList.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl border border-[#E8E8E8] md:p-6 p-4 shadow-xs font-sans">
        <div className="border-b border-[#E8E8E8] pb-3 mb-6">
          <h3 className="text-xl md:text-2xl font-semibold text-[#333]">
            Recent Evaluator Feedback
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Written evaluation comments and notes from court observers.
          </p>
        </div>

        <div className="text-center py-16 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
          <p className="text-base text-gray-500 font-medium">
            No feedback comments available yet for this camp.
          </p>
        </div>
      </div>
    );
  }

  const recentEvals = [...feedbackList]
    .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
    .slice(0, 10);

  return (
    <div className="w-full bg-white rounded-xl border border-[#E8E8E8] md:p-6 p-4 shadow-xs font-sans">
      <div className="border-b border-[#E8E8E8] pb-3 mb-6">
        <h3 className="text-xl md:text-2xl font-semibold text-[#333]">
          Recent Evaluator Feedback
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Written evaluation comments and notes from court observers.
        </p>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
        {recentEvals.map((evalItem) => {
          const averageScore = (evalItem?.total_score / evalItem?.max_score) * 10;
          const feedbackText = evalItem?.feedback || "No written feedback provided.";

          return (
            <div
              key={evalItem.id}
              className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 sm:p-5 hover:bg-white hover:border-[#00AEEF]/40 transition-all duration-200 space-y-3"
            >
              {/* Top Row: Camp Name & Score */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="text-base font-bold text-slate-900 truncate">
                  {evalItem?.camp_name}
                </h4>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#00AEEF] border border-blue-100 shrink-0 w-fit">
                  Score: {averageScore.toFixed(1)} / 10
                </span>
              </div>

              {/* Feedback Content */}
              <div className="flex items-start gap-3 bg-white p-3.5 rounded-lg border border-slate-200/60">
                <LuMessageSquareQuote className="text-[#00AEEF] text-xl shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {feedbackText}
                </p>
              </div>

              {/* Footer Meta */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                {evalItem?.submitted_at && (
                  <span className="flex items-center gap-1.5">
                    <LuCalendar className="text-slate-400" />
                    <span>{format(new Date(evalItem.submitted_at), "MMM d, yyyy")}</span>
                  </span>
                )}

                {evalItem?.evaluator_name && evalItem.evaluator_name !== "Anonymous Evaluator" && (
                  <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <LuUser className="text-slate-400" />
                    <span>Evaluator: {evalItem.evaluator_name}</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}