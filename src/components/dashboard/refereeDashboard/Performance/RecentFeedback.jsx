import Icon from "@/components/common/Icon";
import success from "@/assets/svg/circel-check.svg";
import warning from "@/assets/svg/worning.svg";

export default function RecentFeedback() {
  return (
    <section className="border border-border p-5 rounded-[10px]">
      <h3 className="text-xl font-medium mb-5">Recent Feedback</h3>
      <div className="h-72 overflow-y-auto">
        {feedbackData.map((feedback) => (
          <div
            key={feedback.id}
            className="bg-[#F5F5F5] py-2.5 px-3 rounded-lg mb-3 flex gap-3 last:mb-0"
          >
            <div className={`${feedback.status === "success" ? "bg-[#DCFCE7]" : "bg-[#FFEDD4]"} p-2 rounded-[10px] h-fit`}>
              <Icon
                src={feedback.status === "success" ? success : warning}
                className="size-5"
              />
            </div>
            <div>
              <p>{feedback.title}</p>
              <p className="text-[14px] text-[#717182]">
                {feedback.description}
              </p>
              <p className="text-[14px] text-[#717182]">{feedback.date}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const feedbackData = [
  {
    id: 1,
    status: "success", // For positive feedback (Green checkmark)
    title: "Excellent Game Management",
    description: "Strong control during high-pressure situations",
    date: "Oct 28, 2025",
  },
  {
    id: 2,
    status: "warning", // For areas needing improvement (Orange warning circle)
    title: "Positioning Adjustment Needed",
    description: "Work on angles during corner kicks",
    date: "Oct 26, 2025",
  },
  {
    id: 3,
    status: "success",
    title: "Clear Communication",
    description: "Well-explained decisions to players",
    date: "Oct 28, 2025",
  },
  {
    id: 4,
    status: "warning", // For observations or neutral notes (Blue info circle)
    title: "Midfield Press Effectiveness",
    description: "High success rate on the left flank press in the second half",
    date: "Oct 27, 2025",
  },
  {
    id: 5,
    status: "warning", // For critical errors or mistakes (Red cross circle)
    title: "Early Substitution Timing",
    description:
      "The early defensive substitution led to a temporary loss of midfield control",
    date: "Oct 25, 2025",
  },
];
