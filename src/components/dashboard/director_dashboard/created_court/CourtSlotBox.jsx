// components/schedule/CourtSlotBox.jsx
import { TiPlus } from "react-icons/ti";
import { HiXMark } from "react-icons/hi2";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
// import crewImage from "@/assets/crew-image.jpg";  // no longer needed

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
}) => {
  const axiosInstance = useAxiosSecure();
  const queryClient = useQueryClient();
  console.log(incomingReferees,"refereeeeeeeeeeeeeeee");
  // Determine if there's a crew assignment
  const crewAssignment = incomingReferees.find((a) => a.type === "crew");
  const individualReferees = incomingReferees.filter((a) => a.type === "individual");
  const hasCrew = !!crewAssignment;

  // Mutation to remove assignment
  const removeMutation = useMutation({
    mutationFn: async (assignmentId) => {
      await axiosInstance.delete(
        `/v1/director/court-assign/assignment/${assignmentId}/remove`
      );
    },
    onSuccess: () => {
      toast.success("Assignment removed successfully");
      queryClient.invalidateQueries({
        queryKey: ["court-info", campId, selectedDate],
      });
    },
    onError: () => {
      toast.error("Failed to remove assignment");
    },
  });

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
      className={`shrink-0 w-72 rounded-xl p-6 min-h-[280px] flex flex-col items-center justify-center shadow-lg border border-black/15 transition-all
        ${
          isBlocked
            ? "bg-gray-200 cursor-not-allowed opacity-70"
            : "bg-white hover:shadow-2xl cursor-pointer"
        }`}
    >
      {isBlocked ? (
        <button
          onClick={handleUndoClick}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Unblock
        </button>
      ) : hasCrew ? (
        // === Crew Assigned View ===
        <div className="w-full text-center space-y-4">
          <div className="text-sm font-semibold text-gray-700">
            Crew Assigned
          </div>

          <div className="font-bold text-lg text-[#00AEEF]">
            {crewAssignment.crew_name || "Unnamed Crew"}
          </div>

          <div className="text-sm text-gray-600 mb-2">
            {crewAssignment.member_count || crewAssignment.members?.length || 0} members
          </div>

          {/* Show crew members with avatars and names */}
          <div className="max-h-40 overflow-y-auto space-y-2 w-full px-2">
            {crewAssignment.members?.map((member) => (
              <div
                key={member.referee_id}
                className="flex items-center gap-3 bg-gray-50 rounded-lg p-2"
              >
                <img
                  src={member.avatar || ""}
                  alt={member.referee_name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-300"
                />
                <span className="text-sm font-medium truncate">
                  {member.referee_name}
                </span>
              </div>
            ))}
          </div>

          {/* Remove crew button */}
          <button
            onClick={(e) =>
              handleRemove(e, crewAssignment.assignment_id, crewAssignment.crew_name)
            }
            disabled={removeMutation.isPending}
            className="mt-3 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
          >
            Remove Crew
          </button>
        </div>
      ) : individualReferees.length > 0 ? (
        // === Individual Referees View ===
        <div className="w-full text-left">
          <div className="text-sm font-semibold text-gray-700 mb-3">
            Referees ({individualReferees.length}/{maxReferees})
          </div>
          <div className="space-y-3">
            {individualReferees.map((item, idx) => {
              const refereeName = item?.referee_name || "Unknown Referee";
              const jerseyNumber = item?.jourcy_number;
              console.log(item, 'referee');

              return (
                <div
                  key={item.assignment_id || idx}
                  className="group flex items-center justify-between gap-3 py-1"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <img
                      src={item?.avatar}
                      alt={refereeName}
                      className="w-9 h-9 rounded-full object-cover border border-gray-200"
                    />
                    <span className="text-sm font-medium truncate max-w-[140px]">
                      {refereeName} {jerseyNumber? `#${jerseyNumber}` : ""}
                    </span>
                  </div>

                  <button
                    onClick={(e) =>
                      handleRemove(e, item?.assignment_id, refereeName)
                    }
                    disabled={removeMutation.isPending}
                    className="opacity-0 group-hover:opacity-100 transition-opacity
                               bg-black cursor-pointer text-white rounded-full p-1 shadow-md"
                    title="Unassign referee"
                  >
                    <HiXMark className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {individualReferees.length < maxReferees && (
            <div className="mt-4 text-center text-xs text-gray-500">
              {maxReferees - individualReferees.length} spot
              {maxReferees - individualReferees.length === 1 ? "" : "s"} available
            </div>
          )}
        </div>
      ) : (
        // === Empty Slot ===
        <div className="bg-[#00AEEF] hover:bg-[#0099d4] transition-colors text-white rounded-full w-16 h-16 flex items-center justify-center shadow-xl hover:scale-110">
          <TiPlus className="text-4xl" />
        </div>
      )}
    </div>
  );
};

export default CourtSlotBox;