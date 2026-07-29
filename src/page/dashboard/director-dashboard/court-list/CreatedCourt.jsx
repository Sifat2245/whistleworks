import BackBtn from "@/components/common/BackBtn";
import CourtHeader from "@/page/dashboard/director-dashboard/court-list/components/CourtHeader";
import CourtLists from "@/page/dashboard/director-dashboard/court-list/components/CourtLists";
import useCampSchedule from "@/hooks/useCampSchedule";
import { useParams } from "react-router-dom";
import { useGetCampDetails } from "@/hooks/api/director-hooks/useCamps";

const CreatedCourt = () => {
  const { id } = useParams();
  const { data: campData } = useGetCampDetails(id);
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
