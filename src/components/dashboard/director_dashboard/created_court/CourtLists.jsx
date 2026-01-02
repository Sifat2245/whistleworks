// CourtLists.jsx
import { useState, useEffect, useRef } from "react";
import ScheduleAddModal from "./ScheduleAddModal";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CourtSlotBox from "./CourtSlotBox";
import ScheduleActionButtons from "./ScheduleActionButtons";
import ScheduleSkeleton from "./ScheduleSkeleton";
import toast from "react-hot-toast";
import { HiLockClosed, HiLockOpen } from "react-icons/hi2";
import Swal from "sweetalert2";

const CourtLists = ({ campData }) => {
  const axiosInstance = useAxiosSecure();
  const queryClient = useQueryClient();

  const [activeFilter, setActiveFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // Editing state
  const [editingCourtId, setEditingCourtId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef(null);

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
  const maxReferees = data?.schedule?.max_referees_per_slot;
  const scheduleId = data?.schedule?.schedule_id;
  const timeSlots = data?.time_slots || [];
  console.log(courtHeaders,'headers');

  // Mutation to update court name
  const updateCourtNameMutation = useMutation({
    mutationFn: async ({ court_number, court_name }) => {
      const res = await axiosInstance.patch(
        `/v1/slot/${court_number}/update-court-name`,
        { court_name }
      );
      return res?.data;
    },
    onSuccess: () => {
      toast.success("Court name updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["court-info", campData?.id, selectedDate],
      });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update court name"
      );
    },
  });

  // Start editing
  const startEditing = (court_number, currentName) => {
    setEditingCourtId(court_number);
    setEditValue(currentName || "");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  // Save edit
  const saveEdit = () => {
    if (!editValue.trim()) {
      toast.error("Court name cannot be empty");
      return;
    }

    if (editingCourtId) {
      updateCourtNameMutation.mutate({
        court_number: editingCourtId,
        court_name: editValue.trim(),
      });
    }
    setEditingCourtId(null);
    setEditValue("");
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingCourtId(null);
    setEditValue("");
  };

  // Handle Enter/Escape
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const toggleBlockMutation = useMutation({
    mutationFn: async (slotId) => {
      const res = await axiosInstance.patch(`/v1/slot/${slotId}/toggle-block`);
      return res?.data;
    },
    onSuccess: () => {
      toast.success("Updated");
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
    if (court?.is_blocked) return;
    setSelectedCourt(court);
    setSelectedTimeSlot(timeSlot);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourt(null);
    setSelectedTimeSlot(null);
  };

  const handleAssignSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ["court-info", campData?.id, selectedDate],
    });
    handleCloseModal();
  };

  const handleBlockCourt = () => {
    if (!selectedCourt?.slot_id) return;
    toggleBlockMutation.mutate(selectedCourt?.slot_id);
  };

  const bulkToggleBlockMutation = useMutation({
    mutationFn: async ({ date, start_time, action }) => {
      const res = await axiosInstance.post(
        `/v1/schedule/${scheduleId}/bulk-toggle-block`,
        { date, start_time, action }
      );
      return res?.data;
    },
    onSuccess: () => {
      toast.success("Time slot updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["court-info", campData?.id, selectedDate],
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update time slot");
    },
  });

  const handleBulkBlock = async (time24h, date) => {
    if (!scheduleId) return;

    const slot = timeSlots.find((s) => s.time_24h === time24h);
    if (!slot) return;

    const allBlocked = slot.courts.every((court) => court.is_blocked);
    const action = allBlocked ? "unblock" : "block";
    const actionText = allBlocked ? "Unblock" : "Block";

    const result = await Swal.fire({
      title: `${actionText} All Courts?`,
      text: `This will ${action} all courts in the ${slot.time} time slot on ${date}.`,
      icon: allBlocked ? "question" : "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: "Cancel",
      confirmButtonColor: action === "block" ? "#ef4444" : "#10b981",
    });

    if (result.isConfirmed) {
      bulkToggleBlockMutation.mutate({ date, start_time: time24h, action });
    }
  };

  const handleUndoBlock = (slotId) => {
    toggleBlockMutation.mutate(slotId);
  };

  if (loadingInitial || isLoading) return <ScheduleSkeleton />;
  if (availableDates.length === 0)
    return <div className="text-center py-12 text-gray-500">No available dates.</div>;

  return (
    <div className="w-full mt-6 mb-16">
      {/* Date Filter */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-6">
        {availableDates.map((item) => (
          <button
            key={item.formatted}
            onClick={() => handleDateClick(item)}
            className={`border border-[#00AEEF] px-8 py-4 rounded-xl whitespace-nowrap font-medium transition-all cursor-pointer
              ${activeFilter === item.formatted
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
              <div className="w-34 shrink-0 px-6 py-6 text-lg font-semibold sticky left-0 bg-gray-50 z-30 border-r border-gray-300">
                <span>Time</span>
              </div>
              <div className="flex gap-6 py-6">
                {courtHeaders.map((court) => (
                  <div key={court.court_number} className="shrink-0 w-72 text-center">
                    <div className="text-red-600 text-sm font-medium">
                      {court?.location}
                    </div>

                    {/* Editable Court Name */}
                    <div className="mt-2">
                      {editingCourtId === court.court_number ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          onBlur={saveEdit}
                          className="text-[#00AEEF] font-bold text-xl bg-white border-b-2 border-[#00AEEF] outline-none px-2 py-1 text-center"
                          placeholder="Court name..."
                        />
                      ) : (
                        <div
                          onClick={() => startEditing(court.court_number, court.court_name)}
                          className="text-[#00AEEF] font-bold text-xl cursor-pointer hover:opacity-80 transition-opacity"
                          title="Click to edit court name"
                        >
                          {court?.court_name || `Court ${court.court_number}`}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rows */}
            {timeSlots.map((slot) => {
              const allBlocked = slot.courts.every((court) => court.is_blocked);

              return (
                <div
                  key={slot.time_24h}
                  className="flex gap-6 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-34 shrink-0 px-6 py-10 text-lg font-medium text-gray-800 sticky left-0 bg-white z-10 border-r border-gray-200 flex flex-col items-center justify-center gap-6">
                    <span>{slot.time}</span>

                    <button
                      onClick={() => handleBulkBlock(slot.time_24h, selectedDate)}
                      disabled={bulkToggleBlockMutation.isPending}
                      className={`rounded-lg px-4 py-2 flex items-center gap-2 text-white font-medium transition-all cursor-pointer
                        ${allBlocked
                          ? "bg-green-400 hover:bg-green-500"
                          : "bg-red-400 hover:bg-red-500"
                        } disabled:opacity-70 disabled:cursor-not-allowed`}
                    >
                      {allBlocked ? <HiLockOpen className="w-3 h-3" /> : <HiLockClosed className="w-3 h-3" />}
                      <span className="text-xs">{allBlocked ? "Unblock" : "Block"}</span>
                    </button>
                  </div>

                  <div className="flex gap-6 py-8">
                    {slot.courts.map((court) => {
                      const isBlocked = court?.is_blocked;
                      const referees = court?.assignments || [];
                      console.log(referees, "court");

                      return (
                        <CourtSlotBox
                          key={court.slot_id}
                          court={court}
                          timeSlot={slot}
                          isBlocked={isBlocked}
                          referees={referees}
                          campId={campData?.id}
                          selectedDate={selectedDate}
                          maxReferees={maxReferees}
                          onClick={handleBoxClick}
                          onUndoBlock={handleUndoBlock}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ScheduleActionButtons campId={campData?.id} />

      {/* Modal */}
      <ScheduleAddModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        selectedCourt={selectedCourt}
        selectedTimeSlot={selectedTimeSlot}
        handleBlockCourt={handleBlockCourt}
        campId={campData?.id}
        maxReferees={maxReferees}
        selectedDate={selectedDate}
        onAssignSuccess={handleAssignSuccess}
      />
    </div>
  );
};

export default CourtLists;