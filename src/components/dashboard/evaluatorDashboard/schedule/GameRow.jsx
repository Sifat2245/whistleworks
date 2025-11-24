export default function GameRow({ game }) {
    const gridClasses = "grid grid-cols-[1.5fr_1fr_1fr_2fr] justify-items-center pb-3 pt-5";
  return (
    <div className={`${gridClasses} border-b border-gray-100`}>
      {/* Date & Time Column */}
      <div className="flex flex-col gap-2">
        <span className="text-base">{game.date}</span>
        <span className="text-[#666666] text-sm">{game.time}</span>
      </div>

      {/* Location Column */}
      <div>{game.location}</div>

      {/* Court Column */}
      <div>{game.court}</div>

      {/* Assigned Referees Column */}
      <div className="flex space-x-1">
        {game.referees.map((referee, index) => (
          // Referees styled as clickable links
          <span
            key={index}
            className="text-primary bg-primary/10 h-fit px-2 py-0.5 rounded-lg"
          >
            {referee}
          </span>
        ))}
      </div>
    </div>
  );
}
