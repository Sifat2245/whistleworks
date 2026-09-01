import RosterTabs from "@/page/dashboard/campDetailsPage/roster/components/RosterTabs";
import { useSearchParams } from "react-router-dom";
import Evaluator from "@/page/dashboard/campDetailsPage/roster/components/Evaluator";
import EvaluatorRefereeList from "./components/EvaluatorRefereeList";
import Crews from "./components/Crews";

export default function Roster({ camp_id }) {
  const [searchParams] = useSearchParams();
  const subTab = searchParams.get("subTab") || "evaluator";

  return (
    <section className="w-full space-y-6 font-sans">
      {/* Roster Navigation Sub-Tabs */}
      <div className="flex justify-end">
        <RosterTabs activeSubTab={subTab} />
      </div>

      {/* Sub-Tab Content Views */}
      {subTab === "evaluator" && <Evaluator camp_id={camp_id} />}
      {subTab === "referee" && <EvaluatorRefereeList camp_id={camp_id} />}
      {subTab === "crews" && <Crews camp_id={camp_id} />}
    </section>
  );
}