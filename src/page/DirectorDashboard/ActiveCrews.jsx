import BackBtn from "@/components/common/BackBtn";
import CreateCrewModal from "@/components/dashboard/director_dashboard/Crew/CreateCrewModal";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";

const ActiveCrews = () => {
  const { id } = useParams();
  const axiosInstance = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ["crew-groups", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/v1/camp/${id}/crews`);
      return res?.data?.data;
    },
  });

  const crewGroups = data?.crews || [];
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

      {/* Loading */}
      {isLoading && <p>Loading crews...</p>}

      {/* Empty */}
      {!isLoading && crewGroups.length === 0 && (
        <p className="text-gray-500 text-lg">No crew groups found.</p>
      )}

      {/* Crew List */}
      {crewGroups.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-8">
            Active Crew List
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {crewGroups.map((group) => (
              <div
                key={group.id}
                className="relative bg-white rounded-2xl border shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Gradient header strip */}
                <div className="h-2 w-full bg-linear-to-r from-primary to-sky-600" />

                {/* Crew ID badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-primary shadow text-white w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-sm tracking-wide">
                    #{group.id}
                  </div>
                </div>

                {/* Header */}
                <div className="p-6 pb-5 border-b bg-gray-50/60">
                  <h3 className="text-xl font-bold text-gray-800 leading-tight">
                    {group.name}
                  </h3>

                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {group.description || "No description provided."}
                  </p>

                  <span
                    className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold 
      ${
        group.status === "active"
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
                  >
                    {group.status}
                  </span>
                </div>

                {/* Members Section */}
                <div className="p-6">
                  {/* meta row */}
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500">
                      👥{" "}
                      <span className="font-semibold">
                        {group.member_count}
                      </span>{" "}
                      Members
                    </p>

                    {group.member_count > 0 && (
                      <span className="text-xs text-gray-400">
                        Showing {group.members.length}
                      </span>
                    )}
                  </div>

                  {/* Empty state */}
                  {group.members.length === 0 && (
                    <div className="w-full py-6 bg-gray-50 border border-dashed rounded-xl text-center text-gray-400 text-sm">
                      No members added yet
                    </div>
                  )}

                  {/* Members list */}
                  {group.members.length > 0 && (
                    <div className="space-y-3">
                      {group.members.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 border rounded-xl px-3 py-2 transition"
                        >
                          <img
                            src={m.avatar || "/placeholder.jpg"}
                            className="w-10 h-10 rounded-full object-cover border"
                          />
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {m.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {m.role || "Crew Member"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
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
