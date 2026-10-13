import { useParams } from "react-router-dom";
import BackBtn from "@/components/common/BackBtn";
import CommonSectionTitle from "@/components/common/CommonSectionTitle";
import { useGetCampDetails } from "@/hooks/api/director-hooks/useCamps";
import EvaluationsList from "@/components/shared/evaluation/EvaluationsList";

const EvaluationPageSkeleton = () => (
  <div className="w-full pb-12 font-sans">
    <div className="mb-4">
      <div className="h-10 w-40 rounded-lg animate-pulse bg-slate-200" />
    </div>
    <div className="h-8 w-64 rounded-md animate-pulse bg-slate-200 mb-2" />
    <div className="h-4 w-80 rounded-md animate-pulse bg-slate-200 mb-8" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="h-28 rounded-xl bg-slate-100 animate-pulse" />
      <div className="h-28 rounded-xl bg-slate-100 animate-pulse" />
      <div className="h-28 rounded-xl bg-slate-100 animate-pulse" />
    </div>
    <div className="h-96 rounded-xl bg-slate-100 animate-pulse" />
  </div>
);

export default function DirectorEvaluationPage() {
  const { id: campId } = useParams();
  const { data: campData, isLoading } = useGetCampDetails(campId);

  if (isLoading) return <EvaluationPageSkeleton />;

  return (
    <div className="w-full pb-16 font-sans">
      <BackBtn />

      <CommonSectionTitle
        text={`Camp Evaluations - ${campData?.camp_name || "Camp"}`}
        subText="Review and manage referee evaluations submitted for this camp"
      />

      <div className="mt-6">
        <EvaluationsList
          campId={campId}
          campName={campData?.camp_name}
          evaluatePath={`/director-dashboard/evaluate/${campId}`}
          role="director"
        />
      </div>
    </div>
  );
}
