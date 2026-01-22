import BackBtn from "@/components/common/BackBtn";
import CommonSectionTitle from "@/components/dashboard/director_dashboard/CommonSectionTitle";
import EvaluationForm from "@/components/dashboard/director_dashboard/Evaluate/EvaluationForm";
import EvaluationGuideline from "@/components/dashboard/director_dashboard/Evaluate/EvaluationGuideline";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const Evaluate = () => {
  const { id: camp_id } = useParams();
  const axiosInstance = useAxiosSecure()

   const {data: campData} = useQuery({
    queryKey: ["camp-details"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/v1/camp/details/${camp_id}`)
      return response?.data?.data;
    }
  })

  // Note: main ui component
  return (
    <div className="w-full pb-16">
      <BackBtn />

      <CommonSectionTitle
        text={`Evaluate - ${campData?.camp_name}`}
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