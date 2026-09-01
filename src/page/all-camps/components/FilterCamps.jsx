import { useState, useEffect, useMemo } from "react";
import { Select, DatePicker, Button } from "antd";
import {
  LuSearch,
  LuSlidersHorizontal,
  LuRotateCcw,
  LuX,
  LuTrophy,
  LuMapPin,
  LuCalendar,
  LuArrowUpDown,
  LuCalendarX,
} from "react-icons/lu";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";
import { usePublicCamps, useSportsTypes, useLocations } from "@/hooks/api/useNoAuthCamps";
import CampCard from "@/components/shared/CampCard";
import PaginationV2 from "@/components/common/PaginationV2";

const { RangePicker } = DatePicker;

const FilterCamps = ({ limit }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial params from URL
  const initialSport = searchParams.get("sports_type_id") || null;
  const initialLocation = searchParams.get("location") || null;
  const initialSearch = searchParams.get("q") || "";
  const initialStartDate = searchParams.get("start_date")
    ? dayjs(searchParams.get("start_date"))
    : null;
  const initialEndDate = searchParams.get("end_date")
    ? dayjs(searchParams.get("end_date"))
    : null;
  const sortFromUrl = searchParams.get("sort");

  const initialSort =
    sortFromUrl && ["newest", "oldest", "upcoming"].includes(sortFromUrl)
      ? sortFromUrl
      : "upcoming";
  const initialPage = parseInt(searchParams.get("page")) || 1;

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedSportId, setSelectedSportId] = useState(initialSport);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [selectedDateRange, setSelectedDateRange] = useState(
    initialStartDate && initialEndDate ? [initialStartDate, initialEndDate] : null
  );
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Fetch Sports Types & Locations
  const { data: sportsTypes = [], isLoading: sportsLoading } = useSportsTypes();
  const { data: locationList = [], isLoading: locationsLoading } = useLocations();

  // Build filters for API query
  const filters = {
    sports_type_id: selectedSportId || undefined,
    location: selectedLocation || undefined,
    start_date: selectedDateRange?.[0]
      ? dayjs(selectedDateRange[0]).format("YYYY-MM-DD")
      : undefined,
    end_date: selectedDateRange?.[1]
      ? dayjs(selectedDateRange[1]).format("YYYY-MM-DD")
      : undefined,
    sort: selectedSort,
    page: currentPage,
    per_page: 32,
  };

  const { camps = [], isLoading: campsLoading, pagination = {} } = usePublicCamps(filters);

  // Client-side text search filtering on returned camps
  const filteredCamps = useMemo(() => {
    if (!searchQuery.trim()) return camps;
    const query = searchQuery.toLowerCase().trim();
    return camps.filter(
      (c) =>
        c.camp_name?.toLowerCase().includes(query) ||
        c.location?.toLowerCase().includes(query) ||
        c.sports_type?.toLowerCase().includes(query) ||
        c.director?.name?.toLowerCase().includes(query)
    );
  }, [camps, searchQuery]);

  const totalItems = pagination.total || filteredCamps.length;
  const totalPages = pagination.last_page || 1;

  // Sync state with URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (selectedSportId) params.set("sports_type_id", selectedSportId);
    if (selectedLocation) params.set("location", selectedLocation);
    if (selectedDateRange?.[0])
      params.set("start_date", dayjs(selectedDateRange[0]).format("YYYY-MM-DD"));
    if (selectedDateRange?.[1])
      params.set("end_date", dayjs(selectedDateRange[1]).format("YYYY-MM-DD"));
    if (selectedSort !== "upcoming") params.set("sort", selectedSort);
    if (currentPage > 1) params.set("page", currentPage.toString());

    setSearchParams(params, { replace: true });
  }, [
    searchQuery,
    selectedSportId,
    selectedLocation,
    selectedDateRange,
    selectedSort,
    currentPage,
    setSearchParams,
  ]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedSportId(null);
    setSelectedLocation(null);
    setSelectedDateRange(null);
    setSelectedSort("upcoming");
    setCurrentPage(1);
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Active filters count check
  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    (selectedSportId ? 1 : 0) +
    (selectedLocation ? 1 : 0) +
    (selectedDateRange ? 1 : 0) +
    (selectedSort !== "upcoming" ? 1 : 0);

  // Selected sport name helper
  const selectedSportObj = sportsTypes.find((s) => String(s.id) === String(selectedSportId));

  // Homepage limited view
  if (limit) {
    const limitedCamps = filteredCamps.slice(0, limit);
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {limitedCamps.map((camp) => (
          <CampCard key={camp.id} camp={camp} />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* ── Modern Filter Panel Card ───────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-200/50 p-5 sm:p-7 mb-8 transition-all">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-lg shrink-0">
              <LuSlidersHorizontal />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight flex items-center gap-2">
                <span>Filter & Find Camps</span>
                {activeFiltersCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-extrabold">
                    {activeFiltersCount} Active
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Refine by sports type, location, date range, or keyword
              </p>
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all cursor-pointer self-start sm:self-auto"
            >
              <LuRotateCcw size={13} />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

        {/* Search Bar Input */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search camp by name, location, or director..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all shadow-xs"
          />
          <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <LuX className="text-sm" />
            </button>
          )}
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Sport Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <LuTrophy className="text-primary text-xs" />
              <span>Sport Type</span>
            </label>
            <Select
              placeholder={sportsLoading ? "Loading..." : "All Sports"}
              value={selectedSportId}
              onChange={setSelectedSportId}
              allowClear
              loading={sportsLoading}
              className="w-full text-sm font-medium"
              size="large"
              options={sportsTypes.map((sport) => ({
                value: sport.id,
                label: sport.sports_name,
              }))}
            />
          </div>

          {/* Location Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <LuMapPin className="text-primary text-xs" />
              <span>Location</span>
            </label>
            <Select
              placeholder={locationsLoading ? "Loading..." : "All Locations"}
              value={selectedLocation}
              onChange={setSelectedLocation}
              allowClear
              loading={locationsLoading}
              className="w-full text-sm font-medium"
              size="large"
              options={locationList.map((loc) => ({
                value: loc,
                label: loc,
              }))}
            />
          </div>

          {/* Date Range Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <LuCalendar className="text-primary text-xs" />
              <span>Date Range</span>
            </label>
            <RangePicker
              value={selectedDateRange}
              onChange={setSelectedDateRange}
              allowClear
              size="large"
              className="w-full rounded-xl"
            />
          </div>

          {/* Sort Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <LuArrowUpDown className="text-primary text-xs" />
              <span>Sort Order</span>
            </label>
            <Select
              value={selectedSort}
              onChange={setSelectedSort}
              size="large"
              className="w-full text-sm font-medium"
              options={[
                { value: "upcoming", label: "Upcoming First" },
                { value: "newest", label: "Newest First" },
                { value: "oldest", label: "Oldest First" },
              ]}
            />
          </div>
        </div>

        {/* Active Filter Chips / Pills */}
        {activeFiltersCount > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-1">Active Filters:</span>

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                Keyword: {`"${searchQuery}"`}
                <button onClick={() => setSearchQuery("")} className="hover:text-red-500 cursor-pointer">
                  <LuX size={12} />
                </button>
              </span>
            )}

            {selectedSportObj && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-200">
                Sport: {selectedSportObj.sports_name}
                <button onClick={() => setSelectedSportId(null)} className="hover:text-red-500 cursor-pointer">
                  <LuX size={12} />
                </button>
              </span>
            )}

            {selectedLocation && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-200">
                Location: {selectedLocation}
                <button onClick={() => setSelectedLocation(null)} className="hover:text-red-500 cursor-pointer">
                  <LuX size={12} />
                </button>
              </span>
            )}

            {selectedDateRange && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-200">
                Dates: {dayjs(selectedDateRange[0]).format("MMM D")} – {dayjs(selectedDateRange[1]).format("MMM D")}
                <button onClick={() => setSelectedDateRange(null)} className="hover:text-red-500 cursor-pointer">
                  <LuX size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Results Bar Counter ───────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <span>Showing</span>
          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
            {filteredCamps.length}
          </span>
          <span>of <strong>{totalItems}</strong> camps</span>
        </div>
      </div>

      {/* ── Camp Cards Grid / Skeleton / Empty State ─────────── */}
      {campsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="rounded-3xl bg-slate-200 animate-pulse min-h-[440px] w-full max-w-[390px] mx-auto border border-slate-300"
            />
          ))}
        </div>
      ) : filteredCamps.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {filteredCamps.map((camp) => (
              <CampCard key={camp.id} camp={camp} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <PaginationV2
                handlePageClick={handlePageChange}
                perPage={pagination.per_page || 10}
                totalItem={totalItems}
                currentPage={currentPage}
              />
            </div>
          )}
        </>
      ) : (
        /* ── Empty State ── */
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto my-8 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4 text-2xl">
            <LuCalendarX />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Camps Match Your Filter</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-6">
            We couldn&apos;t find any camps matching your selected parameters. Try clearing some filters or searching with a different term.
          </p>
          <Button
            type="primary"
            onClick={handleClearFilters}
            size="large"
            className="rounded-xl font-bold bg-primary hover:bg-sky-500 border-none px-6"
          >
            Reset All Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterCamps;
