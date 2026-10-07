import { useState, useEffect, useMemo, useCallback } from "react";
import { Modal, Input, Tabs, Radio, Spin, Tooltip } from "antd";

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
import {
  getCourtPositions,
  getPositionReferee,
  formatRefereePosition,
} from "@/utils/refereePositions";

const { Search } = Input;
const { TabPane } = Tabs;

/**
 * Robust referee matching helper covering IDs, referee_id, assignment_id, and email.
 */
const isRefMatching = (r, targetRef) => {
  if (!r || !targetRef) return false;
  const rId = r.id || r.referee_id;
  const targetId = targetRef.id || targetRef.referee_id;
  if (rId && targetId && String(rId) === String(targetId)) return true;
  if (
    r.assignment_id &&
    targetRef.assignment_id &&
    String(r.assignment_id) === String(targetRef.assignment_id)
  ) {
    return true;
  }
  if (
    r.email &&
    targetRef.email &&
    r.email.toLowerCase().trim() === targetRef.email.toLowerCase().trim()
  ) {
    return true;
  }
  return false;
};

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
  assignmentType = "individual",
}) => {
  const isCrewMode = assignmentType === "crew" || assignmentType === "crews";
  const [activeTab, setActiveTab] = useState(isCrewMode ? "crew" : "referees");
  const [selectedReferees, setSelectedReferees] = useState([]);
  const [selectedCrew, setSelectedCrew] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [focusedTargetPosId, setFocusedTargetPosId] = useState(
    selectedPosition?.id || null,
  );

  const courtPositions = getCourtPositions(selectedCourt, maxReferees);

  // Extract currently assigned referees directly from selectedCourt positions / assignments
  const getInitiallyAssignedReferees = useCallback(() => {
    const assigned = [];
    const positions = getCourtPositions(selectedCourt, maxReferees);
    const assignments = selectedCourt?.assignments || [];

    positions.forEach((pos, idx) => {
      const rawRef =
        pos.referee ||
        (pos.is_assigned && getPositionReferee(pos, assignments)) ||
        (!pos.referee && assignments[idx]);

      if (rawRef && rawRef.type !== "crew" && !rawRef.is_crew) {
        const refId = rawRef.id || rawRef.referee_id;
        const refName = rawRef.name || rawRef.referee_name;
        if (refId || refName) {
          assigned.push({
            id: refId,
            referee_id: refId,
            name: refName,
            referee_name: refName,
            email: rawRef.email || rawRef.referee_email || "",
            phone: rawRef.phone || rawRef.contact || "",
            avatar:
              rawRef.avatar ||
              rawRef.photo ||
              rawRef.image ||
              rawRef.profile_image ||
              "/default-avatar.png",
            jersey_number: rawRef.jersey_number || rawRef.jourcy_number || "",
            jourcy_number: rawRef.jourcy_number || rawRef.jersey_number || "",
            assignment_id:
              pos.game_slot_assignment_id || rawRef.assignment_id || rawRef.id,
            assignedPositionId: pos.id || idx + 1,
            is_assigned_to_this_slot: true,
            status: rawRef.status || "already_assigned",
            status_message:
              rawRef.status_message || "Already assigned to this slot",
          });
        }
      }
    });
    return assigned;
  }, [selectedCourt, maxReferees]);

  // Reset & populate initially assigned referees on open or court change
  useEffect(() => {
    if (isModalOpen) {
      const initialAssigned = getInitiallyAssignedReferees();
      setSelectedReferees(initialAssigned);
      setSelectedCrew(null);
      setSearchTerm("");
      setActiveTab(isCrewMode ? "crew" : "referees");
      setFocusedTargetPosId(selectedPosition?.id || null);
    }
  }, [
    isModalOpen,
    assignmentType,
    selectedPosition,
    isCrewMode,
    selectedCourt,
    getInitiallyAssignedReferees,
  ]);

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

  // Enhance pre-selected assigned referees with detailed API list data
  useEffect(() => {
    if (refereeListData.length > 0 && activeTab === "referees") {
      setSelectedReferees((prev) => {
        const currentList =
          prev.length > 0 ? prev : getInitiallyAssignedReferees();

        const enriched = currentList.map((cur) => {
          const matchedInApi = refereeListData.find((apiRef) =>
            isRefMatching(cur, apiRef),
          );
          if (matchedInApi) {
            return {
              ...matchedInApi,
              ...cur,
              id: matchedInApi.id || cur.id,
              name: matchedInApi.name || cur.name,
              avatar: matchedInApi.avatar || cur.avatar,
              assignedPositionId: cur.assignedPositionId,
            };
          }
          return cur;
        });

        // Also check if refereeListData has any referee flagged as is_assigned_to_this_slot
        refereeListData.forEach((apiRef, idx) => {
          const isAssigned =
            apiRef.is_assigned_to_this_slot ||
            apiRef.status === "already_assigned" ||
            apiRef.status_message
              ?.toLowerCase()
              .includes("already assigned to this slot");

          if (isAssigned) {
            const alreadyInEnriched = enriched.some((e) =>
              isRefMatching(e, apiRef),
            );

            if (!alreadyInEnriched) {
              const matchedPos = courtPositions.find(
                (p) =>
                  isRefMatching(p.referee, apiRef) ||
                  (p.game_slot_assignment_id &&
                    String(p.game_slot_assignment_id) ===
                      String(apiRef.assignment_id)) ||
                  (!enriched.some(
                    (e) => String(e.assignedPositionId) === String(p.id),
                  ) &&
                    (p.is_assigned || p.referee)),
              );

              const fallbackPosId =
                matchedPos?.id ||
                courtPositions.find(
                  (p) =>
                    !enriched.some(
                      (e) => String(e.assignedPositionId) === String(p.id),
                    ),
                )?.id ||
                courtPositions[idx]?.id ||
                idx + 1;

              enriched.push({
                ...apiRef,
                assignedPositionId: fallbackPosId,
              });
            }
          }
        });

        return enriched;
      });
    }
  }, [
    refereeListData,
    activeTab,
    selectedCourt,
    courtPositions,
    getInitiallyAssignedReferees,
  ]);

  // Search filter — always include currently assigned
  const filteredReferees = useMemo(() => {
    if (activeTab !== "referees") return [];
    if (!searchTerm.trim()) return refereeListData;

    const lower = searchTerm.toLowerCase();
    return refereeListData.filter((ref) => {
      const isAssigned =
        ref.is_assigned_to_this_slot ||
        selectedReferees.some((r) => isRefMatching(r, ref));
      if (isAssigned) return true;
      return (
        ref.name?.toLowerCase().includes(lower) ||
        ref.email?.toLowerCase().includes(lower)
      );
    });
  }, [refereeListData, searchTerm, activeTab, selectedReferees]);

  // Conflict type detection
  const getConflictType = (ref) => {
    if (
      ref.status === "time_conflict" ||
      ref.status_message?.toLowerCase().includes("another court at this time")
    ) {
      return "hard";
    }
    if (
      ref.status === "needs_rest" ||
      ref.status_message?.toLowerCase().includes("needs rest") ||
      ref.status_message?.toLowerCase().includes("consecutive")
    ) {
      return "soft";
    }
    if (ref.can_assign === false) {
      return "hard";
    }
    return "none";
  };

  const handleRefereeToggle = (referee) => {
    if (hasCrewAssigned) {
      toast.error("Remove the assigned crew first");
      return;
    }

    const refId = referee.id || referee.referee_id;

    setSelectedReferees((prev) => {
      const exists = prev.some((r) => isRefMatching(r, referee));
      if (exists) {
        return prev.filter((r) => !isRefMatching(r, referee));
      }

      const conflictType = getConflictType(referee);
      if (conflictType === "hard") {
        toast.error(
          "This referee is already assigned to another court at this time",
        );
        return prev;
      }

      if (prev.length >= (courtPositions.length || maxReferees)) {
        toast.warning(
          `Maximum ${courtPositions.length || maxReferees} referees allowed`,
        );
        return prev;
      }

      // Determine position ID for newly selected referee
      let targetPosId = null;
      if (
        focusedTargetPosId &&
        !prev.some(
          (r) => String(r.assignedPositionId) === String(focusedTargetPosId),
        )
      ) {
        targetPosId = focusedTargetPosId;
      } else if (
        selectedPosition?.id &&
        !prev.some(
          (r) => String(r.assignedPositionId) === String(selectedPosition.id),
        )
      ) {
        targetPosId = selectedPosition.id;
      } else {
        const usedPosIds = prev.map((r) => String(r.assignedPositionId));
        const firstAvailable = courtPositions.find(
          (p) => !usedPosIds.includes(String(p.id)),
        );
        targetPosId = firstAvailable ? firstAvailable.id : prev.length + 1;
      }

      return [
        ...prev,
        {
          ...referee,
          id: refId,
          name: referee.name || referee.referee_name,
          assignedPositionId: targetPosId,
        },
      ];
    });
  };

  const handlePositionChangeForReferee = (refId, newPosId) => {
    setSelectedReferees((prev) => {
      const currentRef = prev.find((r) =>
        isRefMatching(r, { id: refId, referee_id: refId }),
      );
      if (!currentRef) return prev;
      const oldPosId = currentRef.assignedPositionId;

      const occupant = prev.find(
        (r) =>
          String(r.assignedPositionId) === String(newPosId) &&
          !isRefMatching(r, { id: refId, referee_id: refId }),
      );

      return prev.map((r) => {
        if (isRefMatching(r, { id: refId, referee_id: refId })) {
          return { ...r, assignedPositionId: newPosId };
        }
        if (occupant && isRefMatching(r, occupant)) {
          return { ...r, assignedPositionId: oldPosId };
        }
        return r;
      });
    });
  };

  // Conflict detection
  const hasCrewAssigned =
    !!selectedCourt?.crew ||
    selectedCourt?.assignments?.some(
      (a) => a.is_crew || a.crew_id || a.type === "crew",
    );
  const hasIndividualReferees =
    selectedReferees.length > 0 ||
    refereeListData.some((ref) => ref.is_assigned_to_this_slot) ||
    courtPositions.some((p) => p.is_assigned || p.referee);

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
      const hasRisk = selectedReferees.some(
        (r) =>
          getConflictType(r) === "soft" ||
          r.is_assigned_to_this_court ||
          r.status === "needs_rest",
      );
      const limit = courtPositions.length || maxReferees;
      const base = `Assign Referees (${selectedReferees.length}/${limit})`;
      return hasRisk ? `${base} Fatigue Risk` : base;
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

    const restOrCourtRiskRefs = selectedReferees.filter(
      (r) =>
        r.is_assigned_to_this_court ||
        r.status === "needs_rest" ||
        getConflictType(r) === "soft",
    );
    if (restOrCourtRiskRefs.length > 0) {
      const names = restOrCourtRiskRefs
        .map((r) => `<strong>${r.name}</strong>`)
        .join(", ");
      const result = await Swal.fire({
        title: "Fatigue & Rest Restriction Warning",
        html: `<p>The following referee(s) require rest or were assigned to this court previously:</p><div class="mt-2 text-yellow-800 font-semibold">${names}</div><p class="mt-3">Do you want to assign anyway?</p>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Assign Anyway",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#eab308",
      });
      if (!result.isConfirmed) return;
    }

    // Build position-based payload as requested by API
    const dataPayload = selectedReferees.map((ref, idx) => {
      const posId =
        ref.assignedPositionId || courtPositions[idx]?.id || idx + 1;
      return {
        referee_ids: ref.id || ref.referee_id,
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
                  • Target: {formatRefereePosition(selectedPosition.position)}
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

            {/* Position Allocation Roster Bar */}
            <div className="bg-slate-50 border border-gray-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                  Court Positions ({selectedReferees.length}/
                  {courtPositions.length || maxReferees})
                </span>
                {selectedPosition && (
                  <span className="text-xs font-semibold text-[#00AEEF] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                    Target Slot: {formatRefereePosition(selectedPosition.position)}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {courtPositions.map((pos) => {
                  const assignedRef = selectedReferees.find(
                    (r) => String(r.assignedPositionId) === String(pos.id),
                  );
                  const isTarget =
                    String(selectedPosition?.id) === String(pos.id) ||
                    String(focusedTargetPosId) === String(pos.id);

                  return (
                    <div
                      key={pos.id}
                      onClick={() => {
                        if (!assignedRef) setFocusedTargetPosId(pos.id);
                      }}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        assignedRef
                          ? "bg-white border-blue-200 shadow-sm"
                          : isTarget
                            ? "bg-[#00AEEF]/5 border-[#00AEEF] ring-2 ring-[#00AEEF]/20 cursor-pointer"
                            : "bg-white/60 border-dashed border-gray-300 hover:border-[#00AEEF] cursor-pointer"
                      }`}
                    >
                      {assignedRef ? (
                        <>
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <img
                              src={assignedRef.avatar || "/default-avatar.png"}
                              alt={assignedRef.name || assignedRef.referee_name}
                              className="w-9 h-9 rounded-full object-cover border border-blue-200 shrink-0"
                              onError={(e) =>
                                (e.target.src = "/default-avatar.png")
                              }
                            />
                            <div className="flex flex-col min-w-0">
                              <span className="text-[10px] font-bold text-[#00AEEF] uppercase tracking-wider truncate">
                                {formatRefereePosition(pos.position)}
                              </span>
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="text-xs font-semibold text-gray-800 truncate">
                                  {assignedRef.name ||
                                    assignedRef.referee_name ||
                                    "Assigned Official"}
                                </span>
                                {(assignedRef.jersey_number ||
                                  assignedRef.jourcy_number) && (
                                  <span className="text-[10px] font-bold text-[#00AEEF] bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full shrink-0">
                                    #
                                    {assignedRef.jersey_number ||
                                      assignedRef.jourcy_number}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium py-0.5">
                          <div className="w-8 h-8 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm font-bold">
                            +
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                              {formatRefereePosition(pos.position)}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {isTarget ? "Target Slot" : "Unassigned"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

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
                Selected: {selectedReferees.length}/
                {courtPositions.length || maxReferees}
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
                  const selectedObj = selectedReferees.find((r) =>
                    isRefMatching(r, ref),
                  );
                  const isSelected = !!selectedObj;
                  const conflictType = getConflictType(ref);
                  const isHardConflict = conflictType === "hard";
                  const isSoftRisk = conflictType === "soft";
                  const isAssignedToThisCourt = !!ref.is_assigned_to_this_court;
                  const isNeedsRest = ref.status === "needs_rest" || isSoftRisk;
                  const isCurrentlyAssigned =
                    ref.is_assigned_to_this_slot ||
                    ref.status === "already_assigned" ||
                    ref.status_message
                      ?.toLowerCase()
                      .includes("already assigned to this slot");
                  const disabled =
                    !isSelected &&
                    selectedReferees.length >=
                      (courtPositions.length || maxReferees);

                  return (
                    <div
                      key={ref.id || ref.referee_id}
                      onClick={() =>
                        !hasCrewAssigned &&
                        !disabled &&
                        !isHardConflict &&
                        handleRefereeToggle(ref)
                      }
                      className={`
                        border rounded-2xl p-4 flex flex-col transition-all
                        ${
                          hasCrewAssigned || disabled || isHardConflict
                            ? "opacity-60 cursor-not-allowed"
                            : "cursor-pointer hover:shadow-md"
                        }
                        ${
                          isSelected
                            ? isNeedsRest
                              ? "border-orange-400 bg-orange-50/80 ring-2 ring-orange-200 shadow-md"
                              : isAssignedToThisCourt
                                ? "border-yellow-400 bg-yellow-100/90 ring-2 ring-yellow-300 shadow-md"
                                : "border-[#00AEEF] bg-blue-50/70 shadow-md"
                            : isHardConflict
                              ? "border-red-400 bg-red-50"
                              : isNeedsRest
                                ? "border-orange-300 bg-orange-50/60 hover:border-orange-400"
                                : isAssignedToThisCourt
                                  ? "border-yellow-300 bg-yellow-50/80 hover:border-yellow-400"
                                  : "border-gray-200 hover:border-[#00AEEF]"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between gap-4">
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
                              <p className="font-semibold text-gray-900">
                                {ref.name || "Unnamed Referee"}{" "}
                                {ref?.jourcy_number || ref?.jersey_number
                                  ? `#${ref.jourcy_number || ref.jersey_number}`
                                  : ""}
                              </p>
                              {isCurrentlyAssigned && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                                  Currently Assigned
                                </span>
                              )}
                              {isAssignedToThisCourt && (
                                <span className="text-xs bg-yellow-100 text-yellow-800 border border-yellow-300 px-2 py-0.5 rounded-full font-semibold">
                                  Assigned to this Court Previously
                                </span>
                              )}
                              {ref.status === "needs_rest" && (
                                <span className="text-xs bg-orange-100 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full font-medium">
                                  Needs Rest
                                </span>
                              )}
                              {isHardConflict && (
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                                  Conflicting Assignment
                                </span>
                              )}
                              {isSoftRisk &&
                                !isAssignedToThisCourt &&
                                ref.status !== "needs_rest" && (
                                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                                    Fatigue Risk
                                  </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 mt-0.5">
                              Contact: {ref.phone || ref.contact || "N/A"}
                            </p>
                            <p className="text-xs font-semibold text-gray-500">
                              Total Games Assigned: {ref.total_assignments ?? 0}
                            </p>
                            {ref.status_message && (
                              <p
                                className={`text-xs mt-1 font-medium ${
                                  isHardConflict
                                    ? "text-red-600"
                                    : isNeedsRest
                                      ? "text-orange-600 font-semibold"
                                      : isAssignedToThisCourt
                                        ? "text-yellow-700 font-semibold"
                                        : "text-green-600"
                                }`}
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
                              : isNeedsRest
                                ? "text-orange-500"
                                : isAssignedToThisCourt
                                  ? "text-yellow-600"
                                  : "text-[#00AEEF]"
                          } focus:ring-2`}
                        />
                      </div>

                      {/* Interactive Position Pill Buttons */}
                      {isSelected && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="mt-3 pt-3 border-t border-blue-200/60 flex flex-wrap items-center gap-2"
                        >
                          <span className="text-xs font-semibold text-gray-600 mr-1">
                            Assign Position:
                          </span>
                          {courtPositions.map((cp) => {
                            const isThisPos =
                              String(selectedObj?.assignedPositionId) ===
                              String(cp.id);
                            const occupant = selectedReferees.find(
                              (r) =>
                                String(r.assignedPositionId) ===
                                  String(cp.id) && !isRefMatching(r, ref),
                            );

                            return (
                              <button
                                key={cp.id}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePositionChangeForReferee(
                                    ref.id || ref.referee_id,
                                    cp.id,
                                  );
                                }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                                  isThisPos
                                    ? "bg-[#00AEEF] text-white shadow-md ring-2 ring-[#00AEEF]/30"
                                    : occupant
                                      ? "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                      : "bg-white border border-gray-200 text-gray-700 hover:border-[#00AEEF] hover:text-[#00AEEF]"
                                }`}
                              >
                                <span>
                                  {formatRefereePosition(cp.position)}
                                </span>
                                {isThisPos && (
                                  <span className="text-white text-[11px] font-bold">
                                    ✓
                                  </span>
                                )}
                                {occupant && !isThisPos && (
                                  <span className="text-[10px] text-gray-400 font-normal">
                                    ({occupant.name?.split(" ")[0]})
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
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
                                  <Tooltip
                                    key={member.id}
                                    title={
                                      <div className="text-center">
                                        <p className="font-medium">
                                          {member.name}
                                        </p>
                                        {(member.position ||
                                          member.position_name) && (
                                          <p className="text-xs text-sky-300 font-semibold mt-0.5">
                                            {formatRefereePosition(
                                              member.position ||
                                                member.position_name,
                                            )}
                                          </p>
                                        )}
                                      </div>
                                    }
                                  >
                                    <img
                                      src={
                                        member.avatar || "/default-avatar.png"
                                      }
                                      alt={member.name}
                                      className="w-11 h-11 rounded-full border-3 border-white shadow-md object-cover"
                                      onError={(e) =>
                                        (e.target.src = "/default-avatar.png")
                                      }
                                    />
                                  </Tooltip>
                                ))}
                              {(crew.members || []).length > 10 && (
                                <div className="w-11 h-11 rounded-full bg-gray-200 border-3 border-white flex items-center justify-center text-sm font-bold text-gray-600 shadow-md">
                                  +{(crew.members || []).length - 10}
                                </div>
                              )}
                            </div>

                            {/* Crew members with names, positions & jersey numbers */}
                            {(crew.members || []).length > 0 && (
                              <div className="mt-4 rounded-xl bg-white border border-border divide-y divide-border overflow-hidden max-h-48 overflow-y-auto">
                                {crew.members.map((member) => (
                                  <div
                                    key={member.id}
                                    className="flex items-center gap-2.5 px-3 py-2"
                                  >
                                    <img
                                      src={
                                        member.avatar || "/default-avatar.png"
                                      }
                                      alt={member.name || "crew member"}
                                      className="w-7 h-7 rounded-full object-cover border border-gray-200 bg-white shrink-0"
                                      onError={(e) =>
                                        (e.target.src = "/default-avatar.png")
                                      }
                                    />
                                    <span className="text-sm font-medium text-[#333] truncate flex-1">
                                      {member.name || "Unnamed Referee"}
                                    </span>
                                    {(member.position ||
                                      member.position_name) && (
                                      <span className="shrink-0 text-[11px] font-semibold text-purple-700 bg-purple-100 border border-purple-200 px-2.5 py-0.5 rounded-full">
                                        {formatRefereePosition(
                                          member.position ||
                                            member.position_name,
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
