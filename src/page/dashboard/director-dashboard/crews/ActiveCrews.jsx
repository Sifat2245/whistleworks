import BackBtn from "@/components/common/BackBtn";
import CreateCrewModal from "@/page/dashboard/director-dashboard/crews/components/CreateCrewModal";
import CrewCard from "@/page/dashboard/director-dashboard/crews/components/CrewCard";
import CrewCardSkeleton from "@/page/dashboard/director-dashboard/crews/components/CrewCardSkeleton";
import { useCampCrews } from "@/hooks/api/director-hooks/useCrews";
import { useState } from "react";
import { useParams } from "react-router-dom";

const ActiveCrews = () => {
  const { id } = useParams();

  const { crewGroups, isLoading } = useCampCrews(id);
  const totalMembers = crewGroups.reduce(
    (total, group) => total + (group?.member_count || 0),
    0
  );

  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="w-full min-h-screen p-4 md:p-6">
      <div className="mb-8">
        <BackBtn />

        {/* Header */}
        <div className="w-full mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Crew Groups
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and view all active crew groups
            </p>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="px-4 py-3 rounded-md bg-primary text-white font-bold hover:opacity-90"
          >
            Create a Referee Crew
          </button>
        </div>

        {/* Stats */}
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4 min-w-[200px]">
            <p className="text-gray-500 text-sm">Total Groups</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {crewGroups.length}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 min-w-[200px]">
            <p className="text-gray-500 text-sm">Total Crew Members</p>
            <p className="text-2xl font-bold text-primary mt-1">
              {totalMembers}
            </p>
          </div>
        </div>
      </div>

      {/* Empty */}
      {crewGroups.length === 0 && (
        <p className="text-gray-500 text-lg">No crew groups found.</p>
      )}

      {isLoading ? (
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-8">
            Active Crew List
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <CrewCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : crewGroups.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-8">
            Active Crew List
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {crewGroups.map((group) => (
              <CrewCard key={group.id} group={group} />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-lg text-center py-12">
          No crew groups found.
        </p>
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
