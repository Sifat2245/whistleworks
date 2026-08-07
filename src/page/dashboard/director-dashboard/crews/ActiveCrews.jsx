import BackBtn from "@/components/common/BackBtn";
import CommonSectionTitle from "@/components/common/CommonSectionTitle";
import CreateCrewModal from "@/page/dashboard/director-dashboard/crews/components/CreateCrewModal";
import CrewCard from "@/page/dashboard/director-dashboard/crews/components/CrewCard";
import CrewCardSkeleton from "@/page/dashboard/director-dashboard/crews/components/CrewCardSkeleton";
import { useCampCrews } from "@/hooks/api/director-hooks/useCrews";
import { useExportCrews } from "@/hooks/api/director-hooks/useExport";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { LuLayers, LuUsers, LuPlus, LuInbox, LuDownload } from "react-icons/lu";

const ActiveCrews = () => {
  const { id } = useParams();

  const { crewGroups, isLoading } = useCampCrews(id);
  const totalMembers = crewGroups.reduce(
    (total, group) => total + (group?.member_count || 0),
    0
  );

  // Export CSV
  const { mutate: exportCrews, isPending: isExporting } = useExportCrews(id);

  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="w-full pb-12">
      <div className="mb-6">
        <BackBtn />

        {/* Header */}
        <div className="w-full mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CommonSectionTitle
            text="Crew Groups"
            subText="Manage and view all active crew groups"
          />

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => exportCrews()}
              disabled={isExporting || crewGroups.length === 0}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[10px] border border-border bg-white text-[#333] font-semibold text-sm whitespace-nowrap transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <LuDownload className="text-base" />
              {isExporting ? "Exporting..." : "Export CSV"}
            </button>

            <button
              onClick={() => setOpenModal(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[10px] bg-primary text-white font-medium hover:bg-primary/90 transition cursor-pointer shrink-0"
            >
              <LuPlus className="text-lg" /> Create a Referee Crew
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 max-w-4xl">
          <div className="bg-white border border-border rounded-[10px] px-4 py-3.5 flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-lg shrink-0">
              <LuLayers />
            </span>
            <div>
              <p className="text-lg font-medium text-[#333]">
                {crewGroups.length}
              </p>
              <p className="text-xs text-[#666]">Total Groups</p>
            </div>
          </div>

          <div className="bg-white border border-border rounded-[10px] px-4 py-3.5 flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-lg shrink-0">
              <LuUsers />
            </span>
            <div>
              <p className="text-lg font-medium text-[#333]">{totalMembers}</p>
              <p className="text-xs text-[#666]">Total Crew Members</p>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div>
          <h2 className="text-lg font-semibold text-[#333] mb-6">
            Active Crew List
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
            {[...Array(8)].map((_, i) => (
              <CrewCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : crewGroups.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold text-[#333] mb-6">
            Active Crew List
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
            {crewGroups.map((group) => (
              <CrewCard key={group.id} group={group} />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-[10px] py-16 text-center">
          <LuInbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-[#333]">
            No Crew Groups Found
          </h3>
          <p className="text-sm text-[#666] mt-1">
            Create your first referee crew to get started.
          </p>
          <button
            onClick={() => setOpenModal(true)}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-primary text-white font-medium hover:bg-primary/90 transition cursor-pointer"
          >
            <LuPlus className="text-lg" /> Create a Referee Crew
          </button>
        </div>
      )}

      {/* Modal */}
      {openModal && (
        <CreateCrewModal
          campId={id}
          openModal={openModal}
          handleCloseModal={() => setOpenModal(false)}
        />
      )}
    </div>
  );
};

export default ActiveCrews;
