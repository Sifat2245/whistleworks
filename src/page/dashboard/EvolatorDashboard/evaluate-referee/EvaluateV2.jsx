import BackBtn from "@/components/common/BackBtn";
import CommonSectionTitle from "@/components/common/CommonSectionTitle";
import EvaluationFormV2 from "@/page/dashboard/EvolatorDashboard/evaluate-referee/components/EvaluationFormV2";
import EvaluationGuideline from "@/page/dashboard/director-dashboard/evaluate/components/EvaluationGuideline";

const EvaluateV2 = ({ camp_id, campName }) => {
    return (
        <div className="w-full pb-16">
            <BackBtn />

            <CommonSectionTitle
                text={`Evaluate - ${campName}`}
                subText="Submit performance evaluations for referees"
            />
            <div className="flex flex-col lg:flex-row gap-6 mt-10">
                <div className="w-full lg:w-2/3">
                    <EvaluationFormV2 camp_id={camp_id} />
                </div>

                <div className="w-full lg:w-1/3 flex flex-col gap-6">
                    {/* <OverallScore /> */}
                    <EvaluationGuideline />
                </div>
            </div>
        </div>
    );
};
export default EvaluateV2;