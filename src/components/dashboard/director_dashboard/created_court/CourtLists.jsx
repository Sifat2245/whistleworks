import { useState } from "react";
import { TiPlus } from "react-icons/ti";
import ScheduleAddModal from "./ScheduleAddModal";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";

const filterIcon = [
  { id: 1, label: "November 20", value: "nov20" },
  { id: 2, label: "November 24", value: "nov24" }
];

const courtsData = [
  { id: 1, name: "Union HS", court: "Court 1" },
  { id: 2, name: "Union HS", court: "Court 2" },
  { id: 3, name: "Union HS", court: "Court 3" },
  { id: 4, name: "Union HS", court: "Court 4" }
];

const timeSlots = [
  { id: 1, time: "10.00 PM" },
  { id: 2, time: "09.00 PM" },
  { id: 3, time: "07.00 PM" },
  { id: 4, time: "08.00 PM" },
];

const CourtLists = () => {
  const [activeFilter, setActiveFilter] = useState("nov20");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // Store court schedules: { courtId_timeSlotId: { referees: [], isBlocked: boolean } }
  const [courtSchedules, setCourtSchedules] = useState({});

  // Generate unique key for court-time combination
  const getCourtTimeKey = (courtId, timeSlotId) => {
    return `${courtId}_${timeSlotId}`;
  };

  // Check if a specific court-time is blocked
  const isCourtBlocked = (courtId, timeSlotId) => {
    const key = getCourtTimeKey(courtId, timeSlotId);
    return courtSchedules[key]?.isBlocked || false;
  };

  // Get referees for a specific court-time
  const getCourtReferees = (courtId, timeSlotId) => {
    const key = getCourtTimeKey(courtId, timeSlotId);
    return courtSchedules[key]?.referees || [];
  };

  // Note: click on the box open the modal
  const handleBoxClick = (court, timeSlot) => {
    const key = getCourtTimeKey(court.id, timeSlot.id);
    const schedule = courtSchedules[key];

    // Don't open modal if court is blocked
    if (schedule?.isBlocked) return;

    setSelectedCourt(court);
    setSelectedTimeSlot(timeSlot);
    setIsModalOpen(true);
  };

  // Note: close modal function
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourt(null);
    setSelectedTimeSlot(null);
  };

  // Handle referee selection from modal
  const handleRefereeUpdate = (selectedReferees) => {
    if (selectedCourt && selectedTimeSlot) {
      const key = getCourtTimeKey(selectedCourt.id, selectedTimeSlot.id);

      setCourtSchedules(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          referees: selectedReferees,
          isBlocked: false
        }
      }));
    }
    handleCloseModal();
  };

  // Handle block court for specific court-time
  const handleBlockCourt = () => {
    if (selectedCourt && selectedTimeSlot) {
      const key = getCourtTimeKey(selectedCourt.id, selectedTimeSlot.id);

      setCourtSchedules(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          isBlocked: true,
          referees: [] // Clear referees when blocking
        }
      }));
    }
    handleCloseModal();
  };

  // Handle undo block for specific court-time
  const handleUndoBlock = (courtId, timeSlotId, e) => {
    e.stopPropagation();
    const key = getCourtTimeKey(courtId, timeSlotId);

    setCourtSchedules(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        isBlocked: false
      }
    }));
  };

  // Render content for court box
  const renderCourtBoxContent = (court, timeSlot) => {
    const key = getCourtTimeKey(court.id, timeSlot.id);
    const schedule = courtSchedules[key];
    const blocked = schedule?.isBlocked || false;
    const referees = schedule?.referees || [];

    if (blocked) {
      return (
        <button
          onClick={(e) => handleUndoBlock(court.id, timeSlot.id, e)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Undo Block
        </button>
      );
    }

    if (referees.length > 0) {
      return (
        <div className="w-full">
          <div className="text-xs font-medium text-gray-700 mb-2">
            Referees ({referees.length}/3):
          </div>
          <div className="space-y-1">
            {referees.map((referee, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xs font-bold">{index + 1}</span>
                </div>
                <span className="truncate">{referee.name}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="transition-colors bg-primary text-white rounded">
        <TiPlus className="text-2xl" />
      </div>
    );
  };

  return (
    <div className="w-full mt-6">
      {/* Filter buttons */}
      <div className="w-full flex gap-4 items-center mb-6">
        {filterIcon.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveFilter(item.value)}
            className={`border border-[#00AEEF] px-4 py-3 rounded-lg transition-all
                ${activeFilter === item.value
                ? "bg-[#00AEEF] text-white"
                : "bg-white text-gray-700"
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main schedule */}
      <div className="w-full border border-border rounded-xl p-5">
        {/* Headers */}
        <div className="grid grid-cols-5 gap-4 mb-4">
          <div className="font-semibold text-lg">Time</div>
          {courtsData.map((court) => (
            <div key={court.id} className="p-4 text-center">
              <div className="text-red-500 text-sm">{court.name}</div>
              <div className="text-[#00AEEF] font-semibold">{court.court}</div>
            </div>
          ))}
        </div>

        {/* Timeslots */}
        {timeSlots.map((slot) => (
          <div key={slot.id} className="grid grid-cols-5 gap-4 mb-6 ">
            <div className="text-lg font-medium">{slot.time}</div>

            {courtsData.map((court) => {
              const blocked = isCourtBlocked(court.id, slot.id);

              return (
                <div
                  key={court.id}
                  className={`rounded-lg p-3 min-h-[150px] flex items-center justify-center transition-all cursor-pointer
                    ${blocked
                      ? "bg-gray-200 cursor-not-allowed opacity-60"
                      : "shadow-md hover:shadow-lg"
                    }`
                  }
                  onClick={() => handleBoxClick(court, slot)}
                >
                  {renderCourtBoxContent(court, slot)}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between my-6">
        <CommonSubmitBtn variant="" className={"border border-[#F42222] rounded-lg bg-[#F42222] px-3 py-4 text-white font-medium hover:bg-transparent hover:text-[#333] transition-all duration-300"}>Delete Schedule</CommonSubmitBtn>

        <div className="flex gap-4">
          <CommonSubmitBtn variant="" className={"border border-[#F42222] rounded-lg px-3 py-4 text-red-400"}>Clear Schedule</CommonSubmitBtn>
          <CommonSubmitBtn variant="primary">Publish Schedule</CommonSubmitBtn>
        </div>
      </div>

      {/* Modal */}
      <ScheduleAddModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        selectedCourt={selectedCourt}
        handleBlockCourt={handleBlockCourt}
        selectedTimeSlot={selectedTimeSlot}
        handleRefereeUpdate={handleRefereeUpdate}
        existingReferees={selectedCourt && selectedTimeSlot ?
          getCourtReferees(selectedCourt.id, selectedTimeSlot.id) : []}
      />
    </div>
  );
};
export default CourtLists;