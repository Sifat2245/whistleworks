// components/schedule/CourtSlotBox.jsx
import { TiPlus } from "react-icons/ti";
import { HiXMark } from "react-icons/hi2";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import crewImage from "@/assets/crew-image.jpg"; 

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

  // Determine if there's a crew assignment
  const crewAssignment = incomingReferees.find((a) => a.type === "crew");
  const individualReferees = incomingReferees.filter((a) => a.type === "individual");
  const hasCrew = !!crewAssignment;

  // Mutation to remove assignment (works for both individual and crew)
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
      text: `Are you sure you want to remove ${name || "this assignment"} from this slot?`,
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
      className={`shrink-0 w-72 rounded-xl p-8 min-h-[260px] flex flex-col items-center justify-center shadow-lg transition-all
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

          <div className="group relative">
            <img
              src={crewImage}
              alt={crewAssignment.crew_name}
              className="w-24 h-24 rounded-2xl object-cover mx-auto border-4 border-[#00AEEF] shadow-lg"
            />

            <button
              onClick={(e) =>
                handleRemove(e, crewAssignment.assgnment_id, crewAssignment.crew_name)
              }
              disabled={removeMutation.isPending}
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity
                         bg-black text-white rounded-full p-1.5 shadow-md"
              title="Remove crew"
            >
              <HiXMark className="w-5 h-5" />
            </button>
          </div>

          <div className="font-bold text-lg text-[#00AEEF]">
            {crewAssignment.crew_name || "Unnamed Crew"}
          </div>

          <div className="text-sm text-gray-600">
            {crewAssignment?.members?.length} referee{crewAssignment?.members?.length !== 1 ? "s" : ""}
          </div>
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

              return (
                <div
                  key={item.assgnment_id || idx}
                  className="group flex items-center justify-between gap-3 py-1"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <img
                      src={item?.avatar || ''}
                      alt={refereeName}
                      className="w-9 h-9 rounded-full object-cover border border-gray-200"
                    />
                    <span className="text-sm font-medium truncate max-w-[140px]">
                      {refereeName}
                    </span>
                  </div>

                  <button
                    onClick={(e) =>
                      handleRemove(e, item?.assgnment_id, refereeName)
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