import { Link } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import EvaluationForm from "@/components/shared/evaluation/EvaluationForm";
import EvaluationGuideline from "@/page/dashboard/director-dashboard/evaluate/components/EvaluationGuideline";

const EvaluateV2 = ({ camp_id, campName }) => {
  return (
    <div className="w-full pb-16 font-sans">
      <div className="mb-4">
        <Link
          to="?tab=evaluation"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#00AEEF] transition-colors"
        >
          <LuArrowLeft className="text-sm" />
          <span>Back to Submitted Evaluations</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[#E8E8E8] md:p-6 p-4 shadow-xs mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-[#333]">
          Evaluate Referee Officials
          {campName && <span className="text-[#00AEEF]"> — {campName}</span>}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Submit performance ratings, written feedback, and recommended officiating levels.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3">
          <EvaluationForm campId={camp_id} />
        </div>

        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <EvaluationGuideline />
        </div>
      </div>
    </div>
  );
};

export default EvaluateV2;