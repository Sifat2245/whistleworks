import BackBtn from "@/components/common/BackBtn";
import CommonSectionTitle from "@/components/common/CommonSectionTitle";
import EvaluationForm from "@/components/shared/evaluation/EvaluationForm";
import EvaluationGuideline from "@/page/dashboard/director-dashboard/evaluate/components/EvaluationGuideline";
import { useGetCampDetails } from "@/hooks/api/director-hooks/useCamps";
import { Link, useParams } from "react-router-dom";
import { LuClipboardList } from "react-icons/lu";

const EvaluateSkeleton = () => (
  <div className="w-full pb-12">
    <div className="mb-4">
      <div className="h-10 w-44 rounded-lg animate-pulse bg-slate-200" />
    </div>
    <div className="h-8 w-56 rounded-md animate-pulse bg-slate-200" />
    <div className="h-4 w-72 max-w-full mt-3 rounded-md animate-pulse bg-slate-200" />
    <div className="flex flex-col lg:flex-row gap-6 mt-8">
      <div className="w-full lg:w-2/3 h-96 rounded-[10px] border border-border bg-white animate-pulse" />
      <div className="w-full lg:w-1/3 h-72 rounded-[10px] border border-border bg-white animate-pulse" />
    </div>
  </div>
);

const Evaluate = () => {
  const { id: camp_id } = useParams();

  const { data: campData, isLoading } = useGetCampDetails(camp_id);

  if (isLoading) return <EvaluateSkeleton />;

  // Note: main ui component
  return (
    <div className="w-full pb-16">
      <BackBtn />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <CommonSectionTitle
          text={`Evaluate - ${campData?.camp_name || "Camp"}`}
          subText="Submit performance evaluations for referees"
        />
        <Link
          to={`/director-dashboard/evaluation/${camp_id}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-white border border-slate-200 hover:border-[#00AEEF] hover:text-[#00AEEF] text-slate-700 shadow-xs transition-colors self-start sm:self-auto"
        >
          <LuClipboardList className="text-base" />
          <span>View Submitted Evaluations</span>
        </Link>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 mt-8">
        <div className="w-full lg:w-2/3">
          <EvaluationForm campId={camp_id} />
        </div>

        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          {/* <OverallScore /> */}
          <EvaluationGuideline />
        </div>
      </div>
    </div>
  );
};
export default Evaluate;