// CourtLists.jsx
import { useState, useEffect } from "react";
import ScheduleAddModal from "./ScheduleAddModal";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CourtSlotBox from "./CourtSlotBox";
import ScheduleActionButtons from "./ScheduleActionButtons";
import ScheduleSkeleton from "./ScheduleSkeleton";
import toast from "react-hot-toast";

const CourtLists = ({ campData }) => {
  const axiosInstance = useAxiosSecure();
  const [activeFilter, setActiveFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [courtSchedules, setCourtSchedules] = useState({});
  const queryClient = useQueryClient();

  // console.log(selectedCourt, "court");

  const getCourtTimeKey = (courtNumber, time24h) => `${courtNumber}_${time24h}`;

  const getCourtReferees = (courtNumber, time24h) => {
    const key = getCourtTimeKey(courtNumber, time24h);
    return courtSchedules[key]?.referees || [];
  };

  // Fetch available dates
  const { data: initialData, isLoading: loadingInitial } = useQuery({
    queryKey: ["available-dates", campData?.id],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/v1/camp/${campData?.id}/schedule/game-slots`
      );
      return response?.data?.data;
    },
    enabled: !!campData?.id,
  });

  const availableDates = initialData?.available_dates || [];

  // Set first date as default
  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      const firstDate = availableDates[0];
      setActiveFilter(firstDate.formatted);
      setSelectedDate(firstDate.date.split("T")[0]);
    }
  }, [availableDates, selectedDate]);

  // Fetch schedule for selected date
  const { data, isLoading } = useQuery({
    queryKey: ["court-info", campData?.id, selectedDate],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/v1/camp/${campData?.id}/schedule/game-slots?date=${selectedDate}`
      );
      return response?.data?.data;
    },
    enabled: !!campData?.id && !!selectedDate,
  });

  const courtHeaders = data?.court_headers || [];
  const timeSlots = data?.time_slots || [];

  const toggleBlockMutation = useMutation({
    mutationFn: async (slotId) => {
      const res = await axiosInstance.patch(
        `/v1/director/court-assign/slot/${slotId}/toggle-block`
      );
      return res?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Updated");

      // refresh schedule list
      queryClient.invalidateQueries({
        queryKey: ["court-info", campData?.id, selectedDate],
      });

      handleCloseModal();
    },
    onError: () => toast.error("Failed to update block status"),
  });

  const handleDateClick = (item) => {
    setActiveFilter(item.formatted);
    setSelectedDate(item.date.split("T")[0]);
  };

  const handleBoxClick = (court, timeSlot) => {
    const key = getCourtTimeKey(court.court_number, timeSlot.time_24h);
    if (courtSchedules[key]?.isBlocked) return;

    setSelectedCourt(court);
    setSelectedTimeSlot(timeSlot);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourt(null);
    setSelectedTimeSlot(null);
  };

  const handleAssignSuccess = (slotId, assignedReferees) => {
    setCourtSchedules((prev) => ({
      ...prev,
      [slotId]: { referees: assignedReferees, isBlocked: false },
    }));
  };

  const handleBlockCourt = () => {
    if (!selectedCourt?.slot_id) return;
    toggleBlockMutation.mutate(selectedCourt?.slot_id);
    handleCloseModal();
  };

  const handleUndoBlock = (slotId) => {
    toggleBlockMutation.mutate(slotId);
  };

  if (loadingInitial || isLoading) {
    return <ScheduleSkeleton />;
  }

  if (availableDates.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">No available dates.</div>
    );
  }

  return (
    <div className="w-full mt-6 mb-16">
      {/* Date Filter */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-6">
        {availableDates.map((item) => (
          <button
            key={item.formatted}
            onClick={() => handleDateClick(item)}
            className={`border border-[#00AEEF] px-8 py-4 rounded-xl whitespace-nowrap font-medium transition-all cursor-pointer
              ${
                activeFilter === item.formatted
                  ? "bg-[#00AEEF] text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
          >
            <div className="text-center font-semibold">{item.formatted}</div>
          </button>
        ))}
      </div>

      {/* Schedule Table */}
      <div className="w-full border border-gray-300 rounded-xl overflow-hidden">
        <div className="max-h-[90vh] overflow-auto scrollbar-thin scrollbar-thumb-gray-400">
          <div className="min-w-max">
            {/* Header */}
            <div className="flex gap-6 bg-gray-50 border-b border-gray-300 sticky top-0 z-20">
              <div className="w-32 shrink-0 px-6 py-6 text-lg font-semibold sticky left-0 bg-gray-50 z-30 border-r border-gray-300">
                Time
              </div>
              <div className="flex gap-6 py-6">
                {courtHeaders.map((court) => (
                  <div
                    key={court.court_number}
                    className="shrink-0 w-72 text-center"
                  >
                    <div className="text-red-600 text-sm font-medium">
                      {court.location}
                    </div>
                    <div className="text-[#00AEEF] font-bold text-xl mt-1">
                      Court {court.court_number}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rows */}
            {timeSlots.map((slot) => (
              <div
                key={slot.time_24h}
                className="flex gap-6 border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="w-32 shrink-0 px-6 py-10 text-lg font-medium text-gray-800 sticky left-0 bg-white z-10 border-r border-gray-200">
                  {slot.time}
                </div>
                <div className="flex gap-6 py-8">
                  {slot.courts.map((court) => {
                    const isBlocked = court?.is_blocked;
                    const referees = getCourtReferees(
                      court.court_number,
                      slot.time_24h
                    );

                    return (
                      <CourtSlotBox
                        key={court.slot_id}
                        court={court}
                        timeSlot={slot}
                        isBlocked={isBlocked}
                        referees={referees}
                        onClick={handleBoxClick}
                        onUndoBlock={handleUndoBlock}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <ScheduleActionButtons campId={campData?.id} />

      {/* Modal */}
      <ScheduleAddModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        selectedCourt={selectedCourt}
        selectedTimeSlot={selectedTimeSlot}
        handleBlockCourt={handleBlockCourt}
        campId={campData?.id}
        existingReferees={
          selectedCourt && selectedTimeSlot
            ? getCourtReferees(
                selectedCourt.court_number,
                selectedTimeSlot.time_24h
              )
            : []
        }
        onAssignSuccess={handleAssignSuccess}
      />
    </div>
  );
};

export default CourtLists;