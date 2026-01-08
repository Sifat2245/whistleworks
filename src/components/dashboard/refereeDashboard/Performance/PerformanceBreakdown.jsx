import { Progress } from "antd";

const CRITERIA_LABELS = {
  call_accuracy: "Call/No Call Accuracy",
  communication_skills: "Communication Skills",
  consistency_of_calls: "Consistency of Calls",
  court_position_mechanics: "Court Position/Mechanics",
  fitness_mobility: "Fitness/Mobility",
  game_awareness: "Game Awareness",
};

const COLORS = ["#34A853", "#C49A2F", "#5C3DCC", "#B03035", "#2CB8B3", "#4CE78A"];

export default function PerformanceBreakdown({ breakdown, hasEvaluations }) {
  if (!hasEvaluations) {
    return (
      <section className="my-5 border border-border p-5 rounded-[10px]">
        <h3 className="text-xl font-medium mb-6">Performance Breakdown</h3>
        <div className="space-y-5">
          {Object.keys(CRITERIA_LABELS).map((key, idx) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">{CRITERIA_LABELS[key]}</span>
                <span className="font-bold text-lg">0.0/10</span>
              </div>
              <Progress percent={0} showInfo={false} strokeColor={COLORS[idx % COLORS.length]} strokeWidth={12} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="my-5 border border-border p-5 rounded-[10px]">
      <h3 className="text-xl font-medium mb-6">Performance Breakdown</h3>
      <div className="space-y-5">
        {Object.keys(CRITERIA_LABELS).map((key, idx) => {
          const score = breakdown[key]?.score || 0;
          const avg = score.toFixed(1);

          return (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">{CRITERIA_LABELS[key]}</span>
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
    </section>
  );
}