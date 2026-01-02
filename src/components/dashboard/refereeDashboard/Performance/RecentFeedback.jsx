// components/dashboard/refereeDashboard/Performance/RecentFeedback.jsx
import { format } from "date-fns";
import Icon from "@/components/common/Icon";
import success from "@/assets/svg/circel-check.svg";
import warning from "@/assets/svg/worning.svg";
import { Spin } from "antd";

export default function RecentFeedback({ evaluations = [], isLoading }) {
  if (isLoading) {
    return (
      <section className="border border-border p-5 rounded-[10px] flex justify-center items-center h-72">
        <Spin />
      </section>
    );
  }

  // Sort by submitted_at descending and take latest 10
  const recentEvals = [...evaluations]
    .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
    .slice(0, 10);

  if (recentEvals.length === 0) {
    return (
      <section className="border border-border p-5 rounded-[10px]">
        <h3 className="text-xl font-medium mb-5">Recent Feedback</h3>
        <p className="text-center text-gray-500 py-8">No feedback available yet.</p>
      </section>
    );
  }

  return (
    <section className="border border-border p-5 rounded-[10px]">
      <h3 className="text-xl font-medium mb-5">Recent Feedback</h3>
      <div className="h-72 overflow-y-auto pr-2">
        {recentEvals.map((evalItem) => {
          const isPositive = evalItem.average_score >= 7;
          const feedbackText = evalItem.referee_feedback || "No written feedback provided.";

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
                  {evalItem.camp.name} • {evalItem.average_score.toFixed(1)}/10
                </p>
                <p className="text-[14px] text-[#717182] mt-1">
                  {feedbackText}
                </p>
                <div className="flex items-center gap-3 mt-2 text-[14px]">
                  <span className="text-[#717182]">
                    {format(new Date(evalItem.submitted_at), "MMM d, yyyy")}
                  </span>
                  <span className="font-semibold text-black">
                    {evalItem.evaluator.name}
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