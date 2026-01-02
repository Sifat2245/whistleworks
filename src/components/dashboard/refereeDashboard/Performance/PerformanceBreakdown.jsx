// components/dashboard/refereeDashboard/Performance/PerformanceBreakdown.jsx
import { Progress, Spin } from "antd";

const CRITERIA_LABELS = {
  call_accuracy: "Call/No Call Accuracy",
  communication_skills: "Communication Skills",
  consistency_of_calls: "Consistency of Calls",
  court_position_mechanics: "Court Position/Mechanics",
  fitness_mobility: "Fitness/Mobility",
  game_awareness: "Game Awareness",
};

const COLORS = ["#34A853", "#C49A2F", "#5C3DCC", "#B03035", "#2CB8B3", "#4CE78A"];

export default function PerformanceBreakdown({ evaluations = [], isLoading }) {
  if (isLoading) {
    return (
      <section className="my-5 border border-border p-5 rounded-[10px] flex justify-center items-center">
        <Spin />
      </section>
    );
  }

  if (evaluations.length === 0) {
    return (
      <section className="my-5 border border-border p-5 rounded-[10px]">
        <h3 className="text-xl font-medium mb-4">Performance Breakdown</h3>
        <p className="text-gray-500 text-center py-8">No evaluations available yet.</p>
      </section>
    );
  }

  // Calculate average for each criterion
  const criteriaAverages = {};
  const criteriaKeys = Object.keys(CRITERIA_LABELS);

  criteriaKeys.forEach((key) => {
    const values = evaluations
      .map((ev) => ev.performance_criteria[key])
      .filter((v) => v !== undefined);
    if (values.length > 0) {
      criteriaAverages[key] = values.reduce((a, b) => a + b, 0) / values.length;
    }
  });

  return (
    <section className="my-5 border border-border p-5 rounded-[10px]">
      <h3 className="text-xl font-medium mb-6">Performance Breakdown</h3>
      <div className="space-y-5">
        {criteriaKeys.map((key, idx) => {
          const avg = criteriaAverages[key]?.toFixed(1) || "—";
          if (avg === "—") return null;

          return (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">{CRITERIA_LABELS[key]}</span>
                <span className="font-bold text-lg">{avg}/10</span>
              </div>
              <Progress
                percent={(criteriaAverages[key] / 10) * 100}
                showInfo={false}
                strokeColor={COLORS[idx % COLORS.length]}
                trailColor="#e5e7eb"
                strokeWidth={12}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}