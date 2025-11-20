import { useState } from "react";
import { TiPlus } from "react-icons/ti";
import ScheduleAddModal from "./ScheduleAddModal";

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
0.

const CourtLists = () => {
  const [activeFilter, setActiveFilter] = useState("nov20");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  // is court blocked
  const [isBlocked, setIsBlocked] = useState(false);

  // Note: blocked the court function
  const handleBlockCourt = () => {
    setIsBlocked(!isBlocked);
  }

  // Note: click on the box open the modal
  const handleBoxClick = (court) => {
    setSelectedCourt(court);
    setIsModalOpen(true);
  };

  // Note: close modal function
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourt(null);
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
      <div className="w-full border border-[#E8E8E8] rounded-xl p-5">

        {/* Headers */}
        <div className="grid grid-cols-5 gap-4 mb-4">
          <div className="font-semibold text-lg">Time</div>

          {courtsData.map((court) => (
            <div
              key={court.id}
              className="p-4 text-center"
            >
              <div className="text-red-500 text-sm">{court.name}</div>
              <div className="text-[#00AEEF] font-semibold">{court.court}</div>
            </div>
          ))}
        </div>

        {/* Timeslots */}
        {timeSlots.map((slot) => (
          <div key={slot.id} className="grid grid-cols-5 gap-4 mb-6">
            <div className="text-lg font-medium">{slot.time}</div>

            {courtsData.map((court) => {
              return (
                // Square box for showing the schedule with plus icon
                <div
                  key={court.id}
                  className="shadow-sm rounded-lg p-3 min-h-[150px] border border-gray-200 hover:shadow-lg transition-all cursor-pointer flex items-center justify-center"
                  onClick={() => handleBoxClick(court)}
                >
                  {/* Plus icon */}
                  <div className="transition-colors bg-primary text-white rounded">
                    <TiPlus className="text-2xl" />
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between my-6">
        <button className="cursor-pointer bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-colors">
          Delete Schedule
        </button>

        <div className="flex gap-4">
          <button className="cursor-pointer border border-red-500 text-red-500 px-6 py-3 rounded-xl hover:bg-red-50 transition-colors">
            Clear Schedule
          </button>
          <button className="cursor-pointer bg-[#00AEEF] text-white px-6 py-3 rounded-xl hover:bg-[#0099D6] transition-colors">
            Publish Schedule
          </button>
        </div>
      </div>

      {/* Ant Design Modal */}
      <ScheduleAddModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        selectedCourt={selectedCourt}
        handleBlockCourt={handleBlockCourt}
      />
    </div>
  );
};
export default CourtLists;