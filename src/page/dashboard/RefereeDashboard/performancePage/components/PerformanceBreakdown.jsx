import { Progress } from "antd";

const CRITERIA_LABELS = {
  call_accuracy: "Call/No Call Accuracy",
  communication_skills: "Communication Skills",
  consistency_of_calls: "Consistency of Calls",
  court_position_mechanics: "Court Position/Mechanics",
  fitness_mobility: "Fitness/Mobility",
  game_awareness: "Game Awareness",
};

const COLORS = [
  "#00AEEF", // WhistleWorks Cyan
  "#10B981", // Emerald Green
  "#8B5CF6", // Purple
  "#F59E0B", // Amber
  "#3B82F6", // Blue
  "#EC4899", // Pink
];

export default function PerformanceBreakdown({
  breakdown,
  hasEvaluations,
  recommendedLevel = [],
  levels = [],
}) {
  const totalRecommendations =
    recommendedLevel.reduce((sum, item) => sum + item.count, 0) || 1;

  const levelCounts = new Map(
    recommendedLevel.map((item) => [item.level, item.count])
  );

  return (
    <div className="w-full bg-white rounded-xl border border-[#E8E8E8] md:p-6 p-4 shadow-xs font-sans space-y-8">
      {/* ── 1. Criteria Breakdown ─────────────────────────────── */}
      <div>
        <div className="border-b border-[#E8E8E8] pb-3 mb-6">
          <h3 className="text-xl md:text-2xl font-semibold text-[#333]">
            Performance Category Breakdown
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Detailed scoring metrics across key officiating evaluation criteria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(CRITERIA_LABELS).map((key, idx) => {
            const score = hasEvaluations ? (breakdown?.[key]?.score || 0) : 0;
            const avg = score.toFixed(1);
            const percent = (score / 10) * 100;

            return (
              <div
                key={key}
                className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-800">
                    {CRITERIA_LABELS[key]}
                  </span>
                  <span className="font-bold text-sm sm:text-base text-slate-900 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                    {avg} <span className="text-xs font-normal text-slate-400">/ 10</span>
                  </span>
                </div>

                <Progress
                  percent={percent}
                  showInfo={false}
                  strokeColor={COLORS[idx % COLORS.length]}
                  trailColor="#e2e8f0"
                  strokeWidth={10}
                  className="m-0"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 2. Recommended Levels ────────────────────────────── */}
      <div className="pt-4 border-t border-[#E8E8E8]">
        <div className="border-b border-[#E8E8E8] pb-3 mb-6">
          <h3 className="text-xl md:text-2xl font-semibold text-[#333]">
            Recommended Officiating Level
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Evaluator assessment recommendations for competition placement.
          </p>
        </div>

        <div className="space-y-4">
          {levels.map((level, idx) => {
            const count = levelCounts.get(level) || 0;
            const percent = hasEvaluations ? (count / totalRecommendations) * 100 : 0;

            return (
              <div
                key={level}
                className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-semibold text-slate-800">{level}</span>
                  <span className="font-medium text-slate-600">
                    {count} evaluation{count !== 1 ? "s" : ""} ({percent.toFixed(0)}%)
                  </span>
                </div>

                <Progress
                  percent={percent}
                  showInfo={false}
                  strokeColor={COLORS[idx % COLORS.length]}
                  trailColor="#e2e8f0"
                  strokeWidth={10}
                  className="m-0"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
