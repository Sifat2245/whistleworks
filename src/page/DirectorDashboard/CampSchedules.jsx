import BackBtn from "@/components/common/BackBtn";
import GameRow from "@/components/dashboard/evaluatorDashboard/schedule/GameRow";
import useInfiniteScroll from "@/hooks/infinity-scroll-hook";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Input, Spin } from "antd";
import { useEffect, useMemo, useState } from "react";
import { CiFilter, CiSearch } from "react-icons/ci";
import { useParams } from "react-router-dom";

const CampSchedules = () => {
  const axiosSecure = useAxiosSecure();
  const [searchQuery, setSearchQuery] = useState("");

  const { id: camp_id } = useParams();

  const {
    data: campData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["evaluator-camp-schedule", camp_id],
    queryFn: async () => {
      if (!camp_id) throw new Error("No camp ID provided");

      const response = await axiosSecure.get(`/roster/camp/details/${camp_id}`);

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Failed to fetch camp");
      }

      if (!response?.data?.data?.camp) {
        throw new Error("Camp data not found in response");
      }

      return response.data.data.camp;
    },
    enabled: !!camp_id,
    retry: 1,
  });

  // Transform games
  const games = useMemo(() => {
    if (!campData?.schedule?.game_courts || !Array.isArray(campData.schedule.game_courts)) {
      console.warn("No game_courts found or invalid format:", campData?.schedule);
      return [];
    }

    return campData.schedule.game_courts.map((slot) => {
      const date = slot.game_date;
      const time = `${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`;

      const location = slot?.address;
      const courtMatch = slot.court_name.match(/Court (\d+)/);
      const court = courtMatch ? `Court ${courtMatch[1]}` : slot.court_name;

      const referees = (slot.assignments || []).map((assignment) => {
        if (assignment.type === "individual") {
          return assignment.name || "Unnamed Referee";
        } else if (assignment.type === "crew") {
          return `Crew: ${assignment.crew_name || "Unnamed Crew"}`;
        }
        return "Unknown Assignment";
      });

      return {
        id: slot.id,
        date,
        time,
        location,
        court,
        referees,
        status: slot.status,
      };
    });
  }, [campData]);

  const filteredGames = useMemo(() => {
    if (!searchQuery.trim()) return games;
    const query = searchQuery.toLowerCase();
    return games.filter((game) =>
      Object.values(game).some((val) =>
        Array.isArray(val)
          ? val.some((item) => item.toLowerCase().includes(query))
          : val.toString().toLowerCase().includes(query)
      )
    );
  }, [games, searchQuery]);

  const {
    visibleCount,
    loaderRef,
    scrollContainerRef,
    reset,
  } = useInfiniteScroll(filteredGames.length, 10);

  const visibleGames = useMemo(() => {
    return filteredGames.slice(0, visibleCount);
  }, [filteredGames, visibleCount]);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const totalGames = games.length;
  const displayedGames = filteredGames.length;

  // ────────────────────────────────────────────────
  // Loading / Error / Empty states (unchanged)
  // ────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Loading schedule..." />
      </div>
    );
  }

  if (isError) {
    console.error("Schedule fetch error:", error);
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-xl p-8">
          <h2 className="text-xl font-semibold text-red-800 mb-3">
            Failed to Load Schedule
          </h2>
          <p className="text-red-600 mb-4">
            {error?.message || "Unknown error occurred"}
          </p>
          <details className="text-left text-sm text-gray-600 bg-white p-3 rounded mt-4">
            <summary className="cursor-pointer font-medium">Debug Info</summary>
            <pre className="mt-2 text-xs overflow-auto">
              Camp ID: {camp_id}
              {"\n"}
              Error: {JSON.stringify(error, null, 2)}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            No Games Scheduled
          </h2>
          <p className="text-gray-600">
            There are currently no games scheduled for this camp.
          </p>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────
  // Main UI - Improved mobile horizontal scroll
  // ────────────────────────────────────────────────

  return (
    <section className="container mx-auto px-4 py-6">
      <BackBtn />

      <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-8 gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Games Overview
          </h1>
          <p className="text-base text-[#666666] mt-2">
            {displayedGames} of {totalGames} game{totalGames !== 1 ? "s" : ""} scheduled
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Input
            placeholder="Search by court, referee, date..."
            prefix={<CiSearch className="text-xl text-[#666666]" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-96 h-12 rounded-xl border-gray-300 focus:border-[#00AEEF]"
            allowClear
          />
          <button className="border border-gray-300 rounded-xl p-3 hover:bg-gray-50 transition">
            <CiFilter className="text-xl text-[#666666]" />
          </button>
        </div>
      </div>

      {/* Horizontal scroll wrapper – key change for mobile */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {/* Minimum width prevents collapsing too much on very small screens */}
          <div className="min-w-[640px] md:min-w-full">
            {/* Header */}
            <div className="grid grid-cols-[2fr_1.2fr_1fr_2.5fr] gap-4 px-5 py-4 md:px-6 md:py-5 border-b border-gray-200 bg-gray-50 text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider">
              <div>Date & Time</div>
              <div className="text-center">Location</div>
              <div className="text-center">Court</div>
              <div className="text-center">Assigned Referees</div>
            </div>

            {/* Scrollable content area */}
            <div
              ref={scrollContainerRef}
              className="divide-y divide-gray-100 max-h-[65vh] overflow-y-auto"
            >
              {visibleGames.map((game) => (
                <GameRow key={game.id} game={game} />
              ))}

              <div ref={loaderRef} className="py-6 text-center">
                {visibleCount < filteredGames.length ? (
                  <Spin />
                ) : (
                  <p className="text-sm text-gray-400">All games loaded</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optional hint for mobile users */}
      {filteredGames.length > 0 && (
        <p className="text-center text-xs text-gray-500 mt-3 md:hidden">
          ← Swipe left/right to see all columns →
        </p>
      )}
    </section>
  );
};

export default CampSchedules;