import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MdClose, MdPeople, MdEmail, MdPhone } from "react-icons/md";
import { Avatar, Spin } from "antd";
import useGetCrewDetails from "@/hooks/get-crew-details";
import ScheduleRefereeModal from "./ScheduleRefereeModal";

const CrewDetailsModal = ({ isOpen, onClose, crewId, crewName = "Crew", campId, userRole = "evaluator" }) => {
  const { crewDetails, isLoading } = useGetCrewDetails(crewId);
  const [selectedReferee, setSelectedReferee] = useState(null);
  const [isRefereeModalOpen, setIsRefereeModalOpen] = useState(false);

  const handleRefereeClick = (member) => {
    setSelectedReferee({
      type: "individual",
      referee_id: member.id,
      name: member.name,
      avatar: member.avatar,
      email: member.email,
    });
    setIsRefereeModalOpen(true);
  };

  const handleCloseRefereeModal = () => {
    setIsRefereeModalOpen(false);
    setSelectedReferee(null);
  };

  const handleClose = () => {
    setSelectedReferee(null);
    setIsRefereeModalOpen(false);
    onClose();
  };

  const members = crewDetails?.members || [];
  const memberCount = crewDetails?.member_count || 0;
  const camp = crewDetails?.camp;
  const assignedGames = crewDetails?.assigned_games || 0;

  return (
    <>
      <AnimatePresence>
        {isOpen && !isRefereeModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 overflow-y-auto py-8"
            onClick={handleClose}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center gap-3">
                  <MdPeople className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-900">
                    {crewName || "Crew Details"}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-white/60"
                >
                  <MdClose className="w-6 h-6" />
                </button>
              </div>

              {/* Body */}
              <div className="overflow-y-auto" style={{ maxHeight: "calc(90vh - 80px)" }}>
                {isLoading ? (
                  <div className="flex justify-center items-center py-24">
                    <Spin size="large" tip="Loading crew details..." />
                  </div>
                ) : !crewDetails ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                    <MdPeople className="w-16 h-16" />
                    <p className="text-lg font-medium">Unable to load crew details</p>
                    <p className="text-sm">The crew data could not be retrieved.</p>
                  </div>
                ) : (
                  <div className="p-6 space-y-6">
                    {/* Crew Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-100">
                        <div className="text-2xl font-bold text-purple-600">{memberCount}</div>
                        <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide font-medium">Members</div>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
                        <div className="text-2xl font-bold text-[#00AEEF]">{assignedGames}</div>
                        <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide font-medium">Assigned Games</div>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
                        <div className="text-2xl font-bold text-green-600 capitalize">{crewDetails?.status || "active"}</div>
                        <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide font-medium">Status</div>
                      </div>
                    </div>

                    {/* Camp Info */}
                    {camp && (
                      <div className="text-sm text-gray-500">
                        Camp: <span className="font-medium text-gray-700">{camp.name}</span>
                      </div>
                    )}

                    {/* Description */}
                    {crewDetails?.description && (
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Description</span>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{crewDetails.description}</p>
                      </div>
                    )}

                    {/* Members List */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                        Crew Members ({members.length})
                      </h3>

                      {members.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed">
                          <p className="text-gray-500">No members in this crew.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {members.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#00AEEF]/30 hover:bg-blue-50/50 transition-all group cursor-pointer"
                              onClick={() => handleRefereeClick(member)}
                            >
                              <Avatar
                                size={52}
                                src={member.avatar}
                                alt={member.name}
                                className="border-2 border-gray-200 shadow-sm shrink-0"
                              >
                                {member.name?.charAt(0)?.toUpperCase() || "R"}
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-base font-semibold text-gray-900 truncate">
                                  {member.name || "Unnamed Referee"}
                                </h4>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                    <MdEmail className="w-3.5 h-3.5 shrink-0" />
                                    {member.email || "N/A"}
                                  </span>
                                  {member.jersey_number && (
                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#00AEEF]">
                                      #{member.jersey_number}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs text-[#00AEEF] font-medium">
                                  View Details →
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Note about clicking members */}
                    {members.length > 0 && userRole !== "referee" && (
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                        <p className="text-sm text-blue-700">
                          Click on a member to view their details and submit an evaluation
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Referee Details Modal (triggered when a member is clicked) */}
      <ScheduleRefereeModal
        isOpen={isRefereeModalOpen}
        onClose={handleCloseRefereeModal}
        refereeData={selectedReferee}
        campId={campId}
        userRole={userRole}
      />
    </>
  );
};

export default CrewDetailsModal;
