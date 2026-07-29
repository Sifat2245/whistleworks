import BackBtn from "@/components/common/BackBtn";
import CommonSectionTitle from "@/components/common/CommonSectionTitle";
import EvaluationForm from "@/page/dashboard/director-dashboard/evaluate/components/EvaluationForm";
import EvaluationGuideline from "@/page/dashboard/director-dashboard/evaluate/components/EvaluationGuideline";
import { useGetCampDetails } from "@/hooks/api/director-hooks/useCamps";
import { useParams } from "react-router-dom";

const Evaluate = () => {
  const { id: camp_id } = useParams();

  const { data: campData, isLoading } = useGetCampDetails(camp_id);

  // Note: main ui component
  return (
    <div className="w-full pb-16">
      <BackBtn />

      <CommonSectionTitle
        text={`Evaluate - ${isLoading ? "..." : campData?.camp_name}`}
        subText="Submit performance evaluations for referees"
      />
      <div className="flex flex-col lg:flex-row gap-6 mt-10">
        <div className="w-full lg:w-2/3">
          <EvaluationForm camp_id={camp_id} />
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