import { useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { LuDownload } from "react-icons/lu";
import BackBtn from "@/components/common/BackBtn";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import CommonSectionTitle from "@/components/common/CommonSectionTitle";
import Rankings from "@/page/dashboard/director-dashboard/ranking/components/Rankings";
import { useParams } from "react-router-dom";
import SettingsModal from "@/page/dashboard/director-dashboard/ranking/components/SettingsModal";
import { useGetCampDetails } from "@/hooks/api/director-hooks/useCamps";
import { useExportRanking } from "@/hooks/api/director-hooks/useExport";

const Ranking = () => {
  const { id } = useParams();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { data: campData, isLoading } = useGetCampDetails(id);
  const { mutate: exportRanking, isPending: isExporting } =
    useExportRanking(id);

  return (
    <div className="w-full">
      <BackBtn />
      <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
        <CommonSectionTitle
          text={`Ranking - ${isLoading ? "..." : campData?.camp_name}`}
          subText="Performance rankings based on evaluation scores"
        />
        <div className="flex items-center gap-3">
          <CommonSubmitBtn
            variant="secondary"
            type="button"
            onClick={() => !isExporting && exportRanking()}
            className="rounded-[10px] px-4 sm:px-5 shrink-0"
          >
            <span className="inline-flex items-center gap-2">
              <LuDownload className="h-5 w-5" />
              <span className="hidden sm:inline">
                {isExporting ? "Exporting..." : "Export CSV"}
              </span>
            </span>
          </CommonSubmitBtn>
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
      </div>

      <Rankings campId={id} sports_type_name={campData?.sports_type_name} />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        campId={id}
      />
    </div>
  );
};

export default Ranking;