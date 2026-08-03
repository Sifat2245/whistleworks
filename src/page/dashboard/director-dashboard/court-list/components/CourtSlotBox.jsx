// components/schedule/CourtSlotBox.jsx
import { cn } from "@/lib/utils";
import { TiPlus } from "react-icons/ti";
import { HiXMark } from "react-icons/hi2";
import { LuLock, LuUsers, LuLoaderCircle } from "react-icons/lu";
import Swal from "sweetalert2";
import { useRemoveAssignment } from "@/hooks/api/director-hooks/useGameAssingments";

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
        "shrink-0 w-64 rounded-xl border bg-white p-4 min-h-[230px] flex flex-col items-center justify-center transition-all",
        isBlocked
          ? "border-gray-200 bg-gray-50 cursor-not-allowed"
          : "border-border cursor-pointer hover:border-primary/50 hover:shadow-md hover:shadow-primary/5",
      )}
    >
      {isBlocked ? (
        // === Blocked Slot ===
        <div className="flex flex-col items-center gap-3 py-4">
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
        <div className="w-full text-center">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-purple-700 bg-purple-50 border border-purple-100 rounded-full px-3 py-1">
            <LuUsers size={12} /> Crew Assigned
          </span>

          <p className="font-bold text-lg text-[#333] mt-3">
            {crewAssignment.crew_name || "Unnamed Crew"}
          </p>
          <p className="text-sm text-gray-500 mt-0.5">
            {memberCount} member{memberCount === 1 ? "" : "s"}
          </p>

          {/* Crew members with names & jersey numbers */}
          {(crewAssignment.members || []).length > 0 && (
            <div className="max-h-40 overflow-y-auto w-full mt-3 space-y-1.5 text-left scrollbar-thin scrollbar-thumb-gray-300">
              {crewAssignment.members.map((member) => (
                <div
                  key={member.referee_id}
                  className="flex items-center gap-2.5 rounded-lg bg-gray-50 border border-border px-2.5 py-1.5"
                >
                  <img
                    src={member.avatar || ""}
                    alt={member.referee_name || "crew member"}
                    className="w-7 h-7 rounded-full object-cover border border-gray-200 bg-white shrink-0"
                  />
                  <span className="text-sm font-medium text-[#333] truncate">
                    {member.referee_name || "Unnamed Referee"}
                  </span>
                  {member.jersey_number && (
                    <span className="ml-auto shrink-0 text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      #{member.jersey_number}
                    </span>
                  )}
                </div>
              ))}
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
      ) : individualReferees.length > 0 ? (
        // === Individual Referees View ===
        <div className="w-full text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#666]">
              Referees
            </span>
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {individualReferees.length}/{maxReferees}
            </span>
          </div>

          <div className="space-y-2">
            {individualReferees.map((item, idx) => {
              const refereeName = item?.referee_name || "Unknown Referee";
              const jerseyNumber = item?.jourcy_number;

              return (
                <div
                  key={item.assignment_id || idx}
                  className="group flex items-center justify-between gap-2 rounded-lg bg-gray-50 border border-border px-2.5 py-1.5 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={item?.avatar}
                      alt={refereeName}
                      className="w-7 h-7 rounded-full object-cover border border-gray-200 bg-white shrink-0"
                    />
                    <span className="text-sm font-medium text-[#333] truncate min-w-0">
                      {refereeName}
                    </span>
                    {jerseyNumber && (
                      <span className="shrink-0 text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        #{jerseyNumber}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) =>
                      handleRemove(e, item?.assignment_id, refereeName)
                    }
                    disabled={removeMutation.isPending}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 p-0.5 cursor-pointer"
                    title="Unassign referee"
                  >
                    <HiXMark className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {individualReferees.length < maxReferees && (
            <p className="mt-3 text-center text-xs text-gray-400">
              {maxReferees - individualReferees.length} spot
              {maxReferees - individualReferees.length === 1 ? "" : "s"} open
            </p>
          )}
        </div>
      ) : (
        // === Empty Slot ===
        <div className="flex flex-col items-center gap-3 py-4">
          <button className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
            <TiPlus className="text-3xl" />
          </button>
          <p className="text-xs text-gray-400">Tap to assign referees</p>
        </div>
      )}
    </div>
  );
};

export default CourtSlotBox;
