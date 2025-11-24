import GameRow from "@/components/dashboard/evaluatorDashboard/schedule/GameRow";
import { Input } from "antd";
import { CiFilter, CiSearch } from "react-icons/ci";

export default function Schedule() {
  return (
    <section>
      <div className="flex justify-between items-start mb-6 pt-4">
        <div>
          <h1 className="text-2xl font-medium">Games Overview</h1>
          <p className="text-[14px] mt-1.5 text-[#666666]">
            {gameData.length} of {gameData.length} games
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="flex items-center space-x-2">
          {/* Ant Design Input. Note: using simple Input for direct Ant Design styling */}
          <Input
            placeholder="Search games..."
            prefix={<CiSearch className="size-5 text-[#666666]" />} // Gray icon
            className="w-48! sm:w-64! md:w-80! h-10 rounded-lg border-border placeholder:text-[#666666]! hover:border-primary! hover:outline-primary! focus:border-primary! focus:outline-primary! focus:ring-0!"
            // size="large"
            style={{ borderRadius: "8px" }}
          />

          {/* Filter Button (Styled with Ant Button for icon placement but customized with Tailwind) */}
          <button className="border border-border rounded-lg p-2 cursor-pointer">
            <CiFilter className="size-5 text-[#666666]" />
          </button>
        </div>
      </div>
      {/* Games Table/List Card */}
      <div className="rounded-xl border border-border p-5">
        {/* Header Row (Column Definitions) */}
        <div className="grid grid-cols-[1.5fr_1fr_1fr_2fr] gap-4 pb-4 items-center justify-items-center border-b border-border">
          <div className="text-base font-bold">Date & Time</div>
          <div className="text-base font-bold">Location</div>
          <div className="text-base font-bold">Court</div>
          <div className="text-base font-bold">Assigned Referees</div>
        </div>

        {/* List of Game Rows */}
        <div>
          {gameData.map((game) => (
            <GameRow key={game.id} game={game} />
          ))}
        </div>
      </div>
    </section>
  );
}

const gameData = [
  {
    id: 1,
    date: "Oct 26, 2024",
    time: "2:00 PM",
    location: "Main Arena",
    court: "Court 1",
    referees: ["John Smith", "Sarah Johnson"],
  },
  {
    id: 2,
    date: "Oct 26, 2024",
    time: "2:00 PM",
    location: "Main Arena",
    court: "Court 1",
    referees: ["John Smith", "Sarah Johnson"],
  },
  {
    id: 3,
    date: "Oct 27, 2024",
    time: "10:00 AM",
    location: "Side Court",
    court: "Court 2",
    referees: ["Michael B.", "Emily V."],
  },
  {
    id: 4,
    date: "Oct 27, 2024",
    time: "4:00 PM",
    location: "Main Arena",
    court: "Court 1",
    referees: ["John Smith", "Emily V."],
  },
];
