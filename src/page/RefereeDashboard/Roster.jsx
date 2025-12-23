import RosterTabs from "@/components/dashboard/refereeDashboard/roster/RosterTabs";
import { useSearchParams } from "react-router-dom";
import Evaluator from "@/components/dashboard/refereeDashboard/roster/Evaluator";
import EvaluatorRefereeList from "../EvolatorDashboard/EvaluatorRefereeList";

export default function Roster({ camp_id }) {
  const [searchParams] = useSearchParams();
  const subTab = searchParams.get("subTab");
  console.log("Current subTab:", subTab);
  return (
    <section>
      <div className="flex justify-end mb-5">
        <RosterTabs />
      </div>
      {subTab === "evaluator" && <Evaluator camp_id={camp_id} />}
      {subTab === "referee" && (
        <div className="border border-border rounded-xl p-5 min-h-[calc(100vh-400px)]">
          <EvaluatorRefereeList camp_id={camp_id} />
        </div>
      )}
      {subTab === "crews" && (
        <div className="border border-border rounded-xl p-5 text-[#666666] min-h-[calc(100vh-400px)] flex items-center justify-center text-3xl font-semibold">
          Coming Soon
        </div>
      )}
    </section>
  );
};