const CourtDetails = ({ scheduleData }) => {
  if (!scheduleData) return <p>No schedule data available.</p>;

  const { game_duration, status, time_ranges, total_game_slots, assigned_slots, available_slots, blocked_slots, created_at } = scheduleData;

  return (
    <div className="p-4 border border-black/15 rounded-lg bg-white mt-8">
      <div className="mb-4">
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Game Duration:</strong> {game_duration} minutes</p>
        <p><strong>Total Game Slots:</strong> {total_game_slots}</p>
        <p><strong>Assigned Slots:</strong> {assigned_slots}</p>
        <p><strong>Available Slots:</strong> {available_slots}</p>
        <p><strong>Blocked Slots:</strong> {blocked_slots}</p>
        <p><strong>Created At:</strong> {new Date(created_at).toLocaleString()}</p>
      </div>

      {/* Time Ranges */}
      <div>
        <h3 className="font-semibold mb-2">Time Ranges</h3>
        {time_ranges.map((range, index) => (
          <div key={index} className="p-2 border border-black/15 rounded mb-2">
            <p><strong>Date:</strong> {range.formatted_date}</p>
            <p><strong>Start Time:</strong> {range.start_time}</p>
            <p><strong>End Time:</strong> {range.end_time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourtDetails;
