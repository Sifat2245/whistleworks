import BackBtn from "@/components/common/BackBtn";
import CommonSectionTitle from "@/components/common/CommonSectionTitle";
import GameRow from "@/page/dashboard/EvolatorDashboard/schedule/components/GameRow";
import ScheduleRefereeModal from "@/page/dashboard/director-dashboard/camp-schedules/components/ScheduleRefereeModal";
import CrewDetailsModal from "@/page/dashboard/director-dashboard/camp-schedules/components/CrewDetailsModal";
import CampSchedulesSkeleton from "@/page/dashboard/director-dashboard/camp-schedules/components/CampSchedulesSkeleton";
import useInfiniteScroll from "@/hooks/infinity-scroll-hook";
import { useCampRosterDetails } from "@/hooks/api/evaluator-hooks/useEvaluatorSchedule";
import { useExportSchedule } from "@/hooks/api/director-hooks/useExport";
import { Input, Spin } from "antd";
import { useEffect, useMemo, useState } from "react";
import {
  LuTrophy,
  LuLayoutGrid,
  LuUsers,
  LuCalendarRange,
  LuSearch,
  LuInbox,
  LuTriangleAlert,
  LuDownload,
} from "react-icons/lu";
import { useParams } from "react-router-dom";

const CampSchedules = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReferee, setSelectedReferee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState(null);
  const [isCrewModalOpen, setIsCrewModalOpen] = useState(false);

  const { id: camp_id } = useParams();

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

  const {
    data: campData,
    isLoading,
    isError,
    error,
  } = useCampRosterDetails(camp_id);

  const {
    mutate: exportSchedule,
    isPending: isExporting,
  } = useExportSchedule(camp_id);

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
      console.warn(
        "No game_courts found or invalid format:",
        campData?.schedule,
      );
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

  const filteredGames = useMemo(() => {
    if (!searchQuery.trim()) return games;
    const query = searchQuery.toLowerCase();
    return games.filter((game) =>
      Object.values(game).some((val) => {
        if (val == null) return false;

        if (Array.isArray(val)) {
          return val.some((item) => {
            if (item == null) return false;
            if (typeof item === "object") {
              return (item.displayName || "").toLowerCase().includes(query);
            }
            return String(item).toLowerCase().includes(query);
          });
        }

        return String(val).toLowerCase().includes(query);
      }),
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

  // Overview stats
  const stats = useMemo(() => {
    const uniqueCourts = new Set(games.map((g) => g.court).filter(Boolean));
    const refereeCount = games.reduce(
      (sum, g) =>
        sum + g.referees.filter((r) => r.type === "individual").length,
      0,
    );
    const crewCount = games.reduce(
      (sum, g) => sum + g.referees.filter((r) => r.type === "crew").length,
      0,
    );

    return [
      {
        label: "Games Scheduled",
        value: games.length,
        icon: <LuTrophy />,
      },
      {
        label: "Courts",
        value: uniqueCourts.size,
        icon: <LuLayoutGrid />,
      },
      {
        label: "Referees Assigned",
        value: refereeCount,
        icon: <LuUsers />,
      },
      {
        label: "Crews Assigned",
        value: crewCount,
        icon: <LuCalendarRange />,
      },
    ];
  }, [games]);

  // Loading / Error / Empty states

  if (isLoading) {
    return <CampSchedulesSkeleton />;
  }

  if (isError) {
    console.error("Schedule fetch error:", error);
    return (
      <div className="w-full pb-12">
        <BackBtn />
        <div className="mt-6 mx-auto max-w-md bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <LuTriangleAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-3">
            Failed to Load Schedule
          </h2>
          <p className="text-red-600 mb-4">
            {error?.message || "Unknown error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="w-full pb-12">
        <BackBtn />
        <div className="mt-6 mx-auto max-w-md text-center py-10">
          <LuInbox className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-[#333] mb-3">
            No Games Scheduled
          </h2>
          <p className="text-[#666]">
            There are currently no games scheduled for this camp.
          </p>
        </div>
      </div>
    );
  }

  // Main UI

  return (
    <div className="w-full pb-12">
      <BackBtn />

      <CommonSectionTitle
        text="Games Overview"
        subText={`${displayedGames} of ${totalGames} game${
          totalGames !== 1 ? "s" : ""
        } scheduled — click a referee or crew to view details`}
      />

      {/* Overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-border rounded-[10px] px-4 py-3.5 flex items-center gap-3"
          >
            <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-lg shrink-0">
              {stat.icon}
            </span>
            <div className="min-w-0">
              <p className="text-xs text-[#666]">{stat.label}</p>
              <p className="text-lg font-medium text-[#333]">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Export */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <Input
          placeholder="Search by court, referee, date..."
          prefix={<LuSearch className="text-lg text-[#666]" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-96 h-12 rounded-[10px] border-border focus:border-primary"
          allowClear
        />

        <button
          onClick={() => exportSchedule()}
          disabled={isExporting || totalGames === 0}
          className="inline-flex shrink-0 items-center gap-2 px-5 py-3 rounded-[10px] border border-border bg-white text-[#333] font-semibold text-sm whitespace-nowrap transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LuDownload className="text-base" />
          {isExporting ? "Exporting..." : "Export CSV"}
        </button>
      </div>

      {/* Schedule table */}
      <div className="mt-4 bg-white border border-border rounded-[10px] overflow-hidden">
        <div className="overflow-x-auto hide-scrollbar">
          <div className="min-w-[640px] md:min-w-full">
            <div className="grid grid-cols-[2fr_1.2fr_1fr_2.5fr] gap-4 px-5 md:px-6 py-4 border-b border-border bg-[#FAFAFA] text-xs md:text-sm font-semibold text-[#666] uppercase tracking-wider">
              <div>Date & Time</div>
              <div className="text-center">Location</div>
              <div className="text-center">Court</div>
              <div className="text-center">Assigned Referees</div>
            </div>

            <div
              ref={scrollContainerRef}
              className="divide-y divide-border max-h-[65vh] overflow-y-auto"
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
      </div>

      {filteredGames.length > 0 && (
        <p className="text-center text-xs text-gray-500 mt-3 md:hidden">
          ← Swipe left/right to see all columns →
        </p>
      )}

      {/* Referee Details Modal */}
      <ScheduleRefereeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        refereeData={selectedReferee}
        campId={camp_id}
        userRole="director"
      />

      {/* Crew Details Modal */}
      <CrewDetailsModal
        isOpen={isCrewModalOpen}
        onClose={handleCloseCrewModal}
        crewId={selectedCrew?.crew_id}
        crewName={selectedCrew?.crew_name}
        campId={camp_id}
        userRole="director"
      />
    </div>
  );
};

export default CampSchedules;
