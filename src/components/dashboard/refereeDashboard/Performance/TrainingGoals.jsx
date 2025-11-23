import Icon from "@/components/common/Icon";
import success from "@/assets/svg/circel-check.svg";
import warning from "@/assets/svg/worning.svg"; 

export default function TrainingGoals() {
  return (
    <section className="border border-border p-5 rounded-[10px] mt-4">
      <h3 className="text-xl font-medium mb-5">Training Goals</h3>
      <div className="h-76 overflow-y-auto">
        {trainingGoalsData.map((goal) => (
          <div
            key={goal.id}
            className="bg-[#F5F5F5] py-2.5 px-3 rounded-lg mb-3 flex gap-3 last:mb-0"
          >
            <div
              className={`${
                goal.status === "success" ? "bg-[#DCFCE7]" : "bg-[#FFEDD4]"
              } p-2 rounded-[10px] h-fit`}
            >
              <Icon
                src={goal.status === "success" ? success : warning}
                className="size-5"
              />
            </div>
            <div>
              <p>{goal.title}</p>
              <p className="text-[14px] text-[#717182]">
                {goal.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const trainingGoalsData = [
  {
    id: 1,
    status: "success",
    title: "Complete 5 game reviews",
    description: "5/5 completed",
  },
  {
    id: 2,
    status: "warning",
    title: "Attend all training sessions",
    description: "3/5 completed",
  },
  {
    id: 3,
    status: "success",
    title: "Complete 5 game reviews",
    description: "5/5 completed",
  },
  {
    id: 4,
    status: "warning",
    title: "Complete 5 game reviews",
    description: "4/5 completed",
  },
  {
    id: 5,
    status: "warning",
    title: "Attend all training sessions",
    description: "2/5 completed",
  },
];
