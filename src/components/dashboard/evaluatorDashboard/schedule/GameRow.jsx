export default function GameRow({ game, onRefereeClick }) {
  const hasReferees = game.referees.length > 0;

  const handleRefClick = (referee) => {
    if (referee.type === "individual" && onRefereeClick) {
      onRefereeClick(referee);
    }
  };

  return (
    <div className="grid grid-cols-[2fr_1.2fr_1fr_2.5fr] gap-4 px-6 py-6 hover:bg-gray-50 transition">
      {/* Date & Time */}
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">{game.date}</span>
        <span className="text-sm text-[#666666]">{game.time}</span>
      </div>

      {/* Location */}
      <div className="text-center text-gray-700 capitalize">
        {game.location}
      </div>

      {/* Court */}
      <div className="text-center font-medium text-gray-900">
        {game.court}
      </div>

      {/* Referees */}
      <div className="flex flex-wrap justify-center items-center gap-2">
        {hasReferees ? (
          game.referees.map((referee, idx) =>
            referee.type === "individual" ? (
              <button
                key={idx}
                onClick={() => handleRefClick(referee)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#00AEEF]/10 text-[#00AEEF] hover:bg-[#00AEEF]/20 transition-all cursor-pointer"
                title={`Click to view ${referee.name || "referee"} details`}
              >
                {referee.displayName || referee.name || "Unnamed Referee"}
              </button>
            ) : (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
              >
                {referee.displayName || "Crew: Unnamed Crew"}
              </span>
            )
          )
        ) : (
          <span className="text-gray-400 text-sm italic">No assignment yet</span>
        )}
      </div>
    </div>
  );
}
