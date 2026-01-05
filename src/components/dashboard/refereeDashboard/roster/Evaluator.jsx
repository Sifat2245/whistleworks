import Icon from "@/components/common/Icon";
import singleUser from "/referee/single-user-icon.svg";
import EvaluatorCard from "./EvaluatorCard";
// import profile from "@/assets/dashboard/profile.png";
import useGetRoaseter from "@/hooks/get-roaster";

export default function Evaluator({ camp_id }) {
  const { roasterData } = useGetRoaseter(camp_id);
  const { evaluators } = roasterData || {};

  // console.log(evaluators, "evaluators");

  // Note: main ui component
  return (
    <section className="border border-border rounded-xl p-5">
      <div className="flex items-center justify-between border border-border p-5 rounded-[10px] mb-6">
        <h3 className="text-xl font-medium mb-2.5">
          Evaluators ({evaluators?.length || "0"})
        </h3>
        <div className="bg-primary p-3.5 rounded-full">
          <Icon src={singleUser} className="size-5 text-white" />
        </div>
      </div>

      <div className="w-full grid grid-cols-4 gap-6">
        {evaluators?.length > 0 ? (
          evaluators?.map((evaluator) => (
            <EvaluatorCard key={evaluator?.id} evaluator={evaluator} />
          ))
        ) : (
          <div className="col-span-4 text-center py-12">
            <p>No evaluators have submitted evaluations yet</p>
          </div>
        )}
      </div>
    </section>
  );
}
