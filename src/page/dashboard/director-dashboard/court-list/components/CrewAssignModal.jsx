import { useState, useEffect } from "react";
import { Modal, Radio, Spin, Tooltip } from "antd";

import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import toast from "react-hot-toast";
import { ImBlocked } from "react-icons/im";
import { LuUsers, LuLoaderCircle } from "react-icons/lu";
import Swal from "sweetalert2";
import {
  useAvailableCrews,
  useAssignCrew,
} from "@/hooks/api/director-hooks/useGameAssingments";
import { formatRefereePosition } from "@/utils/refereePositions";

const CrewAssignModal = ({
  isModalOpen,
  handleCloseModal,
  selectedCourt,
  selectedTimeSlot,
  handleBlockCourt,
  onAssignSuccess,
  campId,
  isBlocking = false,
}) => {
  const [selectedCrew, setSelectedCrew] = useState(null);

  // Determine if individual referees are already assigned on this court slot
  const hasIndividualReferees =
    (selectedCourt?.assignments || []).some(
      (a) => a.type === "individual" || (a.referee_id && !a.is_crew),
    ) ||
    (selectedCourt?.positions || []).some((p) => p.is_assigned || p.referee);

  // Initialize selected crew on modal open
  useEffect(() => {
    if (isModalOpen) {
      const existingCrew = (selectedCourt?.assignments || []).find(
        (a) => a.type === "crew" || a.is_crew || a.crew_id,
      );
      const existingCrewId =
        existingCrew?.crew_id ||
        existingCrew?.id ||
        selectedCourt?.crew?.id ||
        null;
      setSelectedCrew(existingCrewId);
    }
  }, [isModalOpen, selectedCourt]);

  // ── Hooks ──────────────────────────────────────────────────────
  const { data: crewListData = [], isLoading: loadingCrews } =
    useAvailableCrews(
      campId,
      selectedCourt?.slot_id,
      isModalOpen && !!selectedCourt?.slot_id,
    );

  const assignCrewMutation = useAssignCrew({
    onSuccess: onAssignSuccess,
  });

  const primaryButtonDisabled = !selectedCrew || hasIndividualReferees;
  const primaryButtonLoading = assignCrewMutation.isPending;

  const primaryButtonText = () => {
    if (hasIndividualReferees) return "Individuals Already Assigned";
    return selectedCrew ? "Assign Selected Crew" : "Select a Crew";
  };

  const handlePrimaryAction = () => {
    if (!selectedCrew) return;

    assignCrewMutation.mutate({
      slotId: selectedCourt?.slot_id,
      data: { crew_id: selectedCrew },
    });
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <LuUsers size={20} />
          </span>
          <div>
            <div className="text-lg font-semibold leading-tight">
              Assign Crew to Court {selectedCourt?.court_number}
            </div>
            <div className="text-sm text-gray-500 mt-0.5">
              {selectedTimeSlot?.time} • {selectedCourt?.address || "Main Court"}
            </div>
          </div>
        </div>
      }
      open={isModalOpen}
      onCancel={handleCloseModal}
      footer={null}
      width="min(800px, 94vw)"
      centered
      destroyOnClose
    >
      <div className="mt-4">
        {hasIndividualReferees && (
          <div className="p-4 bg-orange-50 border border-orange-300 rounded-lg text-orange-800 mb-5">
            <p className="font-medium flex items-center gap-2">
              <ImBlocked /> Individual Referees Already Assigned
            </p>
            <p className="text-sm mt-1">
              Remove assigned individual referees first to assign a crew.
            </p>
          </div>
        )}

        <p className="text-sm text-gray-600 mb-5">
          Select one pre-made crew to assign all its members to this time slot.
        </p>

        {loadingCrews ? (
          <div className="text-center py-16">
            <Spin size="large" />
          </div>
        ) : crewListData.length === 0 ? (
          <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl border border-gray-100">
            No crews available for this camp.
          </div>
        ) : (
          <div
            className={`space-y-4 max-h-[460px] overflow-y-auto pr-1 ${
              hasIndividualReferees ? "opacity-60 pointer-events-none" : ""
            }`}
          >
            {crewListData.map((crew) => {
              const isSelected = selectedCrew === crew.id;
              const hasConflict = crew.can_assign === false;
              const conflictMessage =
                crew.status_message ||
                "This crew has a scheduling conflict in this time slot.";

              return (
                <div
                  key={crew.id}
                  onClick={() => {
                    if (hasIndividualReferees) {
                      toast.error("Remove assigned individual referees first");
                      return;
                    }

                    // Show warning for conflicted crews, but still allow selection
                    if (hasConflict) {
                      Swal.fire({
                        title: "Potential Conflict Detected",
                        html: `
                          <div class="text-left">
                            <p class="mb-3 text-gray-700">${conflictMessage}</p>
                            <p class="font-medium text-orange-700">
                              Are you sure you want to assign this crew anyway?
                            </p>
                          </div>
                        `,
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes, Assign Anyway",
                        cancelButtonText: "Cancel",
                        confirmButtonColor: "#f97316",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          setSelectedCrew(isSelected ? null : crew.id);
                        }
                      });
                      return;
                    }

                    // Normal selection
                    setSelectedCrew(isSelected ? null : crew.id);
                  }}
                  className={`
                    border-2 rounded-xl p-5 transition-all relative cursor-pointer
                    hover:shadow-md hover:border-purple-400
                    ${
                      isSelected
                        ? "border-purple-600 bg-purple-50/70 shadow-lg ring-2 ring-purple-400/30"
                        : "border-gray-200 bg-white"
                    }
                    ${hasIndividualReferees ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  {/* Conflict indicator */}
                  {hasConflict && (
                    <div className="absolute top-3 right-3 bg-orange-100 text-orange-800 text-xs font-medium px-3 py-1 rounded-full border border-orange-200 shadow-sm flex items-center gap-1.5 z-10">
                      <ImBlocked className="w-3.5 h-3.5" />
                      Conflict
                    </div>
                  )}

                  {crew.status_message && hasConflict && (
                    <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-800">
                      {crew.status_message}
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-5">
                    <div className="flex items-start gap-4 flex-1">
                      <Radio
                        value={crew.id}
                        checked={isSelected}
                        className="mt-1.5"
                        disabled={hasIndividualReferees}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-lg text-gray-900">
                            {crew.name}
                          </h4>
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${
                              crew.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {crew.status || "active"}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600">
                          {crew.member_count || crew.members?.length || 0}{" "}
                          members
                        </p>

                        {/* Overlapping Avatars */}
                        <div className="flex flex-wrap gap-2 mt-4 -space-x-3">
                          {(crew.members || []).slice(0, 10).map((member) => (
                            <Tooltip
                              key={member.id}
                              title={
                                <div className="text-center">
                                  <p className="font-medium">{member.name}</p>
                                  {(member.position ||
                                    member.position_name) && (
                                    <p className="text-xs text-sky-300 font-semibold mt-0.5">
                                      {formatRefereePosition(
                                        member.position || member.position_name,
                                      )}
                                    </p>
                                  )}
                                </div>
                              }
                            >
                              <img
                                src={member.avatar || "/default-avatar.png"}
                                alt={member.name}
                                className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover bg-white"
                                onError={(e) =>
                                  (e.target.src = "/default-avatar.png")
                                }
                              />
                            </Tooltip>
                          ))}
                          {(crew.members || []).length > 10 && (
                            <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600 shadow-md">
                              +{(crew.members || []).length - 10}
                            </div>
                          )}
                        </div>

                        {/* Crew members roster */}
                        {(crew.members || []).length > 0 && (
                          <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 divide-y divide-gray-200 overflow-hidden max-h-48 overflow-y-auto">
                            {crew.members.map((member) => (
                              <div
                                key={member.id}
                                className="flex items-center gap-2.5 px-3 py-2 bg-white/70"
                              >
                                <img
                                  src={member.avatar || "/default-avatar.png"}
                                  alt={member.name || "crew member"}
                                  className="w-7 h-7 rounded-full object-cover border border-gray-200 bg-white shrink-0"
                                  onError={(e) =>
                                    (e.target.src = "/default-avatar.png")
                                  }
                                />
                                <span className="text-sm font-medium text-gray-800 truncate flex-1">
                                  {member.name || "Unnamed Referee"}
                                </span>
                                {(member.position || member.position_name) && (
                                  <span className="shrink-0 text-[11px] font-semibold text-purple-700 bg-purple-100 border border-purple-200 px-2.5 py-0.5 rounded-full">
                                    {formatRefereePosition(
                                      member.position || member.position_name,
                                    )}
                                  </span>
                                )}
                                {(member.jersey_number ||
                                  member.jourcy_number) && (
                                  <span className="shrink-0 text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                    #
                                    {member.jersey_number ||
                                      member.jourcy_number}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========== FOOTER ========== */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <CommonSubmitBtn variant="secondary" onClick={handleCloseModal}>
            Cancel
          </CommonSubmitBtn>
          <CommonSubmitBtn
            variant="danger"
            onClick={() => !isBlocking && handleBlockCourt()}
            className="inline-flex items-center justify-center gap-2"
          >
            {isBlocking ? (
              <LuLoaderCircle className="w-4 h-4 animate-spin" />
            ) : (
              <ImBlocked />
            )}
            {isBlocking ? "Blocking..." : "Block Court"}
          </CommonSubmitBtn>
        </div>

        <CommonSubmitBtn
          onClick={handlePrimaryAction}
          disabled={primaryButtonDisabled}
          isLoading={primaryButtonLoading}
          variant="primary"
          className="min-w-[200px] w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
        >
          {primaryButtonText()}
        </CommonSubmitBtn>
      </div>
    </Modal>
  );
};

export default CrewAssignModal;
