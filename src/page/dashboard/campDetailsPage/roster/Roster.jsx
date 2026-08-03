import RosterTabs from "@/page/dashboard/campDetailsPage/roster/components/RosterTabs";
import { useSearchParams } from "react-router-dom";
import Evaluator from "@/page/dashboard/campDetailsPage/roster/components/Evaluator";
import EvaluatorRefereeList from "./components/EvaluatorRefereeList";
import Crews from "./components/Crews";

export default function Roster({ camp_id }) {
  const [searchParams] = useSearchParams();
  const subTab = searchParams.get("subTab");
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
      <Crews camp_id={camp_id}/>
      )}
    </section>
  );
};