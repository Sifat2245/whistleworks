import { useState, useEffect, useMemo } from "react";
import { Modal, Input, Tabs, Radio, Spin, Select } from "antd";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import { BiSearch } from "react-icons/bi";
import toast from "react-hot-toast";
import { ImBlocked } from "react-icons/im";
import { LuLayoutGrid, LuLoaderCircle } from "react-icons/lu";
import Swal from "sweetalert2";
import {
  useAvailableReferees,
  useAvailableCrews,
  useAssignReferees,
  useAssignCrew,
} from "@/hooks/api/director-hooks/useGameAssingments";
import { getCourtPositions, getPositionReferee } from "@/utils/refereePositions";

const { Search } = Input;
const { TabPane } = Tabs;

const ScheduleAddModal = ({
  isModalOpen,
  handleCloseModal,
  selectedCourt,
  selectedTimeSlot,
  selectedPosition,
  handleBlockCourt,
  onAssignSuccess,
  campId,
  maxReferees,
  isBlocking = false,
  sportName = "",
  assignmentType = "referees",
}) => {
  const [activeTab, setActiveTab] = useState(assignmentType === "crews" ? "crew" : "referees");
  const [selectedReferees, setSelectedReferees] = useState([]);
  const [selectedCrew, setSelectedCrew] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const courtPositions = getCourtPositions(selectedCourt, maxReferees);

  const getSelectedRefPositionName = (ref) => {
    if (ref.assignedPositionId) {
      const posObj = courtPositions.find((p) => p.id === ref.assignedPositionId);
      if (posObj) return posObj.position;
    }
    const selectedIdx = selectedReferees.findIndex((r) => r.id === ref.id);
    if (selectedIdx !== -1) {
      return courtPositions[selectedIdx]?.position || `Position ${selectedIdx + 1}`;
    }
    return null;
  };

  // Reset on open
  useEffect(() => {
    if (isModalOpen) {
      setSelectedReferees([]);
      setSelectedCrew(null);
      setSearchTerm("");
      setActiveTab(assignmentType === "crews" ? "crew" : "referees");
    }
  }, [isModalOpen, assignmentType]);

  // ── Hooks ──────────────────────────────────────────────────────
  const { data: refereeListData = [], isLoading: loadingReferees } =
    useAvailableReferees(
      campId,
      selectedCourt?.slot_id,
      isModalOpen && !!selectedCourt?.slot_id && activeTab === "referees",
    );

  const { data: crewListData = [], isLoading: loadingCrews } =
    useAvailableCrews(
      campId,
      selectedCourt?.slot_id,
      isModalOpen && !!selectedCourt?.slot_id,
    );

  const assignRefereeMutation = useAssignReferees({
    onSuccess: onAssignSuccess,
  });

  const assignCrewMutation = useAssignCrew({
    onSuccess: onAssignSuccess,
  });

  // Pre-select currently assigned referees with position info
  useEffect(() => {
    if (refereeListData.length > 0 && activeTab === "referees") {
      const assigned = refereeListData
        .filter((ref) => ref.is_assigned_to_this_slot)
        .map((ref, idx) => {
          const matchedPos = courtPositions.find(
            (p) =>
              p.referee?.id === ref.id ||
              p.game_slot_assignment_id === ref.assignment_id ||
              (p.is_assigned && getPositionReferee(p, [ref]))
          );
          return {
            ...ref,
            assignedPositionId: matchedPos?.id || courtPositions[idx]?.id || idx + 1,
          };
        });
      setSelectedReferees(assigned);
    }
  }, [refereeListData, activeTab, selectedCourt]);

  // Search filter — always include currently assigned
  const filteredReferees = useMemo(() => {
    if (activeTab !== "referees") return [];
    if (!searchTerm.trim()) return refereeListData;

    const lower = searchTerm.toLowerCase();
    return refereeListData.filter((ref) => {
      if (ref.is_assigned_to_this_slot) return true;
      return (
        ref.name?.toLowerCase().includes(lower) ||
        ref.email?.toLowerCase().includes(lower)
      );
    });
  }, [refereeListData, searchTerm, activeTab]);

  // Conflict type detection
  const getConflictType = (ref) => {
    if (ref.can_assign !== false) return "none";
    if (
      ref.status_message?.toLowerCase().includes("another court at this time")
    ) {
      return "hard";
    }
    return "soft";
  };

  const handleRefereeToggle = (referee) => {
    if (hasCrewAssigned) {
      toast.error("Remove the assigned crew first");
      return;
    }

    const conflictType = getConflictType(referee);
    if (conflictType === "hard") {
      toast.error(
        "This referee is already assigned to another court at this time",
      );
      return;
    }

    setSelectedReferees((prev) => {
      const exists = prev.some((r) => r.id === referee.id);
      if (exists) return prev.filter((r) => r.id !== referee.id);
      if (prev.length >= (courtPositions.length || maxReferees)) {
        toast.warning(`Maximum ${courtPositions.length || maxReferees} referees allowed`);
        return prev;
      }

      // Determine position ID for newly selected referee
      let targetPosId = null;
      if (
        selectedPosition?.id &&
        !prev.some((r) => r.assignedPositionId === selectedPosition.id)
      ) {
        targetPosId = selectedPosition.id;
      } else {
        const usedPosIds = prev.map((r) => r.assignedPositionId);
        const firstAvailable = courtPositions.find((p) => !usedPosIds.includes(p.id));
        targetPosId = firstAvailable ? firstAvailable.id : prev.length + 1;
      }

      return [...prev, { ...referee, assignedPositionId: targetPosId }];
    });
  };

  const handlePositionChangeForReferee = (refId, newPosId) => {
    setSelectedReferees((prev) =>
      prev.map((r) => (r.id === refId ? { ...r, assignedPositionId: newPosId } : r)),
    );
  };

  // Conflict detection
  const hasCrewAssigned =
    !!selectedCourt?.crew ||
    selectedCourt?.assignments?.some((a) => a.is_crew || a.crew_id || a.type === "crew");
  const hasIndividualReferees = refereeListData.some(
    (ref) => ref.is_assigned_to_this_slot,
  );

  const primaryButtonDisabled =
    activeTab === "referees"
      ? selectedReferees.length === 0 || hasCrewAssigned
      : !selectedCrew || hasIndividualReferees;

  const primaryButtonLoading =
    activeTab === "referees"
      ? assignRefereeMutation.isPending
      : assignCrewMutation.isPending;

  const primaryButtonText = () => {
    if (activeTab === "referees" && hasCrewAssigned)
      return "Crew Already Assigned";
    if (activeTab === "crew" && hasIndividualReferees)
      return "Individuals Already Assigned";

    if (activeTab === "referees") {
      const hasSoftRisk = selectedReferees.some(
        (r) => getConflictType(r) === "soft",
      );
      const limit = courtPositions.length || maxReferees;
      const base = `Assign Referees (${selectedReferees.length}/${limit})`;
      return hasSoftRisk ? `${base} Fatigue Risk` : base;
    }
    return selectedCrew ? "Assign Selected Crew" : "Select a Crew";
  };

  const handlePrimaryAction = async () => {
    if (activeTab === "crew") {
      assignCrewMutation.mutate({
        slotId: selectedCourt?.slot_id,
        data: { crew_id: selectedCrew },
      });
      return;
    }

    const softRiskRefs = selectedReferees.filter(
      (r) => getConflictType(r) === "soft",
    );
    if (softRiskRefs.length > 0) {
      const names = softRiskRefs
        .map((r) => `<strong>${r.name}</strong>`)
        .join(", ");
      const result = await Swal.fire({
        title: "Back-to-Back Fatigue Risk",
        html: `<p>The following referee(s) just finished a previous game:</p><div class="mt-2">${names}</div><p class="mt-3">This may cause fatigue. Assign anyway?</p>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Assign Anyway",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#f97316",
      });
      if (!result.isConfirmed) return;
    }

    // Build position-based payload as requested by API
    const dataPayload = selectedReferees.map((ref, idx) => {
      const posId = ref.assignedPositionId || courtPositions[idx]?.id || idx + 1;
      return {
        referee_ids: ref.id,
        position_ids: posId,
      };
    });

    const payload = {
      override_restrictions: 1,
      assignments: dataPayload,
    };

    assignRefereeMutation.mutate({
      slotId: selectedCourt?.slot_id,
      payload,
    });
  };

  const currentlyAssigned = refereeListData.filter(
    (ref) => ref.is_assigned_to_this_slot,
  );

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <LuLayoutGrid size={20} />
          </span>
          <div>
            <div className="text-lg font-semibold leading-tight">
              Assign to Court {selectedCourt?.court_number}
            </div>
            <div className="text-sm text-gray-500 mt-0.5">
              {selectedTimeSlot?.time} • {selectedCourt?.address || "Main Court"}
              {selectedPosition && (
                <span className="ml-2 font-semibold text-primary">
                  • Target: {selectedPosition.position}
                </span>
              )}
            </div>
          </div>
        </div>
      }
      open={isModalOpen}
      onCancel={handleCloseModal}
      footer={null}
      width="min(960px, 94vw)"
      centered
      destroyOnClose
    >
      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          if (key === "referees" && hasCrewAssigned) {
            Swal.fire(
              "Blocked",
              "Remove the assigned crew first to assign individual referees.",
              "warning",
            );
            return;
          }
          if (key === "crew" && hasIndividualReferees) {
            Swal.fire(
              "Blocked",
              "Remove the assigned individual referees first to assign a crew.",
              "warning",
            );
            return;
          }
          setActiveTab(key);
        }}
        className="mt-4"
      >
        {/* ========== REFEREES TAB ========== */}
        <TabPane tab="Assign Referees" key="referees">
          <div className="mt-4 space-y-5">
            {hasCrewAssigned && (
              <div className="p-4 bg-orange-50 border border-orange-300 rounded-lg text-orange-800">
                <p className="font-medium flex items-center gap-2">
                  <ImBlocked /> Crew Already Assigned
                </p>
                <p className="text-sm mt-1">
                  Remove crew to assign individual referees.
                </p>
              </div>
            )}

            {currentlyAssigned.length > 0 && (
              <div className="p-4 bg-green-50 border border-green-300 rounded-lg">
                <p className="font-medium text-green-800 mb-3">
                  Currently Assigned ({currentlyAssigned.length})
                </p>
                <div className="flex flex-wrap gap-3">
                  {currentlyAssigned.map((ref, idx) => {
                    const posName =
                      getSelectedRefPositionName(ref) ||
                      courtPositions[idx]?.position ||
                      `Position ${idx + 1}`;

                    return (
                      <div
                        key={ref.id}
                        className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border"
                      >
                        <img
                          src={ref.avatar || "/default-avatar.png"}
                          alt={ref.name}
                          className="w-8 h-8 rounded-full object-cover border"
                          onError={(e) => (e.target.src = "/default-avatar.png")}
                        />
                        <div className="flex flex-col text-left">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary leading-none">
                            {posName}
                          </span>
                          <span className="font-medium text-sm mt-0.5 leading-tight">
                            {ref.name}{" "}
                            {ref?.jourcy_number ? `#${ref.jourcy_number}` : ""}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <Search
              placeholder="Search by name or email..."
              allowClear
              size="large"
              prefix={<BiSearch className="text-gray-400" />}
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              disabled={hasCrewAssigned}
            />

            <div className="flex justify-between text-sm">
              <span className="font-medium">
                Available ({filteredReferees.length})
              </span>
              <span className="font-semibold text-[#00AEEF]">
                Selected: {selectedReferees.length}/{courtPositions.length || maxReferees}
              </span>
            </div>

            <div className="max-h-[460px] overflow-y-auto space-y-3 pr-1">
              {loadingReferees ? (
                <div className="text-center py-12">
                  <Spin />
                </div>
              ) : filteredReferees.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {searchTerm
                    ? "No matching referees"
                    : "No referees available"}
                </div>
              ) : (
                filteredReferees.map((ref) => {
                  const selectedObj = selectedReferees.find((r) => r.id === ref.id);
                  const isSelected = !!selectedObj;
                  const conflictType = getConflictType(ref);
                  const isHardConflict = conflictType === "hard";
                  const isSoftRisk = conflictType === "soft";
                  const disabled =
                    !isSelected &&
                    selectedReferees.length >= (courtPositions.length || maxReferees);

                  return (
                    <div
                      key={ref.id}
                      onClick={() =>
                        !hasCrewAssigned &&
                        !disabled &&
                        !isHardConflict &&
                        handleRefereeToggle(ref)
                      }
                      className={`
                        border rounded-xl p-4 flex items-center justify-between transition-all
                        ${
                          hasCrewAssigned || disabled || isHardConflict
                            ? "opacity-60 cursor-not-allowed"
                            : "cursor-pointer hover:shadow-md"
                        }
                        ${
                          isSelected
                            ? isSoftRisk
                              ? "border-orange-400 bg-orange-50 ring-2 ring-orange-200 shadow-md"
                              : "border-[#00AEEF] bg-blue-50 shadow-md"
                            : isHardConflict
                              ? "border-red-400 bg-red-50"
                              : isSoftRisk
                                ? "border-orange-300 bg-orange-50/60 hover:border-orange-400"
                                : "border-gray-200 hover:border-[#00AEEF]"
                        }
                      `}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <img
                          src={ref.avatar || "/default-avatar.png"}
                          alt={ref.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          onError={(e) =>
                            (e.target.src = "/default-avatar.png")
                          }
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium">
                              {ref.name || "Unnamed Referee"}{" "}
                              {ref?.jourcy_number
                                ? `#${ref.jourcy_number}`
                                : ""}
                            </p>
                            {ref.is_assigned_to_this_slot && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                                Currently Assigned
                              </span>
                            )}
                            {isSelected && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="inline-block"
                              >
                                <Select
                                  size="small"
                                  value={selectedObj?.assignedPositionId}
                                  onChange={(val) =>
                                    handlePositionChangeForReferee(ref.id, val)
                                  }
                                  className="min-w-[140px]"
                                  options={courtPositions.map((cp) => ({
                                    value: cp.id,
                                    label: cp.position,
                                  }))}
                                />
                              </div>
                            )}
                            {isHardConflict && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                                Conflicting Assignment
                              </span>
                            )}
                            {isSoftRisk && (
                              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                                Fatigue Risk
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            Contact: {ref.phone}
                          </p>
                          <p className="text-xs font-semibold text-gray-500">
                            Total Games Assigned: {ref.total_assignments}
                          </p>
                          {ref.status_message && (
                            <p
                              className={`text-xs mt-1 ${isHardConflict ? "text-red-600" : "text-orange-600"}`}
                            >
                              {ref.status_message}
                            </p>
                          )}
                        </div>
                      </div>

                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className={`w-5 h-5 rounded ${
                          isHardConflict
                            ? "text-red-500"
                            : isSoftRisk
                              ? "text-orange-500"
                              : "text-[#00AEEF]"
                        } focus:ring-2`}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </TabPane>

        {/* ========== CREW TAB ========== */}
        <TabPane tab="Assign Crew" key="crew">
          <div className="mt-6">
            {hasIndividualReferees && (
              <div className="p-4 bg-orange-50 border border-orange-300 rounded-lg text-orange-800 mb-6">
                <p className="font-medium flex items-center gap-2">
                  <ImBlocked /> Individual Referees Already Assigned
                </p>
                <p className="text-sm mt-1">
                  Remove individual referees first to assign a crew.
                </p>
              </div>
            )}

            <p className="text-sm text-gray-600 mb-6">
              Select one pre-made crew to assign all its members to this time
              slot.
            </p>

            {loadingCrews ? (
              <div className="text-center py-16">
                <Spin size="large" />
              </div>
            ) : crewListData.length === 0 ? (
              <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl">
                No crews available for this camp.
              </div>
            ) : (
              <div
                className={`space-y-4 h-[460px] overflow-y-auto ${
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
                          toast.error(
                            "Remove assigned individual referees first",
                          );
                          return;
                        }

                        // ── Show warning for conflicted crews, but still allow selection ──
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
                border-2 rounded-xl p-6 transition-all relative cursor-pointer
                hover:shadow-md hover:border-[#00AEEF]/70
                ${isSelected ? "border-[#00AEEF] bg-blue-50 shadow-lg ring-2 ring-[#00AEEF]/30" : "border-gray-200"}
                ${hasIndividualReferees ? "opacity-50 cursor-not-allowed" : ""}
              `}
                    >
                      {/* Conflict indicator – always visible, but not disabling */}
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
                              <h4 className="font-bold text-lg">{crew.name}</h4>
                              <span
                                className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${
                                  crew.status === "active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {crew.status}
                              </span>
                            </div>

                            <p className="text-sm text-gray-600">
                              {crew.member_count || crew.members?.length || 0}{" "}
                              members
                            </p>

                            {/* Avatars */}
                            <div className="flex flex-wrap gap-2 mt-5 -space-x-3">
                              {(crew.members || [])
                                .slice(0, 10)
                                .map((member) => (
                                  <img
                                    key={member.id}
                                    src={member.avatar || "/default-avatar.png"}
                                    alt={member.name}
                                    title={member.name}
                                    className="w-11 h-11 rounded-full border-3 border-white shadow-md object-cover"
                                    onError={(e) =>
                                      (e.target.src = "/default-avatar.png")
                                    }
                                  />
                                ))}
                              {(crew.members || []).length > 10 && (
                                <div className="w-11 h-11 rounded-full bg-gray-200 border-3 border-white flex items-center justify-center text-sm font-bold text-gray-600 shadow-md">
                                  +{(crew.members || []).length - 10}
                                </div>
                              )}
                            </div>

                            {/* Crew members with names & jersey numbers */}
                            {(crew.members || []).length > 0 && (
                              <div className="mt-4 rounded-xl bg-white border border-border divide-y divide-border overflow-hidden max-h-48 overflow-y-auto">
                                {crew.members.map((member) => (
                                  <div
                                    key={member.id}
                                    className="flex items-center gap-2.5 px-3 py-2"
                                  >
                                    <img
                                      src={member.avatar || "/default-avatar.png"}
                                      alt={member.name || "crew member"}
                                      className="w-7 h-7 rounded-full object-cover border border-gray-200 bg-white shrink-0"
                                      onError={(e) =>
                                        (e.target.src = "/default-avatar.png")
                                      }
                                    />
                                    <span className="text-sm font-medium text-[#333] truncate flex-1">
                                      {member.name || "Unnamed Referee"}
                                    </span>
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
        </TabPane>
      </Tabs>

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
          className={`min-w-[200px] w-full sm:w-auto ${
            activeTab === "referees" &&
            selectedReferees.some((r) => getConflictType(r) === "soft")
              ? "ring-2 ring-orange-400"
              : ""
          }`}
        >
          {primaryButtonText()}
        </CommonSubmitBtn>
      </div>
    </Modal>
  );
};

export default ScheduleAddModal;
