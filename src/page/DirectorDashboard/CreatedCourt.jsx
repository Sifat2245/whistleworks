import BackBtn from "@/components/common/BackBtn";
import CourtDetails from "@/components/dashboard/director_dashboard/created_court/CourtDetails";
import CourtHeader from "@/components/dashboard/director_dashboard/created_court/CourtHeader";
import CourtLists from "@/components/dashboard/director_dashboard/created_court/CourtLists";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";

const CreatedCourt = () => {
  const data = useLoaderData();
  const campData = data?.data?.data;

  const axiosInstance = useAxiosSecure();

  const { data: scheduleData } = useQuery({
    queryKey: ["court-info"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/v1/camp/${campData?.id}/schedule`);
      return response?.data?.data;
    },
  });

  
  return (
    <div className="w-full">
      <BackBtn />
      <CourtHeader campData={campData} />
      <CourtDetails scheduleData={scheduleData} />
      <CourtLists campData={campData}/>
    </div>
  );
};
export default CreatedCourt;
