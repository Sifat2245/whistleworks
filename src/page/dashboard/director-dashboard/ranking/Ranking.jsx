import { useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import BackBtn from "@/components/common/BackBtn";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import CommonSectionTitle from "@/components/common/CommonSectionTitle";
import Rankings from "@/page/dashboard/director-dashboard/ranking/components/Rankings";
import { useParams } from "react-router-dom";
import SettingsModal from "@/page/dashboard/director-dashboard/ranking/components/SettingsModal";
import { useGetCampDetails } from "@/hooks/api/director-hooks/useCamps";

const Ranking = () => {
  const { id } = useParams();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { data: campData, isLoading } = useGetCampDetails(id);

  return (
    <div className="w-full">
      <BackBtn />
      <div className="flex justify-between items-center mb-8">
        <CommonSectionTitle
          text={`Ranking - ${isLoading ? "..." : campData?.camp_name}`}
          subText="Performance rankings based on evaluation scores"
        />
        <CommonSubmitBtn
          variant="secondary"
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="rounded-[10px] px-4 sm:px-5 shrink-0"
        >
          <span className="inline-flex items-center gap-2">
            <IoSettingsOutline className="h-5 w-5" />
            <span className="hidden sm:inline">Ranking Settings</span>
          </span>
        </CommonSubmitBtn>
      </div>

      <Rankings campId={id}/>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        campId={id}
      />
    </div>
  );
};

export default Ranking;