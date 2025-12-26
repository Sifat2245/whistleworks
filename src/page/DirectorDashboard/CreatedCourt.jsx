import BackBtn from "@/components/common/BackBtn";
import CourtDetails from "@/components/dashboard/director_dashboard/created_court/CourtDetails";
import CourtHeader from "@/components/dashboard/director_dashboard/created_court/CourtHeader";
import CourtLists from "@/components/dashboard/director_dashboard/created_court/CourtLists";
import useCampSchedule from "@/hooks/useCampSchedule";
import { useLoaderData } from "react-router-dom";

const CreatedCourt = () => {
  const data = useLoaderData();
  const campData = data?.data?.data;
  const {scheduleData, isLoading} = useCampSchedule(campData?.id);

  
  
  return (
    <div className="w-full">
      <BackBtn />
      <CourtHeader campData={campData} />
      <CourtDetails scheduleData={scheduleData} isLoading={isLoading} />
      <CourtLists campData={campData}/>
    </div>
  );
};
export default CreatedCourt;
