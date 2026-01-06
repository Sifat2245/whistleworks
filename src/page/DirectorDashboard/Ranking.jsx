import { useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import BackBtn from "@/components/common/BackBtn";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import CommonSectionTitle from "@/components/dashboard/director_dashboard/CommonSectionTitle";
import Rankings from "@/components/dashboard/director_dashboard/Rankings/Rankings";
import { useParams } from "react-router-dom";
import SettingsModal from "@/components/dashboard/director_dashboard/Rankings/SettingsModal";

const Ranking = () => {
  const { id } = useParams();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="w-full">
      <BackBtn />
      <div className="flex justify-between items-center mb-8">
        <CommonSectionTitle
          text="Ranking - Elite Officials Summer Camp 2024"
          subText="Performance rankings based on evaluation scores"
        />
        <CommonSubmitBtn
          variant="primary"
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="rounded-full p-3"
        >
          <IoSettingsOutline className="h-6 w-6" />
        </CommonSubmitBtn>
      </div>

      <Rankings campId={id} />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        campId={id}
      />
    </div>
  );
};

export default Ranking;