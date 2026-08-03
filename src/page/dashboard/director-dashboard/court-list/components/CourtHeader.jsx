import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import CommonSectionTitle from "../../../../../components/common/CommonSectionTitle";
import { useState } from "react";
import { CourtDetailsModal } from "./CourtDetailsModal";

const CourtHeader = ({ campData, scheduleData, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="w-full flex items-center justify-between mt-5">
        <CommonSectionTitle
          text={`Schedule - ${campData?.camp_name}`}
          subText="Manage games, locations, and referee assignments"
        />

        <CommonSubmitBtn
          variant="primary"
          className="px-6"
          onClick={() => setIsModalOpen(true)}
        >
          Schedule Details
        </CommonSubmitBtn>
      </div>

      {/* Modal */}
      {isModalOpen && (
       <CourtDetailsModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        scheduleData={scheduleData}
        isLoading={isLoading}
      />
      )}
    </>
  );
};

export default CourtHeader;