// components/schedule/CourtSlotCardMobile.jsx
// Compact, thumb-friendly court card used in the mobile (< lg) layout.
import { LuPencil, LuLock, LuPlus, LuUsers, LuLoaderCircle } from "react-icons/lu";
import { HiXMark } from "react-icons/hi2";
import Swal from "sweetalert2";
import { useRemoveAssignment } from "@/hooks/api/director-hooks/useGameAssingments";

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
}) => {
  // ── Remove assignment mutation ────────────────────────────
  const removeMutation = useRemoveAssignment(campId, selectedDate);

  const courtName = court.court_name || `Court ${court.court_number}`;
  const crewAssignment = (court.assignments || []).find(
    (a) => a.type === "crew",
  );
  const individualReferees = (court.assignments || []).filter(
    (a) => a.type === "individual",
  );
  const hasCrew = !!crewAssignment;
  const memberCount =
    crewAssignment?.member_count ||
    crewAssignment?.members?.length ||
    0;

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

  const handleCardClick = () => {
    if (isBlocked) return;
    onOpen?.(court, timeSlot);
  };

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
      onClick={handleCardClick}
      className="px-4 py-4 cursor-pointer active:bg-primary/[0.03] transition-colors"
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
        {hasCrew ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 rounded-xl bg-purple-50 border border-purple-100 px-3.5 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <LuUsers size={16} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-purple-800 truncate">
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
                    crewAssignment.assignment_id,
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
                {crewAssignment.members.map((member) => (
                  <div
                    key={member.referee_id}
                    className="flex items-center gap-2.5 px-3 py-2"
                  >
                    <img
                      src={member.avatar || ""}
                      alt={member.referee_name || "crew member"}
                      className="w-7 h-7 rounded-full object-cover border border-gray-200 bg-white shrink-0"
                    />
                    <span className="text-sm font-medium text-[#333] truncate flex-1">
                      {member.referee_name || "Unnamed Referee"}
                    </span>
                    {member.jersey_number && (
                      <span className="shrink-0 text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        #{member.jersey_number}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : individualReferees.length > 0 ? (
          <div className="space-y-2">
            {individualReferees.map((item, idx) => {
              const refereeName = item?.referee_name || "Unknown Referee";
              const jerseyNumber = item?.jourcy_number;

              return (
                <div
                  key={item.assignment_id || idx}
                  className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 border border-border px-3.5 py-2.5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item?.avatar}
                      alt={refereeName}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200 bg-white shrink-0"
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
                    className="shrink-0 text-gray-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                    title="Unassign referee"
                  >
                    <HiXMark className="w-4.5 h-4.5" />
                  </button>
                </div>
              );
            })}
            {individualReferees.length < maxReferees && (
              <p className="text-xs text-gray-400 px-1 pt-0.5">
                {maxReferees - individualReferees.length} spot
                {maxReferees - individualReferees.length === 1 ? "" : "s"} open
                — tap to add more
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-4 py-3.5 text-sm font-medium text-gray-400">
            <LuPlus size={16} className="text-primary" />
            Add referees or crew
          </div>
        )}
      </div>
    </div>
  );
};

export default CourtSlotCardMobile;
