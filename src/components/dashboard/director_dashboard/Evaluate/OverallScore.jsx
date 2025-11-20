"use client";

import { FaStar } from "react-icons/fa6";

const OverallScore = () => {
  const score = 7; // replace later with dynamic value
  const details = [
    { label: "Call/No Call Accuracy", value: 7 },
    { label: "Communication Skills", value: 7 },
    { label: "Consistency of Calls ", value: 7 },
    { label: "Court Position/Mechanics ", value: 7 },
    { label: "Fitness/Mobility ", value: 7 },
    { label: "Game Awareness ", value: 7 },
  ];

  return (
    <div className="w-full bg-white border border-black/10 rounded-xl p-6 shadow-sm">
      {/* Title */}
      <h3 className="text-lg font-semibold text-black mb-2">Overall Score</h3>

      {/* Score */}
      <div className="text-center">
        <p className="text-4xl font-bold text-[#0A9FF6]">{score.toFixed(1)}</p>

        {/* Stars */}
        <div className="flex justify-center items-center gap-1 mt-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={20}
              className={star <= Math.round(score / 2) ? "text-yellow-400" : "text-gray-300"}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-4"></div>

      {/* Details List */}
      <div className="flex flex-col gap-2">
        {details.map((item, index) => (
          <div
            key={index}
            className="flex justify-between text-sm gap-62 text-black/80"
          >
            <span>{item.label}</span>
            <span className="font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverallScore;
