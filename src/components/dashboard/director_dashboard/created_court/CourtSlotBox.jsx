// components/schedule/CourtSlotBox.jsx
import { TiPlus } from "react-icons/ti";
import { HiXMark } from "react-icons/hi2";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const CourtSlotBox = ({
  court,
  timeSlot,
  isBlocked,
  referees: localReferees = [],
  onUndoBlock,
  onClick,
  campId,
  selectedDate
}) => {
  const axiosInstance = useAxiosSecure();
  const queryClient = useQueryClient();

  // Mutation to remove a referee assignment
  const removeMutation = useMutation({
    mutationFn: async (assgnment_id) => {
      await axiosInstance.delete(
        `/v1/director/court-assign/assignment/${assgnment_id}/remove`
      );
    },
    onSuccess: () => {
      toast.success("Referee unassigned successfully");
      queryClient.invalidateQueries({
        queryKey: ["court-info", campId, selectedDate], // You need these from parent
      });
    },
    onError: () => {
      toast.error("Failed to unassign referee");
    },
  });

  const handleRemoveReferee = async (e, assgnment_id, refereeName) => {
    e.stopPropagation(); // Prevent opening modal

    const result = await Swal.fire({
      title: "Unassign Referee?",
      text: `Are you sure you want to remove ${
        refereeName || "this referee"
      } from this slot?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, unassign",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      removeMutation.mutate(assgnment_id);
    }
  };

  const assignedReferees = localReferees;

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
      className={`shrink-0 w-72 rounded-xl p-8 min-h-[200px] flex flex-col items-center justify-center shadow-lg transition-all
        ${
          isBlocked
            ? "bg-gray-200 cursor-not-allowed opacity-70"
            : "bg-white hover:shadow-2xl cursor-pointer"
        }`}
    >
      {isBlocked ? (
        <button
          onClick={handleUndoClick}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer"
        >
          Unblock
        </button>
      ) : assignedReferees.length > 0 ? (
        <div className="w-full text-left">
          <div className="text-sm font-semibold text-gray-700 mb-3">
            Referees ({assignedReferees.length}/3)
          </div>
          <div className="space-y-3">
            {assignedReferees.map((item, idx) => {
              const refereeName = item?.referee_name || "Unknown Referee";

              return (
                <div
                  key={item.assgnment_id || idx}
                  className="group flex items-center justify-between gap-3 py-1"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <img
                      src={item?.avatar || "/default-avatar.png"}
                      alt={refereeName}
                      className="w-9 h-9 rounded-full object-cover border border-gray-200"
                      onError={(e) => (e.target.src = "/default-avatar.png")}
                    />
                    <span className="text-sm font-medium truncate max-w-[140px]">
                      {refereeName}
                    </span>
                  </div>

                  {/* Cross button - appears on hover */}
                  <button
                    onClick={(e) =>
                      handleRemoveReferee(e, item.assgnment_id, refereeName)
                    }
                    disabled={removeMutation.isPending}
                    className="opacity-0 group-hover:opacity-100 transition-opacity
                               bg-black  text-white
                               rounded-full p-1 cursor-pointer shadow-md"
                    title="Unassign referee"
                  >
                    <HiXMark className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          {assignedReferees.length < 3 && (
            <div className="mt-4 text-center text-xs text-gray-500">
              {3 - assignedReferees.length} spot
              {assignedReferees.length === 2 ? "" : "s"} available
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#00AEEF] hover:bg-[#0099d4] transition-colors text-white rounded-full w-16 h-16 flex items-center justify-center shadow-xl hover:scale-110">
          <TiPlus className="text-4xl" />
        </div>
      )}
    </div>
  );
};

export default CourtSlotBox;
