import BackBtn from "@/components/common/BackBtn";
import CommonSectionTitle from "@/components/dashboard/director_dashboard/CommonSectionTitle";
import EvaluationForm from "@/components/dashboard/director_dashboard/Evaluate/EvaluationForm";
import EvaluationGuideline from "@/components/dashboard/director_dashboard/Evaluate/EvaluationGuideline";
import OverallScore from "@/components/dashboard/director_dashboard/Evaluate/OverallScore";

const Evaluate = ({ camp_id }) => {
  return (
    <div className="w-full pb-16">
      <BackBtn />

      <CommonSectionTitle
        text="Evaluate - Elite Officials Summer Cam 2024"
        subText="Submit performance evaluations for referees"
      />
      <div className="flex flex-col lg:flex-row gap-6 mt-10">
        <div className="w-full lg:w-2/3">
          <EvaluationForm camp_id={camp_id} />
        </div>

        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <OverallScore />
          <EvaluationGuideline />
        </div>
      </div>
    </div>
  );
};
export default Evaluate;