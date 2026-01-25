"use client";

import { FaStar } from "react-icons/fa6";

const OverallScore = () => {
  const score = 7; // replace later with dynamic value
  const details = [
    { label: "Call/No Call Accuracy", value: 2 },
    { label: "Communication Skills", value: 10 },
    { label: "Consistency of Calls", value: 5 },
    { label: "Court Position/Mechanics", value: 7 },
    { label: "Fitness/Mobility", value: 9 },
    { label: "Game Awareness", value: 7 },
  ];

  return (
    <div className="w-full bg-white border border-black/10 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-sm">
      {/* Title */}
      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-black mb-2 sm:mb-3">
        Overall Score
      </h3>

      {/* Score and Stars Container */}
      <div className="text-center mb-3 sm:mb-4 md:mb-6">
        {/* Score */}
        <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#0A9FF6]">
          {score.toFixed(1)}
        </p>

        {/* Stars */}
        <div className="flex justify-center items-center gap-0.5 sm:gap-1 md:gap-1.5 mt-2 sm:mt-3 md:mt-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`
                ${star <= Math.round(score / 2) ? "text-yellow-400" : "text-gray-300"}
                w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7
              `}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-3 sm:my-4 md:my-5 lg:my-6"></div>

      {/* Details List */}
      <div className="flex flex-col gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3">
        {details.map((item, index) => (
          <div
            key={index}
            className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 xs:gap-2"
          >
            {/* Label  */}
            <span className="text-xs sm:text-sm md:text-base text-black/80 truncate">
              {item.label}
            </span>

            {/* Value */}
            <div className="flex items-center gap-2">
              {/* Add a visual indicator for the value */}
              <div className="hidden xs:block w-16 sm:w-20 md:w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0A9FF6] rounded-full"
                  style={{ width: `${(item.value / 10) * 100}%` }}
                />
              </div>

              {/* Value text */}
              <span className="text-sm sm:text-base md:text-lg font-medium min-w-6 text-right">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary for small screens */}
      <div className="mt-4 sm:mt-5 md:hidden text-center">
        <p className="text-xs text-gray-500">
          Score out of 10 • {score >= 7 ? "Good" : score >= 5 ? "Average" : "Needs Improvement"}
        </p>
      </div>
    </div>
  );
};

export default OverallScore;