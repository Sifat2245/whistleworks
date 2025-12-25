// components/schedule/CourtSlotBox.jsx
import { TiPlus } from "react-icons/ti";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const CourtSlotBox = ({
  court,
  timeSlot,
  isBlocked,
  referees: localReferees = [], // fallback if no API data yet
  onUndoBlock,
  onClick,
}) => {
  const axiosInstance = useAxiosSecure();

  // Fetch real assigned referees from API
  const { data: apiResponse } = useQuery({
    queryKey: ["assigned-referee", court.slot_id], // Use slot_id (unique per slot)
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/v1/director/court-assign/slot/${court?.slot_id}/assigned-referees-crew`
      );
      return res?.data?.data; // return the inner "data" object
    },
    enabled: !!court?.slot_id,
  });

  // Extract referees from API response (or fallback to local state)
  const assignedReferees = apiResponse?.referees || localReferees;

  const handleUndoClick = (e) => {
    e.stopPropagation();
    onUndoBlock(court.court_number, timeSlot.time_24h);
  };

  const handleBoxClick = () => {
    if (isBlocked) return;
    onClick?.(court, timeSlot);
  };

  return (
    <div
      onClick={handleBoxClick}
      className={`shrink-0 w-72 rounded-xl p-8 min-h-[200px] flex items-center justify-center shadow-lg transition-all cursor-pointer
        ${isBlocked ? "bg-gray-200 cursor-not-allowed opacity-70" : "bg-white hover:shadow-2xl"}`}
    >
      {isBlocked ? (
        <button
          onClick={handleUndoClick}
          className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 text-sm font-medium"
        >
          Undo Block
        </button>
      ) : assignedReferees.length > 0 ? (
        <div className="text-left w-full">
          <div className="text-sm font-medium text-gray-700 mb-3">
            Referees ({assignedReferees.length}/3):
          </div>
          <div className="space-y-2">
            {assignedReferees.map((item, idx) => (
              <div key={item.assignment_id || idx} className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </div>
                <span className="truncate max-w-[180px]">
                  {item.referee?.name || "Unknown"}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
          <TiPlus className="text-3xl" />
        </div>
      )}
    </div>
  );
};

export default CourtSlotBox;