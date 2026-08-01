import SectionCard from "@/components/common/SectionCard";
import { LuListChecks, LuShieldCheck } from "react-icons/lu";

const EvaluationGuideline = () => {
  const guidelines = [
    "Rate each category from 1-10",
    "Be objective and fair",
    "Provide specific examples in comments",
    "Focus on improvement areas",
    "Acknowledge strengths",
  ];

  const scoreScale = [
    { range: "9-10", label: "Excellent", color: "bg-green-100 text-green-700" },
    { range: "7-8", label: "Proficient", color: "bg-blue-100 text-blue-700" },
    { range: "4-6", label: "Developing", color: "bg-amber-100 text-amber-700" },
    { range: "1-3", label: "Needs Work", color: "bg-red-100 text-red-600" },
  ];

  return (
    <SectionCard
      icon={<LuListChecks />}
      title="Evaluation Guidelines"
      description="Tips for fair and consistent scoring"
    >
      <div className="p-5 sm:p-6 flex flex-col gap-6">
        <ul className="flex flex-col gap-2.5">
          {guidelines.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-[#555] text-sm leading-relaxed"
            >
              <span className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center text-[11px] font-semibold shrink-0 mt-0.5">
                {index + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Score scale legend */}
        <div className="border-t border-border pt-5">
          <div className="flex items-center gap-2 mb-3">
            <LuShieldCheck className="text-primary text-lg" />
            <h4 className="font-medium text-[#333] text-sm">
              Score Scale Reference
            </h4>
          </div>
          <div className="flex flex-col gap-2">
            {scoreScale.map((item) => (
              <div
                key={item.range}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
              >
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.color}`}
                >
                  {item.range}
                </span>
                <span className="text-sm text-[#666]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default EvaluationGuideline;
