import BackBtn from "@/components/common/BackBtn";
import CourtHeader from "@/page/director-dashboard/court-list/components/CourtHeader";
import CourtLists from "@/page/director-dashboard/court-list/components/CourtLists";
import useCampSchedule from "@/hooks/useCampSchedule";
import { useLoaderData } from "react-router-dom";

const CreatedCourt = () => {
  const data = useLoaderData();
  const campData = data?.data?.data;
  const { scheduleData, isLoading } = useCampSchedule(campData?.id);

  return (
    <div className="w-full">
      <BackBtn />
      <CourtHeader
        campData={campData}
        scheduleData={scheduleData}
        isLoading={isLoading}
      />
      <CourtLists campData={campData} />
    </div>
  );
};
export default CreatedCourt;
