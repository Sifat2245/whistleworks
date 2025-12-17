import { useState, useEffect } from "react";
import { TiPlus } from "react-icons/ti";
import ScheduleAddModal from "./ScheduleAddModal";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const CourtLists = ({ campData }) => {
  const axiosInstance = useAxiosSecure();
  const [activeFilter, setActiveFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Fetch available dates first (no date param) to get the list
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

  // Set first date as default when availableDates loads
  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      const firstDate = availableDates[0];
      setActiveFilter(firstDate.formatted);
      setSelectedDate(firstDate.date.split("T")[0]); // "2025-12-14"
    }
  }, [availableDates, selectedDate]);

  // Fetch schedule for the selected date
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const [courtSchedules, setCourtSchedules] = useState({});

  const getCourtTimeKey = (courtNumber, time24h) => `${courtNumber}_${time24h}`;

  const isCourtBlocked = (courtNumber, time24h) => {
    const key = getCourtTimeKey(courtNumber, time24h);
    return courtSchedules[key]?.isBlocked || false;
  };

  const getCourtReferees = (courtNumber, time24h) => {
    const key = getCourtTimeKey(courtNumber, time24h);
    return courtSchedules[key]?.referees || [];
  };

  const handleDateClick = (item) => {
    setActiveFilter(item.formatted);
    setSelectedDate(item.date.split("T")[0]); // Extract YYYY-MM-DD
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

  const handleRefereeUpdate = (selectedReferees) => {
    if (selectedCourt && selectedTimeSlot) {
      const key = getCourtTimeKey(selectedCourt.court_number, selectedTimeSlot.time_24h);
      setCourtSchedules((prev) => ({
        ...prev,
        [key]: { referees: selectedReferees, isBlocked: false },
      }));
    }
    handleCloseModal();
  };

  const handleBlockCourt = () => {
    if (selectedCourt && selectedTimeSlot) {
      const key = getCourtTimeKey(selectedCourt.court_number, selectedTimeSlot.time_24h);
      setCourtSchedules((prev) => ({
        ...prev,
        [key]: { isBlocked: true, referees: [] },
      }));
    }
    handleCloseModal();
  };

  const handleUndoBlock = (courtNumber, time24h, e) => {
    e.stopPropagation();
    const key = getCourtTimeKey(courtNumber, time24h);
    setCourtSchedules((prev) => ({
      ...prev,
      [key]: { ...prev[key], isBlocked: false },
    }));
  };

  const renderCourtBoxContent = (court, timeSlot) => {
    const key = getCourtTimeKey(court.court_number, timeSlot.time_24h);
    const schedule = courtSchedules[key];
    const blocked = schedule?.isBlocked;
    const referees = schedule?.referees || [];

    if (blocked) {
      return (
        <button
          onClick={(e) => handleUndoBlock(court.court_number, timeSlot.time_24h, e)}
          className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 text-sm font-medium"
        >
          Undo Block
        </button>
      );
    }

    if (referees.length > 0) {
      return (
        <div className="text-left w-full">
          <div className="text-sm font-medium text-gray-700 mb-3">
            Referees ({referees.length}/3):
          </div>
          <div className="space-y-2">
            {referees.map((referee, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </div>
                <span className="truncate max-w-[180px]">{referee.name}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
        <TiPlus className="text-3xl" />
      </div>
    );
  };

  if (loadingInitial || isLoading) {
    return <div className="text-center py-12 text-gray-600">Loading schedule...</div>;
  }

  if (availableDates.length === 0) {
    return <div className="text-center py-12 text-gray-500">No available dates.</div>;
  }

  return (
    <div className="w-full mt-6 mb-16">
      {/* Date Filter Buttons */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-6">
        {availableDates.map((item) => (
          <button
            key={item.formatted}
            onClick={() => handleDateClick(item)}
            className={`border border-[#00AEEF] px-8 py-4 rounded-xl whitespace-nowrap transition-all font-medium
              ${activeFilter === item.formatted
                ? "bg-[#00AEEF] text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
          >
            <div className="text-center">
              <div className="font-semibold">{item.formatted}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Schedule Table */}
      <div className="w-full border border-gray-300 rounded-xl overflow-hidden">
        <div className="max-h-[90vh] overflow-auto scrollbar-thin scrollbar-thumb-gray-400">
          <div className="min-w-max">
            {/* Sticky Header */}
            <div className="flex gap-6 bg-gray-50 border-b border-gray-300 sticky top-0 z-20">
              <div className="w-32 shrink-0 px-6 py-6 text-lg font-semibold sticky left-0 bg-gray-50 z-30 border-r border-gray-300">
                Time
              </div>
              <div className="flex gap-6 py-6">
                {courtHeaders.map((court) => (
                  <div key={court.court_number} className="shrink-0 w-72 text-center">
                    <div className="text-red-600 text-sm font-medium">{court.location}</div>
                    <div className="text-[#00AEEF] font-bold text-xl mt-1">
                      Court {court.court_number}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Body */}
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
                    const blocked = isCourtBlocked(court.court_number, slot.time_24h);

                    return (
                      <div
                        key={court.slot_id}
                        className={`shrink-0 w-72 rounded-xl p-8 min-h-[200px] flex items-center justify-center shadow-lg transition-all
                          ${blocked
                            ? "bg-gray-200 cursor-not-allowed opacity-70"
                            : "bg-white hover:shadow-2xl cursor-pointer"
                          }`}
                        onClick={() => !blocked && handleBoxClick(court, slot)}
                      >
                        {renderCourtBoxContent(court, slot)}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-10">
        <CommonSubmitBtn className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg">
          Delete Schedule
        </CommonSubmitBtn>
        <div className="flex gap-6">
          <CommonSubmitBtn className="border border-primary bg-white text-primary px-8 py-4 ">
            Clear Schedule
          </CommonSubmitBtn>
          <CommonSubmitBtn variant="primary" className="px-10 py-4">
            Publish Schedule
          </CommonSubmitBtn>
        </div>
      </div>

      {/* Modal */}
      <ScheduleAddModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        selectedCourt={selectedCourt}
        selectedTimeSlot={selectedTimeSlot}
        handleBlockCourt={handleBlockCourt}
        handleRefereeUpdate={handleRefereeUpdate}
        existingReferees={
          selectedCourt && selectedTimeSlot
            ? getCourtReferees(selectedCourt.court_number, selectedTimeSlot.time_24h)
            : []
        }
      />
    </div>
  );
};

export default CourtLists;