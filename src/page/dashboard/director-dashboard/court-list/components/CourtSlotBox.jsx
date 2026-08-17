// components/schedule/CourtSlotBox.jsx
import { cn } from "@/lib/utils";
import { TiPlus } from "react-icons/ti";
import { HiXMark } from "react-icons/hi2";
import { LuLock, LuUsers, LuUser, LuLoaderCircle } from "react-icons/lu";
import Swal from "sweetalert2";
import { useRemoveAssignment } from "@/hooks/api/director-hooks/useGameAssingments";
import { getRefereePositions } from "@/utils/refereePositions";

const CourtSlotBox = ({
  court,
  timeSlot,
  isBlocked,
  referees: incomingReferees = [],
  onUndoBlock,
  onClick,
  campId,
  selectedDate,
  maxReferees = 2,
  isBlockPending = false,
  sportName = "",
  isDimmed = false,
  searchQuery = "",
  assignmentType = "referees",
  onToggleSlotMode,
}) => {
  // ── Remove assignment mutation ────────────────────────────
  const removeMutation = useRemoveAssignment(campId, selectedDate);

  // Determine if there's a crew assignment
  const crewAssignment = incomingReferees.find((a) => a.type === "crew");
  const individualReferees = incomingReferees.filter(
    (a) => a.type === "individual",
  );
  const hasCrew = !!crewAssignment;
  const memberCount =
    crewAssignment?.member_count || crewAssignment?.members?.length || 0;

  const positionsList = getRefereePositions(campId, sportName, maxReferees);

  const isRefereeMatch = (ref, query) => {
    if (!query) return false;
    const lower = query.toLowerCase();
    const name = ref?.referee_name || ref?.name || "";
    const email = ref?.referee_email || ref?.email || "";
    return name.toLowerCase().includes(lower) || email.toLowerCase().includes(lower);
  };

  const handleRemove = async (e, assignmentId, name) => {
    e.stopPropagation();

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

  const handleUndoClick = (e) => {
    e.stopPropagation();
    onUndoBlock(court.slot_id);
  };

  const handleBoxClick = () => {
    if (isBlocked) return;
    onClick?.(court, timeSlot);
  };

  return (
    <div
      onClick={handleBoxClick}
      className={cn(
        "shrink-0 w-64 rounded-xl border bg-white p-4 min-h-[230px] flex flex-col justify-between transition-all duration-300",
        isBlocked
          ? "border-gray-200 bg-gray-50 cursor-not-allowed"
          : "border-border cursor-pointer hover:border-primary/50 hover:shadow-md hover:shadow-primary/5",
        isDimmed && "opacity-25 pointer-events-none scale-98 shadow-none"
      )}
    >
      {isBlocked ? (
        // === Blocked Slot ===
        <div className="flex flex-col items-center justify-center gap-3 py-4 w-full h-full my-auto">
          <span className="w-12 h-12 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center">
            <LuLock size={20} />
          </span>
          <p className="text-sm font-medium text-gray-400">Blocked</p>
          <button
            onClick={handleUndoClick}
            disabled={isBlockPending}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors cursor-pointer disabled:opacity-60"
          >
            {isBlockPending && (
              <LuLoaderCircle className="w-3 h-3 animate-spin" />
            )}
            {isBlockPending ? "Unblocking..." : "Unblock slot"}
          </button>
        </div>
      ) : hasCrew ? (
        // === Crew Assigned View ===
        <div className="w-full text-center my-auto">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-purple-700 bg-purple-50 border border-purple-100 rounded-full px-3 py-1">
            <LuUsers size={12} /> Crew Assigned
          </span>

          <p className={cn(
            "font-bold text-lg mt-3 transition-all duration-200 rounded px-2 py-0.5 inline-block",
            searchQuery && crewAssignment.crew_name?.toLowerCase().includes(searchQuery.toLowerCase())
              ? "text-primary bg-primary/10 border border-primary/30 ring-2 ring-primary/10"
              : "text-[#333]"
          )}>
            {crewAssignment.crew_name || "Unnamed Crew"}
          </p>
          <p className="text-sm text-gray-500 mt-0.5">
            {memberCount} member{memberCount === 1 ? "" : "s"}
          </p>

          {/* Crew members with names & jersey numbers */}
          {(crewAssignment.members || []).length > 0 && (
            <div className="max-h-40 overflow-y-auto w-full mt-3 space-y-1.5 text-left scrollbar-thin scrollbar-thumb-gray-300">
              {crewAssignment.members.map((member) => {
                const crewId = crewAssignment.crew_id || crewAssignment.id || crewAssignment.assignment_id;
                const crewPositions = JSON.parse(
                  localStorage.getItem(`crew_positions_${crewId}`) || "{}"
                );
                const posName = member.position_name || crewPositions[member.referee_id || member.id];
                const isMatched = searchQuery && isRefereeMatch(member, searchQuery);

                return (
                  <div
                    key={member.referee_id || member.id}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition-all duration-200 border",
                      isMatched
                        ? "bg-primary/15 border-primary ring-2 ring-primary/20 shadow-xs"
                        : "bg-gray-50 border-border"
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
                      <span className="text-xs font-semibold text-[#333] truncate block leading-tight">
                        {member.referee_name || member.name || "Unnamed Referee"}
                      </span>
                    </div>
                    {(member.jersey_number || member.jourcy_number) && (
                      <span className="ml-auto shrink-0 text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                        #{member.jersey_number || member.jourcy_number}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <button
            onClick={(e) =>
              handleRemove(
                e,
                crewAssignment.assignment_id,
                crewAssignment.crew_name,
              )
            }
            disabled={removeMutation.isPending}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            Remove crew
          </button>
        </div>
      ) : (
        // === Unassigned/Empty Slot or Individual Referees View ===
        <div className="w-full flex flex-col h-full justify-between">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#666]">
              {assignmentType === "crews" ? "Crew Assignment" : "Positions"}
            </span>
            {individualReferees.length === 0 ? (
              <div className="bg-gray-100 p-0.5 rounded-full flex items-center shrink-0 border border-gray-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (assignmentType !== "referees") {
                      onToggleSlotMode?.(court.slot_id);
                    }
                  }}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${assignmentType === "referees"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                    }`}
                  title="Switch to Individual Referees"
                >
                  <LuUser size={13} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (assignmentType !== "crews") {
                      onToggleSlotMode?.(court.slot_id);
                    }
                  }}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${assignmentType === "crews"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                    }`}
                  title="Switch to Crew Mode"
                >
                  <LuUsers size={13} />
                </button>
              </div>
            ) : (
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {individualReferees.length}/{maxReferees}
              </span>
            )}
          </div>

          {assignmentType === "crews" ? (
            // === Empty Crew Slot ===
            <div className="flex flex-col items-center justify-center gap-3 py-6 flex-1 w-full my-auto">
              <button className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all cursor-pointer">
                <TiPlus className="text-3xl" />
              </button>
              <p className="text-xs text-gray-400">Tap to assign crew</p>
            </div>
          ) : (
            // === Individual Referees & Empty Positions View ===
            <div className="space-y-2.5 flex-1 flex flex-col justify-center">
              {positionsList.map((positionName, idx) => {
                const item = individualReferees[idx];

                if (item) {
                  const refereeName = item?.referee_name || "Unknown Referee";
                  const jerseyNumber = item?.jourcy_number;

                  const isMatched = searchQuery && isRefereeMatch(item, searchQuery);

                  return (
                    <div
                      key={item.assignment_id || idx}
                      className={cn(
                        "group flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 border hover:border-primary/30 transition-all",
                        isMatched
                          ? "bg-primary/15 border-primary ring-2 ring-primary/20 shadow-xs"
                          : "bg-gray-50 border-border"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={item?.avatar || "/default-avatar.png"}
                          alt={refereeName}
                          onError={(e) => {
                            e.target.src = "/default-avatar.png";
                          }}
                          className="w-7 h-7 rounded-full object-cover border border-gray-200 bg-white shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-primary leading-none">
                            {positionName}
                          </p>
                          <p className="text-xs font-semibold text-[#333] truncate mt-0.5 leading-tight">
                            {refereeName}
                          </p>
                        </div>
                        {jerseyNumber && (
                          <span className="shrink-0 text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full ml-1">
                            #{jerseyNumber}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) =>
                          handleRemove(e, item?.assignment_id, refereeName)
                        }
                        disabled={removeMutation.isPending}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 p-0.5 cursor-pointer shrink-0"
                        title={`Unassign ${positionName}`}
                      >
                        <HiXMark className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                }

                // Position is empty
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 rounded-lg border border-dashed border-gray-200 px-2.5 py-2 hover:border-primary/50 hover:bg-primary/[0.01] transition-all group/empty"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-gray-400 group-hover/empty:text-primary group-hover/empty:bg-primary/10 transition-colors">
                        <TiPlus className="text-sm" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 group-hover/empty:text-primary transition-colors leading-none">
                          {positionName}
                        </p>
                        <p className="text-[11px] text-gray-400/80 leading-none mt-1">
                          Unassigned
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-primary opacity-0 group-hover/empty:opacity-100 transition-opacity shrink-0">
                      Assign
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourtSlotBox;
