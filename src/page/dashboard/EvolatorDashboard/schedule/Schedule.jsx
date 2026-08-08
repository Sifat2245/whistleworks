import GameRow from "@/page/dashboard/EvolatorDashboard/schedule/components/GameRow";
import ScheduleRefereeModal from "@/page/dashboard/director-dashboard/camp-schedules/components/ScheduleRefereeModal";
import CrewDetailsModal from "@/page/dashboard/director-dashboard/camp-schedules/components/CrewDetailsModal";
import { Input, Spin } from "antd";
import { CiFilter, CiSearch } from "react-icons/ci";
import { useCampRosterDetails } from "@/hooks/api/evaluator-hooks/useEvaluatorSchedule";
import { useState, useMemo, useEffect } from "react";
import useInfiniteScroll from "@/hooks/infinity-scroll-hook";

export default function Schedule({ camp_id }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReferee, setSelectedReferee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState(null);
  const [isCrewModalOpen, setIsCrewModalOpen] = useState(false);

  const {
    data: campData,
    isLoading,
    isError,
    error,
  } = useCampRosterDetails(camp_id);

  const handleRefereeClick = (referee) => {
    setSelectedReferee(referee);
    setIsModalOpen(true);
  };

  const handleCrewClick = (crew) => {
    setSelectedCrew(crew);
    setIsCrewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReferee(null);
  };

  const handleCloseCrewModal = () => {
    setIsCrewModalOpen(false);
    setSelectedCrew(null);
  };

  const formatTime = (time) => {
    if (!time) return "";

    // Extract hours and minutes (handles "09:00", "09:00:00", etc.)
    const [hourStr, minuteStr] = time.split(":");
    let hour = parseInt(hourStr, 10);
    const minutes = minuteStr?.slice(0, 2) || "00";

    if (isNaN(hour)) return time; // Fallback

    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;

    return `${hour12}:${minutes} ${period}`;
  };

  // Transform games
  const games = useMemo(() => {
    if (
      !campData?.schedule?.game_courts ||
      !Array.isArray(campData.schedule.game_courts)
    ) {
      return [];
    }

    return campData.schedule.game_courts.map((slot) => {
      const date = slot.game_date;
      const startFormatted = formatTime(slot.start_time);
      const endFormatted = formatTime(slot.end_time);
      const time = `${startFormatted} - ${endFormatted}`;
      const location = slot?.address;

      const courtMatch = slot.court_name.match(/Court (\d+)/);
      const court = courtMatch ? `Court ${courtMatch[1]}` : slot.court_name;

      const referees = (slot.assignments || []).map((assignment) => {
        if (assignment.type === "individual") {
          const name = assignment.name || "Unnamed Referee";
          const jourcyNumber = assignment.jourcy_number;
          return {
            type: "individual",
            referee_id: assignment.referee_id,
            name: name,
            avatar: assignment.avatar,
            email: assignment.email,
            jourcy_number: jourcyNumber,
            displayName: jourcyNumber ? `${name} | ${jourcyNumber}` : name,
          };
        } else if (assignment.type === "crew") {
          return {
            type: "crew",
            crew_id: assignment.crew_id,
            crew_name: assignment.crew_name || "Unnamed Crew",
            displayName: `Crew: ${assignment.crew_name || "Unnamed Crew"}`,
          };
        }
        return { type: "unknown", displayName: "Unknown Assignment" };
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

  // filtered Games
  const filteredGames = useMemo(() => {
    if (!searchQuery.trim()) return games;
    const query = searchQuery.toLowerCase();
    return games.filter((game) =>
      Object.values(game).some((val) =>
        Array.isArray(val)
          ? val.some((item) =>
              typeof item === "object"
                ? (item.displayName || "").toLowerCase().includes(query)
                : String(item).toLowerCase().includes(query),
            )
          : String(val).toLowerCase().includes(query),
      ),
    );
  }, [games, searchQuery]);

  const { visibleCount, loaderRef, scrollContainerRef, reset } =
    useInfiniteScroll(filteredGames.length, 10);

  const visibleGames = useMemo(() => {
    return filteredGames.slice(0, visibleCount);
  }, [filteredGames, visibleCount]);

  useEffect(() => {
    reset();
  }, [searchQuery]);

  const totalGames = games.length;
  const displayedGames = filteredGames.length;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Loading schedule..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-10 text-center">
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
      <div className="py-10 text-center">
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

  return (
    <section className="py-6">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-8 gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Games Overview
          </h1>
          <p className="text-base text-[#666666] mt-2">
            {displayedGames} of {totalGames} game{totalGames !== 1 ? "s" : ""}{" "}
            scheduled
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

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="grid grid-cols-[2fr_1.2fr_1fr_2.5fr] gap-4 px-6 py-5 border-b border-gray-200 bg-gray-50 text-sm font-semibold text-gray-700 uppercase tracking-wider">
            <div>Date & Time</div>
            <div className="text-center">Location</div>
            <div className="text-center">Court</div>
            <div className="text-center">Assigned Referees</div>
          </div>

          <div
            ref={scrollContainerRef}
            className="divide-y divide-gray-100 h-[650px] overflow-y-auto"
          >
            {visibleGames.map((game) => (
              <GameRow
                key={game.id}
                game={game}
                onRefereeClick={handleRefereeClick}
                onCrewClick={handleCrewClick}
              />
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

      {/* Referee Details Modal */}
      <ScheduleRefereeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        refereeData={selectedReferee}
        campId={camp_id}
        userRole="evaluator"
      />

      {/* Crew Details Modal */}
      <CrewDetailsModal
        isOpen={isCrewModalOpen}
        onClose={handleCloseCrewModal}
        crewId={selectedCrew?.crew_id}
        crewName={selectedCrew?.crew_name}
        campId={camp_id}
        userRole="evaluator"
      />
    </section>
  );
}
