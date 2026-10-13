import EvaluationsList from "@/components/shared/evaluation/EvaluationsList";

export default function EvaluatorEvaluationTab({ campId, campName }) {
  return (
    <div className="w-full">
      <div className="bg-white rounded-xl border border-[#E8E8E8] md:p-6 p-4 shadow-xs mb-6 font-sans">
        <h2 className="text-xl md:text-2xl font-semibold text-[#333]">
          Submitted Evaluations
          {campName && <span className="text-[#00AEEF]"> — {campName}</span>}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Review all referee official performance evaluations you have submitted for this camp.
        </p>
      </div>

      <EvaluationsList
        campId={campId}
        campName={campName}
        evaluatePath="?tab=evaluate"
        role="evaluator"
      />
    </div>
  );
}
