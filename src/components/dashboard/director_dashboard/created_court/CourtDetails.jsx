const CourtDetails = ({ scheduleData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-start gap-6 mt-8 border-b border-black/15 pb-6 animate-pulse">
        {/* Left Side - Stats */}
        <div className="flex-1 p-4 border border-black/15 rounded-lg bg-white">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-5 bg-gray-300 rounded w-32" />
                <div className="h-5 bg-gray-200 rounded flex-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Time Ranges */}
        <div className="flex-1 max-h-52 rounded-lg overflow-hidden border border-black/15">
          <div className="p-4 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="p-3 border border-gray-200 rounded bg-gray-50"
              >
                <div className="h-4 bg-gray-300 rounded w-24 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-32 mb-1" />
                <div className="h-4 bg-gray-200 rounded w-28" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!scheduleData) return <p>No schedule data available.</p>;

  const {
    game_duration,
    status,
    time_ranges,
    total_game_slots,
    assigned_slots,
    available_slots,
    blocked_slots,
    created_at,
  } = scheduleData || {};

  return (
    <div className="flex items-start gap-6 mt-8 border-b border-black/15 pb-6">
      <div className="flex-1 mb-4 p-4 border border-black/15 rounded-lg bg-white">
        <p>
          <strong>Status:</strong> {status}
        </p>
        <p>
          <strong>Game Duration:</strong> {game_duration} minutes
        </p>
        <p>
          <strong>Total Game Slots:</strong> {total_game_slots}
        </p>
        <p>
          <strong>Assigned Slots:</strong> {assigned_slots}
        </p>
        <p>
          <strong>Available Slots:</strong> {available_slots}
        </p>
        <p>
          <strong>Blocked Slots:</strong> {blocked_slots}
        </p>
        <p>
          <strong>Created At:</strong> {new Date(created_at).toLocaleString()}
        </p>
      </div>

      {/* Time Ranges */}
      <div className="flex-1 max-h-51 rounded-lg overflow-y-auto border border-black/15 p-4">
        {time_ranges?.map((range, index) => (
          <div key={index} className="p-2 border border-black/15 rounded mb-2">
            <p>
              <strong>Date:</strong> {range.formatted_date}
            </p>
            <p>
              <strong>Start Time:</strong> {range.start_time}
            </p>
            <p>
              <strong>End Time:</strong> {range.end_time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourtDetails;
