import { Progress } from "antd";

export default function PerformanceBreakdown() {
  const colors = [
    "#34A853",
    "#C49A2F",
    "#5C3DCC",
    "#B03035",
    "#2CB8B3",
    "#4CE78A",
  ];
  return (
    <section className="my-5 border border-border p-5 rounded-[10px]">
      <h3 className="text-xl font-medium mb-4">Performance Breakdown</h3>
      <div>
        {evaluationData.map((item, idx) => (
          <div key={idx} className="mb-3">
            <div className="flex items-center justify-between">
              <span className="">{item.label}</span>
              <span className="font-medium">{item.value}</span>
            </div>

            {/* Progress Bar */}
            {/* <div className="flex-1 px-4"> */}
            <Progress
              percent={(item.value / 10) * 100}
              showInfo={false}
              strokeColor={colors[idx % colors.length]}
              trailColor="#e5e7eb"
              strokeWidth={12}
            />
            {/* </div> */}
          </div>
        ))}
      </div>
    </section>
  );
}

const evaluationData = [
  { label: "Call/No Call Accuracy", value: 6 },
  { label: "Communication Skills", value: 7.3 },
  { label: "Court Position/Mechanics", value: 7.3 },
  { label: "Consistency of Calls", value: 7.3 },
  { label: "Fitness/Mobility", value: 7.3 },
  { label: "Game Awareness", value: 7.3 },

  // Levels
  { label: "NCAA DI", value: 6 },
  { label: "NCAA D2", value: 5.5 },
  { label: "NAIA", value: 4.3 },
  { label: "JUCO", value: 8.4 },
  { label: "HS,", value: 6.1 },
  { label: "JH/ELEM", value: 3.7 },
];
