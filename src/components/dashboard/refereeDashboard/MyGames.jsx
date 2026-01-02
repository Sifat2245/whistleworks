// MyGames.jsx
import { parseISO } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import MyGameCard from "./MyGameCard";
import useAxiosSecure from "@/hooks/useAxiosSecure";

export default function MyGames() {
  const axiosInstance = useAxiosSecure();

  const { data: response = {}, isLoading } = useQuery({
    queryKey: ["my-game-slots"],
    queryFn: async () => {
      const res = await axiosInstance.get("/referee/my-assigned-slots");
      return res?.data?.data || {};
    },
  });

  const gameSlots = response?.game_slots || [];

  if (isLoading) {
    return (
      <section className="flex justify-center items-center py-20 min-h-[60vh]">
        <Spin size="large" />
      </section>
    );
  }

  if (gameSlots.length === 0) {
    return (
      <section className="text-center py-20 min-h-[60vh]">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          No Assigned Games
        </h2>
        <p className="text-gray-600">
          You haven&apos;t been assigned to any games yet.
        </p>
      </section>
    );
  }

  // Sort by date descending
  const sortedSlots = [...gameSlots].sort(
    (a, b) => parseISO(b.game_details.date) - parseISO(a.game_details.date)
  );

  return (
    <section className="space-y-8 py-8">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          My Assigned Games
        </h1>
        <p className="text-gray-600">
          {response?.total_assignments} assignment
          {response?.total_assignments !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-12">
        {sortedSlots.map((game) => (
          <MyGameCard key={game?.game_slot_id} game={game} />
        ))}
      </div>
    </section>
  );
}
