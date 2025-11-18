import { useState } from "react";

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
  { id: 1, time: "100 PM" },
  { id: 2, time: "100 PM" }
];

const CourtLists = () => {
  const [activeFilter, setActiveFilter] = useState("nov20");

  return (
    <div className="w-full mt-6">

      {/* Filter buttons */}
      <div className="w-full flex gap-4 items-center mb-6">
        {filterIcon.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveFilter(item.value)}
            className={`border border-[#00AEEF] px-4 py-3 rounded-lg transition-all
                ${
                  activeFilter === item.value
                    ? "bg-[#00AEEF] text-white"
                    : "bg-white text-gray-700"
                }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main schedule table container */}
      <div className="w-full border border-[#E8E8E8] rounded-xl p-5">

        {/* Court Headers */}
        <div className="grid grid-cols-5 gap-4 mb-4">
          <div className="font-semibold text-lg">Time</div>

          {courtsData.map((court) => (
            <div
              key={court.id}
              className="border border-[#00AEEF] rounded-xl p-3 text-center"
            >
              <div className="text-red-500 text-sm">{court?.name}</div>
              <div className="text-[#00AEEF] font-semibold">{court?.court}</div>
            </div>
          ))}
        </div>

        {/* Time rows */}
        {timeSlots.map((slot) => (
          <div
            key={slot.id}
            className="grid grid-cols-5 gap-4 mb-6 items-start"
          >
            {/* Time label */}
            <div className="text-lg font-medium">{slot.time}</div>

            {/* Courts for this time */}
            {courtsData.map((court) => (
              <div
                key={court.id}
                className="border border-[#00AEEF] rounded-xl p-3"
              >
                {/* If court has no game */}
                {court.id === 1 || court.id === 2 ? (
                  <div className="bg-gray-500 w-full h-[140px] text-center text-white flex flex-col justify-center items-center rounded-xl">
                    <div className="flex gap-2 items-center">
                      <span>🚫</span> No Game
                    </div>
                    <button className="mt-3 border px-4 py-1 rounded-lg">
                      Undo
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">

                    {/* Three add slots */}
                    {[1, 2, 3].map((btn) => (
                      <button
                        key={btn}
                        className="border p-3 rounded-lg text-[#00AEEF] text-xl font-bold flex justify-center"
                      >
                        +
                      </button>
                    ))}

                    {/* Referee list */}
                    {[1, 2, 3].map((ref) => (
                      <div
                        key={ref}
                        className="border rounded-lg flex gap-2 items-center p-2"
                      >
                        <img
                          src="https://i.pravatar.cc/300"
                          className="w-7 h-7 rounded-full"
                        />
                        <span>ref63</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Footer buttons */}
      <div className="flex justify-between mt-6">
        <button className="bg-red-500 text-white px-6 py-3 rounded-xl">
          Delete Schedule
        </button>

        <div className="flex gap-4">
          <button className="border border-red-500 text-red-500 px-6 py-3 rounded-xl">
            Clear Schedule
          </button>
          <button className="bg-[#00AEEF] text-white px-6 py-3 rounded-xl">
            Publish Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourtLists;
