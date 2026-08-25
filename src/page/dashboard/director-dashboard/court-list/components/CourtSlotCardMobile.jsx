// components/schedule/CourtSlotCardMobile.jsx
// Compact, thumb-friendly court card used in the mobile (< lg) layout.
import { LuPencil, LuLock, LuPlus, LuUsers, LuUser, LuLoaderCircle } from "react-icons/lu";
import { HiXMark } from "react-icons/hi2";
import Swal from "sweetalert2";
import { useRemoveAssignment } from "@/hooks/api/director-hooks/useGameAssingments";
import { getCourtPositions, getPositionReferee } from "@/utils/refereePositions";
import { cn } from "@/lib/utils";

const CourtSlotCardMobile = ({
  court,
  timeSlot,
  isBlocked = false,
  campId,
  selectedDate,
  maxReferees = 2,
  address,
  onOpen,
  onToggleBlock,
  isEditing = false,
  editValue = "",
  setEditValue,
  inputRef,
  isTogglePending = false,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  sportName = "",
  isDimmed = false,
  searchQuery = "",
  assignmentType = "referees",
  onToggleSlotMode,
}) => {
  // ── Remove assignment mutation ────────────────────────────
  const removeMutation = useRemoveAssignment(campId, selectedDate);

  const courtName = court.court_name || `Court ${court.court_number}`;
  const crewAssignment = (court.assignments || []).find(
    (a) => a.type === "crew" || a.is_crew || a.crew_id,
  );
  const hasCrew = !!crewAssignment;
  const memberCount =
    crewAssignment?.member_count ||
    crewAssignment?.members?.length ||
    0;

  const courtPositions = getCourtPositions(court, maxReferees);

  const stop = (e) => e.stopPropagation();

  const handleRemove = async (e, assignmentId, name) => {
    stop(e);

    const result = await Swal.fire({
      title: "Remove Assignment?",
      text: `Are you sure you want to remove ${name || "this assignment"}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      removeMutation.mutate(assignmentId);
    }
  };

  const isRefereeMatch = (ref, query) => {
    if (!query) return false;
    const lower = query.toLowerCase();
    const name = ref?.referee_name || ref?.name || "";
    const email = ref?.referee_email || ref?.email || "";
    return name.toLowerCase().includes(lower) || email.toLowerCase().includes(lower);
  };

  const handleCardClick = (position = null) => {
    if (isBlocked) return;
    onOpen?.(court, timeSlot, position);
  };

  const assignedPositionsCount = courtPositions.filter(
    (p) => p.is_assigned || getPositionReferee(p, court.assignments),
  ).length;

  // ── Blocked state ─────────────────────────────────────────
  if (isBlocked) {
    return (
      <div className="px-4 py-4 flex items-center justify-between gap-3 bg-gray-50/80">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-9 h-9 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center shrink-0">
            <LuLock size={16} />
          </span>
          <div className="min-w-0">
            <p className="font-medium text-[#333] truncate">{courtName}</p>
            {address && (
              <p className="text-xs text-gray-400 truncate">{address}</p>
            )}
          </div>
        </div>
        <button
          onClick={(e) => {
            stop(e);
            onToggleBlock(court.slot_id);
          }}
          disabled={isTogglePending}
          className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors cursor-pointer disabled:opacity-60"
        >
          {isTogglePending && <LuLoaderCircle className="w-3.5 h-3.5 animate-spin" />}
          {isTogglePending ? "Unblocking..." : "Unblock"}
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => handleCardClick(null)}
      className={cn(
        "px-4 py-4 cursor-pointer active:bg-primary/[0.03] transition-all duration-300",
        isDimmed && "opacity-25 pointer-events-none scale-98"
      )}
    >
      {/* Header: court name + actions */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onSaveEdit(court.location_id, court.court_number);
                } else if (e.key === "Escape") {
                  onCancelEdit();
                }
              }}
              className="w-40 text-sm font-semibold text-primary bg-white border border-primary/40 rounded-lg px-2 py-1.5 outline-none ring-2 ring-primary/20"
              placeholder="Court name..."
            />
          ) : (
            <span className="font-semibold text-[#333] truncate">
              {courtName}
            </span>
          )}
          {!isEditing && address && (
            <span className="text-xs text-gray-400 truncate hidden sm:inline">
              {address}
            </span>
          )}
          <button
            onClick={(e) => {
              stop(e);
              isEditing ? onCancelEdit() : onStartEdit(courtName);
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors shrink-0"
            title="Rename court"
          >
            <LuPencil size={15} />
          </button>
        </div>

        <button
          onClick={(e) => {
            stop(e);
            onToggleBlock(court.slot_id);
          }}
          disabled={isTogglePending}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all cursor-pointer disabled:opacity-60"
        >
          {isTogglePending ? (
            <LuLoaderCircle className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <LuLock size={13} />
          )}
          {isTogglePending ? "Blocking..." : "Block"}
        </button>
      </div>

      {/* Body */}
      <div className="mt-3">
        {assignedPositionsCount === 0 && !hasCrew ? (
          // === Unassigned/Empty Slot View ===
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#666]">
                {assignmentType === "crews" ? "Crew Assignment" : "Positions"}
              </span>
              {/* Switcher Pill */}
              <div className="bg-gray-100 p-0.5 rounded-full flex items-center shrink-0 border border-gray-200 shadow-sm">
                <button
                  onClick={(e) => {
                    stop(e);
                    if (assignmentType !== "referees") {
                      onToggleSlotMode?.(court.slot_id);
                    }
                  }}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    assignmentType === "referees"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  title="Switch to Individual Referees"
                >
                  <LuUser size={13} />
                </button>
                <button
                  onClick={(e) => {
                    stop(e);
                    if (assignmentType !== "crews") {
                      onToggleSlotMode?.(court.slot_id);
                    }
                  }}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    assignmentType === "crews"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  title="Switch to Crew Mode"
                >
                  <LuUsers size={13} />
                </button>
              </div>
            </div>

            {assignmentType === "crews" ? (
              <div
                onClick={() => handleCardClick(null)}
                className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 px-4 py-4 text-sm font-medium text-gray-400 hover:border-purple-300 hover:bg-purple-50/10 transition-all cursor-pointer"
              >
                <LuPlus size={16} className="text-purple-600 animate-pulse" />
                Assign Crew
              </div>
            ) : (
              <div className="space-y-2.5">
                {courtPositions.map((pos, idx) => (
                  <div
                    key={pos.id || idx}
                    onClick={(e) => {
                      stop(e);
                      handleCardClick(pos);
                    }}
                    className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-gray-200 px-3.5 py-3 hover:border-primary/50 hover:bg-primary/[0.01] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-gray-400">
                        <LuPlus size={14} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 leading-none">
                          {pos.position || `Position ${idx + 1}`}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Unassigned
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-primary">
                      Assign
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : hasCrew ? (
          // === Has Crew Assignment ===
          <div className="space-y-2">
            {/* Crew Info Header Block */}
            <div className={cn(
              "flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 border transition-all duration-200",
              searchQuery && crewAssignment.crew_name?.toLowerCase().includes(searchQuery.toLowerCase())
                ? "bg-primary/10 border-primary ring-2 ring-primary/10"
                : "bg-purple-50 border-purple-100"
            )}>
              <div className="flex items-center gap-3 min-w-0">
                <span className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                  searchQuery && crewAssignment.crew_name?.toLowerCase().includes(searchQuery.toLowerCase())
                    ? "bg-primary/20 text-primary"
                    : "bg-purple-100 text-purple-700"
                )}>
                  <LuUsers size={16} />
                </span>
                <div className="min-w-0">
                  <p className={cn(
                    "text-sm font-semibold truncate",
                    searchQuery && crewAssignment.crew_name?.toLowerCase().includes(searchQuery.toLowerCase())
                      ? "text-primary"
                      : "text-purple-800"
                  )}>
                    {crewAssignment.crew_name || "Unnamed Crew"}
                  </p>
                  <p className="text-xs text-purple-600">
                    {memberCount} member{memberCount === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) =>
                  handleRemove(
                    e,
                    crewAssignment.assignment_id || crewAssignment.id,
                    crewAssignment.crew_name,
                  )
                }
                disabled={removeMutation.isPending}
                className="shrink-0 text-xs font-medium text-purple-600 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-full border border-purple-200 hover:border-red-200 transition-colors cursor-pointer"
              >
                Remove
              </button>
            </div>

            {/* Crew members with names & jersey numbers */}
            {(crewAssignment.members || []).length > 0 && (
              <div className="rounded-xl bg-gray-50 border border-border divide-y divide-border overflow-hidden">
                {crewAssignment.members.map((member) => {
                  const posName = member.position_name || member.position;
                  const isMatched = searchQuery && isRefereeMatch(member, searchQuery);

                  return (
                    <div
                      key={member.referee_id || member.id}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 transition-all duration-200 border-l-4",
                        isMatched
                          ? "bg-primary/15 border-l-primary"
                          : "bg-transparent border-l-transparent"
                      )}
                    >
                      <img
                        src={member.avatar || ""}
                        alt={member.referee_name || member.name || "crew member"}
                        className="w-7 h-7 rounded-full object-cover border border-gray-200 bg-white shrink-0"
                        onError={(e) => {
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        {posName && (
                          <p className="text-[9px] font-bold uppercase tracking-wider text-primary leading-none mb-0.5">
                            {posName}
                          </p>
                        )}
                        <span className="text-sm font-medium text-[#333] truncate block leading-tight">
                          {member.referee_name || member.name || "Unnamed Referee"}
                        </span>
                      </div>
                      {(member.jersey_number || member.jourcy_number) && (
                        <span className="shrink-0 text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full ml-1">
                          #{member.jersey_number || member.jourcy_number}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          // === Has Individual Assignments ===
          <div className="space-y-2.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#666]">
                Positions
              </span>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {assignedPositionsCount}/{courtPositions.length}
              </span>
            </div>
            {courtPositions.map((pos, idx) => {
              const assignedRef = getPositionReferee(pos, court.assignments);
              const positionName = pos.position || `Position ${idx + 1}`;

              if (assignedRef) {
                const refereeName = assignedRef?.referee_name || assignedRef?.name || "Unknown Referee";
                const jerseyNumber = assignedRef?.jourcy_number || assignedRef?.jersey_number;
                const isMatched = searchQuery && isRefereeMatch(assignedRef, searchQuery);
                const removeId = pos.game_slot_assignment_id || assignedRef?.assignment_id || assignedRef?.id;

                return (
                  <div
                    key={pos.id || idx}
                    onClick={(e) => {
                      stop(e);
                      handleCardClick(pos);
                    }}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 transition-all duration-200 cursor-pointer",
                      isMatched
                        ? "bg-primary/15 border-primary ring-2 ring-primary/20 shadow-xs"
                        : "bg-gray-50 border-border"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={assignedRef?.avatar || "/default-avatar.png"}
                        alt={refereeName}
                        onError={(e) => {
                          e.target.src = "/default-avatar.png";
                        }}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200 bg-white shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-primary leading-none">
                          {positionName}
                        </p>
                        <p className="text-sm font-semibold text-[#333] truncate mt-1 leading-tight">
                          {refereeName}
                        </p>
                      </div>
                      {jerseyNumber && (
                        <span className="shrink-0 text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full ml-1">
                          #{jerseyNumber}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleRemove(e, removeId, refereeName)}
                      disabled={removeMutation.isPending}
                      className="shrink-0 text-gray-400 hover:text-red-500 p-1.5 cursor-pointer transition-colors"
                      title={`Unassign ${positionName}`}
                    >
                      <HiXMark className="w-4.5 h-4.5" />
                    </button>
                  </div>
                );
              }

              // Position is empty
              return (
                <div
                  key={pos.id || idx}
                  onClick={(e) => {
                    stop(e);
                    handleCardClick(pos);
                  }}
                  className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-gray-200 px-3.5 py-3 hover:border-primary/50 hover:bg-primary/[0.01] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-gray-400">
                      <LuPlus size={14} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 leading-none">
                        {positionName}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Unassigned
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-primary">
                    Assign
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourtSlotCardMobile;
