export default function GameRow({ game }) {
    const gridClasses = "grid grid-cols-[1.5fr_1fr_1fr_2fr] justify-items-center pb-3 pt-5 gap-18 md:gap-4";
  return (
    <div className={`${gridClasses} md:border-b border-gray-100 last:pb-0 md:last:p-3`}>
      {/* Date & Time Column */}
      <div className="flex flex-col gap-2">
        <span className="text-base whitespace-nowrap">{game.date}</span>
        <span className="text-[#666666] text-sm whitespace-nowrap">{game.time}</span>
      </div>

      {/* Location Column */}
      <div className="whitespace-nowrap">{game.location}</div>

      {/* Court Column */}
      <div className="whitespace-nowrap">{game.court}</div>

      {/* Assigned Referees Column */}
      <div className="flex space-x-1 pr-4 md:pr-0">
        {game.referees.map((referee, index) => (
          // Referees styled as clickable links
          <span
            key={index}
            className="text-primary bg-primary/10 h-fit px-2 py-0.5 rounded-lg whitespace-nowrap"
          >
            {referee}
          </span>
        ))}
      </div>
    </div>
  );
}
