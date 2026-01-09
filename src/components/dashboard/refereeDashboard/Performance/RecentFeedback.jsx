// components/dashboard/refereeDashboard/Performance/RecentFeedback.jsx
import { format } from "date-fns";
import Icon from "@/components/common/Icon";
import success from "@/assets/svg/circel-check.svg";
import warning from "@/assets/svg/worning.svg";

export default function RecentFeedback({ feedbackList = [] }) {
  // No separate isLoading here – loading is handled in parent

  if (feedbackList.length === 0) {
    return (
      <section className="border border-border p-5 rounded-[10px]">
        <h3 className="text-xl font-medium mb-5">Recent Feedback</h3>
        <p className="text-center text-gray-500 py-8">No feedback available yet.</p>
      </section>
    );
  }

  // Sort by submitted_at descending and take latest 10 (already sorted in sample, but safe)
  const recentEvals = [...feedbackList]
    .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
    .slice(0, 10);

  return (
    <section className="border border-border p-5 rounded-[10px]">
      <h3 className="text-xl font-medium mb-5">Recent Feedback</h3>
      <div className="h-72 overflow-y-auto pr-2">
        {recentEvals.map((evalItem) => {
          // Calculate average score: total_score / max_score * 10 → x.x/10
          const averageScore = (evalItem?.total_score / evalItem?.max_score) * 10;
          const isPositive = averageScore >= 7;
          const feedbackText = evalItem?.feedback || "No written feedback provided.";

          return (
            <div
              key={evalItem.id}
              className="bg-[#F5F5F5] py-3 px-4 rounded-lg mb-3 flex gap-3 last:mb-0"
            >
              <div
                className={`${
                  isPositive ? "bg-[#DCFCE7]" : "bg-[#FFEDD4]"
                } p-2.5 rounded-[10px] h-fit`}
              >
                <Icon
                  src={isPositive ? success : warning}
                  className="size-6"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium">
                  {evalItem?.camp_name} • {averageScore.toFixed(1)}/10
                </p>
                <p className="text-[14px] text-[#717182] mt-1">
                  {feedbackText}
                </p>
                <div className="flex items-center gap-3 mt-2 text-[14px]">
                  <span className="text-[#717182]">
                    {format(new Date(evalItem?.submitted_at), "MMM d, yyyy")}
                  </span>
                  <span className="font-semibold text-black">
                    {evalItem?.evaluator_name === 'Anonymous Evaluator' ? '' : evalItem?.evaluator_name}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}