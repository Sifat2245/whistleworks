import BackBtn from "@/components/common/BackBtn";
import CommonSectionTitle from "@/components/common/CommonSectionTitle";
import EvaluationForm from "@/page/dashboard/director-dashboard/evaluate/components/EvaluationForm";
import EvaluationGuideline from "@/page/dashboard/director-dashboard/evaluate/components/EvaluationGuideline";
import { useGetCampDetails } from "@/hooks/api/director-hooks/useCamps";
import { useParams } from "react-router-dom";

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

      <CommonSectionTitle
        text={`Evaluate - ${campData?.camp_name || "Camp"}`}
        subText="Submit performance evaluations for referees"
      />
      <div className="flex flex-col lg:flex-row gap-6 mt-8">
        <div className="w-full lg:w-2/3">
          <EvaluationForm
            camp_id={camp_id}
            sports_type_name={campData?.sports_type_name}
          />
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