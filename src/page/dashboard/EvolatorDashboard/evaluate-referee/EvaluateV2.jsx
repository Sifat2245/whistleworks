import EvaluationFormV2 from "@/page/dashboard/EvolatorDashboard/evaluate-referee/components/EvaluationFormV2";
import EvaluationGuideline from "@/page/dashboard/director-dashboard/evaluate/components/EvaluationGuideline";

const EvaluateV2 = ({ camp_id, campName, sports_type_name }) => {
  return (
    <div className="w-full pb-16 font-sans">
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
          <EvaluationFormV2
            camp_id={camp_id}
            sports_type_name={sports_type_name}
          />
        </div>

        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <EvaluationGuideline />
        </div>
      </div>
    </div>
  );
};

export default EvaluateV2;