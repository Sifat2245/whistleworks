import { useState } from "react";
import { parseISO } from "date-fns";
import { Spin } from "antd";
import MyGameCard from "./components/MyGameCard";
import { useAssignedSlots } from "@/hooks/api/referee-hooks/useRefereeGames";
import PaginationV2 from "@/components/common/PaginationV2";
import { LuCalendarCheck, LuClock, LuInfo } from "react-icons/lu";
import { FiCheckCircle } from "react-icons/fi";

export default function MyGames({ camp_id }) {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    gameSlots,
    pagination,
    statistics,
    camp,
    isLoading,
    isError,
    error,
  } = useAssignedSlots(camp_id, currentPage);

  // Check for specific 403 error from API response
  const isScheduleNotPublished =
    error?.response?.status === 403 &&
    error?.response?.data?.status === false &&
    error?.response?.data?.data === "This camp schedule is not published yet!";

  const totalItems = pagination?.total || 0;
  const perPage = pagination?.per_page || 15;

  if (isLoading && !gameSlots.length) {
    return (
      <div className="w-full bg-white rounded-xl border border-[#E8E8E8] p-12 shadow-xs flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  // Handle unpublished schedule error
  if (isScheduleNotPublished) {
    return (
      <div className="w-full bg-white rounded-xl border border-[#E8E8E8] md:p-8 p-6 shadow-xs font-sans text-center max-w-2xl mx-auto my-6">
        <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-500 border border-amber-200 flex items-center justify-center mx-auto text-2xl mb-4">
          <LuInfo />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Schedule Not Published
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto">
          This camp schedule is not published yet. You cannot view your assigned games until the director publishes the schedule.
        </p>
      </div>
    );
  }

  // General Error / Empty State
  if (isError || (!isLoading && gameSlots.length === 0)) {
    return (
      <div className="w-full bg-white rounded-xl border border-[#E8E8E8] md:p-8 p-6 shadow-xs font-sans text-center my-6">
        <div className="py-12 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            No Game Assignments Found
          </h3>
          <p className="text-sm text-gray-500">
            You haven&apos;t been assigned to any game slots yet for this camp.
          </p>
        </div>
      </div>
    );
  }

  // Sort by date ascending (chronological order)
  const sortedSlots = [...gameSlots].sort(
    (a, b) => parseISO(a.game_details.date) - parseISO(b.game_details.date)
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="w-full font-sans">
      <div className="w-full bg-white rounded-xl border border-[#E8E8E8] md:p-6 p-4 my-6 shadow-xs space-y-6">
        {/* ── Header Title & Subtitle ──────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E8E8] pb-4">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-[#333]">
              My Assigned Games
              <span className="text-sm font-normal text-gray-600 ml-2">
                ({statistics?.total_assigned_slots || totalItems} total)
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Review your scheduled officiating game slots, court locations, and assigned crew members.
            </p>
          </div>
        </div>

        {/* ── Stats Summary Bar ───────────────────────────────── */}
        {statistics && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center gap-3.5">
              <div className="size-11 rounded-lg bg-blue-50 text-[#00AEEF] flex items-center justify-center text-xl shrink-0 border border-blue-100">
                <LuCalendarCheck />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 leading-none">
                  {statistics.total_assigned_slots || 0}
                </p>
                <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                  Total Slots
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center gap-3.5">
              <div className="size-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0 border border-emerald-100">
                <LuClock />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 leading-none">
                  {statistics.upcoming_slots || 0}
                </p>
                <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                  Upcoming
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center gap-3.5">
              <div className="size-11 rounded-lg bg-slate-200/80 text-slate-600 flex items-center justify-center text-xl shrink-0 border border-slate-300/60">
                <FiCheckCircle />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 leading-none">
                  {statistics.completed_slots || 0}
                </p>
                <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                  Completed
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Games Grid ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-2">
          {sortedSlots.map((game) => (
            <MyGameCard
              key={game?.game_slot_id}
              game={game}
              camp={camp}
            />
          ))}
        </div>

        {/* ── Pagination ──────────────────────────────────────── */}
        {totalItems > perPage && (
          <div className="pt-6 border-t border-[#E8E8E8] flex justify-center">
            <PaginationV2
              handlePageClick={handlePageChange}
              perPage={perPage}
              totalItem={totalItems}
              currentPage={currentPage}
            />
          </div>
        )}
      </div>
    </section>
  );
}