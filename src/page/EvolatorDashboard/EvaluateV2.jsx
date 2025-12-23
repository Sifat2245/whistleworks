import BackBtn from "@/components/common/BackBtn";
import CommonSectionTitle from "@/components/dashboard/director_dashboard/CommonSectionTitle";
import EvaluationFormV2 from "@/components/dashboard/director_dashboard/Evaluate/EvaluationFormV2";
import EvaluationGuideline from "@/components/dashboard/director_dashboard/Evaluate/EvaluationGuideline";

const EvaluateV2 = ({ camp_id }) => {
    return (
        <div className="w-full pb-16">
            <BackBtn />

            <CommonSectionTitle
                text="Evaluate - Elite Officials Summer Cam 2024"
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