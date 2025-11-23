import Icon from "@/components/common/Icon";
import singleUser from "/referee/single-user-icon.svg";
import EvaluatorCard from "./EvaluatorCard";
import profile from "@/assets/dashboard/profile.png";

export default function Evaluator() {
  return (
      <section className="border border-border rounded-xl p-5">
        <div className="flex items-center justify-between border border-border p-5 rounded-[10px] mb-6">
          <div>
            <h3 className="text-xl font-medium mb-2.5">Camp Roster</h3>
            <p className="text-[#666666]">5 Referees</p>
          </div>
          <div className="bg-primary p-3.5 rounded-full">
            <Icon src={singleUser} className="size-5 text-white" />
          </div>
        </div>
        <div>
          {evaluators.map((evaluator) => (
            <EvaluatorCard key={evaluator.id} evaluator={evaluator} />
          ))}
        </div>
      </section>
  );
}

const evaluators = [
  {
    id: 1,
    name: "Sarah Mitchell",
    location: "Location",
    email: "sarah.j@email.com",
    phone: "6265162042",
    image: profile,
  },
  {
    id: 2,
    name: "Sarah Mitchell",
    location: "Location",
    email: "sarah.j@email.com",
    phone: "6265162042",
    image: profile,
  },
  {
    id: 3,
    name: "Sarah Mitchell",
    location: "Location",
    email: "sarah.j@email.com",
    phone: "6265162042",
    image: profile,
  },
];
