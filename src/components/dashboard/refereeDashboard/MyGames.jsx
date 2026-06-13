import { parseISO } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Spin, Alert } from "antd"; 
import MyGameCard from "./MyGameCard";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import PaginationV2 from "@/components/common/PaginationV2";
import { useState } from "react";

export default function MyGames({ camp_id }) {
  const axiosInstance = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: response = {},
    isLoading,
    isError,
    error, // Added error from useQuery
  } = useQuery({
    queryKey: ["my-game-slots", camp_id, currentPage],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/referee/camp/${camp_id}/assigned-slots?page=${currentPage}`
      );
      return res?.data?.data || {};
    },
    keepPreviousData: true,
  });

  // Check for specific 403 error from API response
  const isScheduleNotPublished = error?.response?.status === 403 && 
    error?.response?.data?.status === false && 
    error?.response?.data?.data === "This camp schedule is not published yet!";

  const gameSlots = response?.game_slots || [];
  const pagination = response?.pagination || {};
  const totalItems = pagination?.total || 0;
  const perPage = pagination?.per_page || 15;

  // console.log(response, "game slots response");

  if (isLoading && !gameSlots.length) {
    return (
      <section className="flex justify-center items-center py-20 min-h-[60vh]">
        <Spin size="large" />
      </section>
    );
  }

  // Handle the unpublished schedule error
  if (isScheduleNotPublished) {
    return (
      <section className="text-center py-20 min-h-[60vh] max-w-2xl mx-auto">
        <Alert
          message="Schedule Not Published"
          description="This camp schedule is not published yet! You cannot view your assigned games until the schedule is published."
          type="warning"
          showIcon
          className="mb-6"
        />
        <p className="text-gray-600 mt-4">
          Please check back later or contact the camp administrator for more details.
        </p>
      </section>
    );
  }

  // Existing error handling for general errors or no slots
  if (isError || (!isLoading && gameSlots.length === 0)) {
    return (
      <section className="text-center py-20 min-h-[60vh]">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          No Assigned Games
        </h2>
        <p className="text-gray-600">
          You haven&apos;t been assigned to any games yet, or no games found for
          this page.
        </p>
      </section>
    );
  }

  // Sort by date descending (most recent first)
  const sortedSlots = [...gameSlots].sort(
    (a, b) => parseISO(a.game_details.date) - parseISO(b.game_details.date)
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="space-y-8 py-8">
      {/* Stats Header */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          My Assigned Games
        </h1>
        <p className="text-gray-600">
          {response?.statistics?.total_assigned_slots || 0} total assignment
          {response?.statistics?.total_assigned_slots !== 1 ? "s" : ""} • Page{" "}
          {currentPage} of {pagination?.last_page || 1}
        </p>
      </div>

      {/* Stats Cards */}
      {response?.statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <h3 className="text-2xl font-bold text-primary">
              {response.statistics.total_assigned_slots}
            </h3>
            <p className="text-gray-600 mt-1">Total Slots</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <h3 className="text-2xl font-bold text-green-600">
              {response.statistics.upcoming_slots}
            </h3>
            <p className="text-gray-600 mt-1">Upcoming</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <h3 className="text-2xl font-bold text-gray-500">
              {response.statistics.completed_slots}
            </h3>
            <p className="text-gray-600 mt-1">Completed</p>
          </div>
        </div>
      )}

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
        {sortedSlots.map((game) => (
          <MyGameCard
            key={game?.game_slot_id}
            game={game}
            camp={response.camp}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalItems > perPage && (
        <PaginationV2
          handlePageClick={handlePageChange}
          perPage={perPage}
          totalItem={totalItems}
          currentPage={currentPage}
          variant="w-full justify-center"
        />
      )}
    </section>
  );
}