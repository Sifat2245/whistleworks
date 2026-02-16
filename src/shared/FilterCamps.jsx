// FilterCamps.jsx
import { useState, useEffect } from "react";
import { Select, DatePicker, Spin, Button } from "antd";
import filterIcon from "@/assets/svg/mage_filter.png";
import CommonText from "@/components/common/CommonText";
import CampCard from "@/components/reusable/CampCard";
import { ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { useCamps } from "@/hooks/getAllCamps";
import PaginationV2 from "@/components/common/PaginationV2";

const { RangePicker } = DatePicker;

const FilterCamps = ({ limit }) => {
  const axiosPublic = useAxiosPublic();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read from URL
  const initialSport = searchParams.get("sports_type_id") || null;
  const initialLocation = searchParams.get("location") || null;
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

  const [selectedSportId, setSelectedSportId] = useState(initialSport);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [selectedDateRange, setSelectedDateRange] = useState(
    initialStartDate && initialEndDate
      ? [initialStartDate, initialEndDate]
      : null,
  );
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Fetch Sports Types
  const { data: sportsTypes = [], isLoading: sportsLoading } = useQuery({
    queryKey: ["sports-types"],
    queryFn: async () => {
      const res = await axiosPublic.get("/v1/camp/sports-type");
      return res?.data?.data || [];
    },
  });

  // Fetch Locations
  const { data: locationList = [], isLoading: locationsLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await axiosPublic.get("/v1/camp/locations");
      return res?.data?.data?.location_list || [];
    },
  });

  // Build filters
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
    per_page: 10, // Matches your API
  };

  const {
    camps = [],
    isLoading: campsLoading,
    pagination = {},
  } = useCamps(filters);

  const totalItems = pagination.total || 0;
  const totalPages = pagination.last_page || 1;

  // Sync URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedSportId) params.set("sports_type_id", selectedSportId);
    if (selectedLocation) params.set("location", selectedLocation);
    if (selectedDateRange?.[0])
      params.set(
        "start_date",
        dayjs(selectedDateRange[0]).format("YYYY-MM-DD"),
      );
    if (selectedDateRange?.[1])
      params.set("end_date", dayjs(selectedDateRange[1]).format("YYYY-MM-DD"));
    if (selectedSort !== "upcoming") params.set("sort", selectedSort);
    if (currentPage > 1) params.set("page", currentPage.toString());

    setSearchParams(params);
  }, [
    selectedSportId,
    selectedLocation,
    selectedDateRange,
    selectedSort,
    currentPage,
  ]);

  const handleClearFilters = () => {
    setSelectedSportId(null);
    setSelectedLocation(null);
    setSelectedDateRange(null);
    setSelectedSort("upcoming");
    setCurrentPage(1);
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Homepage limited view
  if (limit) {
    const limitedCamps = camps.slice(0, limit);
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {limitedCamps.map((camp) => (
          <CampCard key={camp.id} camp={camp} />
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filter Panel */}
      <div className="border border-black/5 rounded-2xl p-6 bg-white shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src={filterIcon} alt="filter" className="h-7 w-7" />
            <CommonText
              text="Filter & Sort Camps"
              className="text-xl font-semibold"
            />
          </div>
          <Button
            type="text"
            icon={<ReloadOutlined />}
            onClick={handleClearFilters}
            className="text-gray-600 hover:text-blue-600"
          >
            Clear All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Sport */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Sport</label>
            <Select
              placeholder={sportsLoading ? "Loading..." : "All Sports"}
              value={selectedSportId}
              onChange={setSelectedSportId}
              allowClear
              loading={sportsLoading}
              className="w-full"
              options={sportsTypes.map((sport) => ({
                value: sport.id,
                label: sport.sports_name,
              }))}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Location</label>
            <Select
              placeholder={locationsLoading ? "Loading..." : "All Locations"}
              value={selectedLocation}
              onChange={setSelectedLocation}
              allowClear
              loading={locationsLoading}
              className="w-full"
              options={locationList.map((loc) => ({
                value: loc,
                label: loc,
              }))}
            />
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Date Range
            </label>
            <RangePicker
              value={selectedDateRange}
              onChange={setSelectedDateRange}
              allowClear
              className="w-full"
            />
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Sort By</label>
            <Select
              value={selectedSort}
              onChange={setSelectedSort}
              className="w-full"
              options={[
                { value: "upcoming", label: "Upcoming First" },
                { value: "newest", label: "Newest First" },
                { value: "oldest", label: "Oldest First" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-8 text-gray-700">
        Showing <strong>{camps.length}</strong> of <strong>{totalItems}</strong>{" "}
        camps
      </div>

      {campsLoading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : camps.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {camps.map((camp) => (
              <CampCard key={camp.id} camp={camp} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center">
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
        <div className="text-center py-20">
          <CommonText
            text="No camps found matching your filters."
            className="text-xl text-gray-600"
          />
          <Button type="link" onClick={handleClearFilters} className="mt-4">
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterCamps;
