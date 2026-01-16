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
  "#34A853", // green
  "#C49A2F", // gold
  "#5C3DCC", // purple
  "#B03035", // red
  "#2CB8B3", // teal
  "#4CE78A", // light green
];

// Define all possible recommended levels in desired order
const RECOMMENDED_LEVELS = [
  "NCAA D1",
  "NCAA D2",
  "NAIA",
  "JUCO",
  "HS",
  "JH/ELEM",
];

export default function PerformanceBreakdown({
  breakdown,
  hasEvaluations,
  recommendedLevel = [],
}) {
  // Total recommendations (used for percentage calculation)
  const totalRecommendations =
    recommendedLevel.reduce((sum, item) => sum + item.count, 0) || 1;

  // Create a map for quick lookup of counts
  const levelCounts = new Map(
    recommendedLevel.map((item) => [item.level, item.count])
  );

  if (!hasEvaluations) {
    return (
      <section className="my-5 border border-border p-5 rounded-[10px]">
        <h3 className="text-xl font-medium mb-6">Performance Breakdown</h3>
        <div className="space-y-5">
          {Object.keys(CRITERIA_LABELS).map((key, idx) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">
                  {CRITERIA_LABELS[key]}
                </span>
                <span className="font-bold text-lg">0.0/10</span>
              </div>
              <Progress
                percent={0}
                showInfo={false}
                strokeColor={COLORS[idx % COLORS.length]}
                strokeWidth={12}
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="my-5 border border-border p-5 rounded-[10px] space-y-10">
      {/* 1. Performance Breakdown (criteria scores) */}
      <div>
        <h3 className="text-xl font-medium mb-6">Performance Breakdown</h3>
        <div className="space-y-5">
          {Object.keys(CRITERIA_LABELS).map((key, idx) => {
            const score = breakdown?.[key]?.score || 0;
            const avg = score.toFixed(1);

            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">
                    {CRITERIA_LABELS[key]}
                  </span>
                  <span className="font-bold text-lg">{avg}/10</span>
                </div>
                <Progress
                  percent={(score / 10) * 100}
                  showInfo={false}
                  strokeColor={COLORS[idx % COLORS.length]}
                  trailColor="#e5e7eb"
                  strokeWidth={12}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-medium mb-6">Recommended Level</h3>
        <div className="space-y-5">
          {RECOMMENDED_LEVELS.map((level, idx) => {
            // Get count from data or default to 0
            const count = levelCounts.get(level) || 0;
            const percent = (count / totalRecommendations) * 100;

            return (
              <div key={level} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{level}</span>
                  <span className="font-bold text-lg">
                    {count} evaluation{count !== 1 ? "s" : ""}
                  </span>
                </div>
                <Progress
                  percent={percent}
                  showInfo={false}
                  strokeColor={COLORS[idx % COLORS.length]}
                  trailColor="#e5e7eb"
                  strokeWidth={12}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
