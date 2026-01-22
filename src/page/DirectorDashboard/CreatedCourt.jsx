import CourtHeader from "@/components/dashboard/director_dashboard/created_court/CourtHeader";
import CourtLists from "@/components/dashboard/director_dashboard/created_court/CourtLists";
import useCampSchedule from "@/hooks/useCampSchedule";
import { LuMoveLeft } from "react-icons/lu";
import { useLoaderData, useNavigate } from "react-router-dom";

const CreatedCourt = () => {
  const data = useLoaderData();
  const campData = data?.data?.data;
  const { scheduleData, isLoading } = useCampSchedule(campData?.id);
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div className="w-fit flex gap-4 items-center border border-border rounded-lg mb-4">
        <button
          type="button"
          className="sm:w-10 w-8 sm:h-10 h-8 rounded-full flex justify-center items-center p-2.5 cursor-pointer"
          onClick={() => navigate('/director-dashboard')}
        >
          <LuMoveLeft className="text-xl" />
        </button>
      </div>
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
