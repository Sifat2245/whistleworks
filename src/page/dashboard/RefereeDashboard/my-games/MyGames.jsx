import { useState } from "react";
import {
  LuCalendarCheck,
  LuInfo,
  LuRefreshCw,
  LuTriangleAlert,
} from "react-icons/lu";
import { useAssignedSlots } from "@/hooks/api/referee-hooks/useRefereeGames";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import Loader from "@/components/common/Loader";
import PaginationV2 from "@/components/common/PaginationV2";
import GameStatusFilters from "@/page/dashboard/RefereeDashboard/my-games/components/GameStatusFilters";
import MyGameCard from "@/page/dashboard/RefereeDashboard/my-games/components/MyGameCard";
import { GAME_STATUSES } from "@/page/dashboard/RefereeDashboard/my-games/constants/gameStatuses";

export default function MyGames({ camp_id }) {
  // A different camp starts with Upcoming on page 1.
  return <CampGames key={camp_id} campId={camp_id} />;
}

function CampGames({ campId }) {
  const [{ status, page }, setView] = useState({ status: "upcoming", page: 1 });
  const {
    gameSlots,
    pagination,
    statistics,
    camp,
    isLoading,
    isFetching,
    isPlaceholderData,
    isError,
    error,
    refetch,
  } = useAssignedSlots(campId, page, status);

  const activeStatus = GAME_STATUSES.find((item) => item.value === status);
  const isScheduleNotPublished =
    error?.response?.status === 403 &&
    error?.response?.data?.message ===
      "This camp schedule is not published yet!";
  const totalItems = pagination?.total ?? gameSlots.length;
  const perPage = pagination?.per_page || 15;
  const isChangingPage = isFetching && isPlaceholderData;

  // Status comes from the API; sorting never reclassifies a game by browser time.
  const sortedSlots = [...gameSlots].sort((a, b) => {
    const dateA = (a?.game_details?.date || "").split("T")[0];
    const dateB = (b?.game_details?.date || "").split("T")[0];
    const timeA = a?.game_details?.start_time || "";
    const timeB = b?.game_details?.start_time || "";
    const order = dateA.localeCompare(dateB) || timeA.localeCompare(timeB);
    return status === "past" ? -order : order;
  });

  const handleStatusChange = (nextStatus) => {
    if (nextStatus !== status) setView({ status: nextStatus, page: 1 });
  };

  return (
    <section className="@container my-6 min-w-0 w-full rounded-xl border border-slate-200 bg-white font-sans shadow-xs">
      <div className="space-y-5 border-b border-slate-200 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="hidden size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xl text-sky-700 sm:inline-flex">
              <LuCalendarCheck aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                My Assigned Games
              </h3>
              <p className="mt-1 max-w-lg text-xs leading-relaxed text-slate-500 sm:text-sm">
                Know what&apos;s next, see games in progress, and revisit your
                completed assignments.
              </p>
              {typeof statistics?.total_assigned_slots === "number" && (
                <p className="mt-2 text-xs font-medium text-slate-600">
                  {statistics.total_assigned_slots} total assigned games
                </p>
              )}
            </div>
          </div>
          <CommonSubmitBtn
            type="button"
            variant="secondary"
            onClick={() => refetch()}
            disabled={isFetching || !campId}
            className="min-h-11 shrink-0 gap-2 border-slate-200 px-3 text-xs text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800"
          >
            <LuRefreshCw aria-hidden="true" className="size-3.5" />
            Refresh
          </CommonSubmitBtn>
        </div>
        <GameStatusFilters
          value={status}
          onChange={handleStatusChange}
          statistics={isError ? undefined : statistics}
        />
      </div>

      <div
        id="assigned-games-results"
        aria-busy={isFetching}
        className="min-w-0 p-4 sm:p-6"
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="text-base font-semibold text-slate-900">
              {activeStatus.label} games
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              {activeStatus.description}
            </p>
          </div>
          <p role="status" className="text-xs font-medium text-slate-500">
            {isFetching
              ? "Loading " + status + " games…"
              : !isError &&
                totalItems +
                  (totalItems === 1 ? " game" : " games") +
                  (pagination?.total == null ? " on this page" : "")}
          </p>
        </div>

        {isLoading || isChangingPage ? (
          <div className="flex min-h-64 items-center justify-center gap-3 rounded-xl bg-slate-50 text-sm text-slate-600">
            <Loader size={26} color="#00AEEF" />
            <span>Loading {status} games…</span>
          </div>
        ) : isScheduleNotPublished ? (
          <div
            role="status"
            className="rounded-xl border border-amber-200 bg-amber-50/50 px-5 py-12 text-center"
          >
            <LuInfo
              aria-hidden="true"
              className="mx-auto mb-4 size-7 text-amber-600"
            />
            <h4 className="text-lg font-semibold text-slate-900">
              Schedule Not Published
            </h4>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
              This camp schedule is not published yet. You cannot view your
              assigned games until the director publishes the schedule.
            </p>
          </div>
        ) : isError ? (
          <div
            role="alert"
            className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-12 text-center"
          >
            <LuTriangleAlert
              aria-hidden="true"
              className="mx-auto mb-4 size-7 text-slate-500"
            />
            <h4 className="text-lg font-semibold text-slate-900">
              Unable to load games
            </h4>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
              {error?.response?.data?.message ||
                "Your games could not be loaded. Use Refresh to try again."}
            </p>
          </div>
        ) : gameSlots.length === 0 ? (
          <div
            role="status"
            className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-12 text-center"
          >
            <LuCalendarCheck
              aria-hidden="true"
              className="mx-auto mb-4 size-7 text-slate-400"
            />
            <h4 className="text-lg font-semibold text-slate-900">
              {activeStatus.emptyTitle}
            </h4>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
              {activeStatus.emptyDescription}
            </p>
          </div>
        ) : (
          <div className="grid min-w-0 grid-cols-1 gap-4 @[720px]:grid-cols-2 @[1080px]:grid-cols-3 sm:gap-5">
            {sortedSlots.map((game) => (
              <MyGameCard
                key={game?.game_slot_id}
                game={game}
                camp={camp}
                scheduleStatus={status}
              />
            ))}
          </div>
        )}

        {!isError && !isLoading && totalItems > perPage && (
          <div className="mt-6 flex justify-center border-t border-slate-200 pt-3">
            <PaginationV2
              handlePageClick={(nextPage) =>
                setView({ status, page: nextPage })
              }
              perPage={perPage}
              totalItem={totalItems}
              currentPage={page}
            />
          </div>
        )}
      </div>
    </section>
  );
}
