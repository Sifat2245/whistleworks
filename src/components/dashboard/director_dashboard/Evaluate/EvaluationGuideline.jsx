"use client";

import { FaCircleCheck } from "react-icons/fa6";

const EvaluationGuideline = () => {
  const guidelines = [
    "Rate each category from 1-10",
    "Be objective and fair",
    "Provide specific examples in comments",
    "Focus on improvement areas",
    "Acknowledge strengths",
  ];

  return (
    <div className="w-full bg-[#E6F7FD] border border-[#b3e5f3] rounded-xl p-6">
      <h3 className="text-lg font-semibold text-black mb-3">
        Evaluation Guidelines
      </h3>

      <ul className="flex flex-col gap-2">
        {guidelines.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-black/80 text-sm">
            <FaCircleCheck className="text-[#0A9FF6] mt-[3px]" size={14} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EvaluationGuideline;
