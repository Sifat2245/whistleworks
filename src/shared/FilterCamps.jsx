"use client";
import { Select, DatePicker, Spin, Button } from "antd";
import filterIcon from "@/assets/svg/mage_filter.png";
import CommonText from "@/components/common/CommonText";
import { useState } from "react";
import CampCard from "@/components/reusable/CampCard";
import { ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useCamps } from "@/hooks/getAllCamps";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "@/hooks/useAxiosPublic";

const { RangePicker } = DatePicker;

const FilterCamps = ({ limit }) => {
  const [selectedSportId, setSelectedSportId] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [selectedSort, setSelectedSort] = useState("newest");

  const axiosPublic = useAxiosPublic();

  // Note: Fetch Sports Types
  const {
    data: sportsTypes = [],
    isLoading: sportsLoading,
  } = useQuery({
    queryKey: ["sports-types"],
    queryFn: async () => {
      const res = await axiosPublic.get("/v1/camp/sports-type");
      return res?.data?.data || [];
    },
  });

  // Note: Fetch Locations
  const {
    data: locationList = [],
    isLoading: locationsLoading,
  } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await axiosPublic.get("/v1/camp/locations");
      return res?.data?.data?.location_list || [];
    },
  });

  // Note: filter alls
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
    page: 1,
    per_page: 20,
  };

  const { camps = [], isLoading: campsLoading } = useCamps(filters);

  // Show only limited camps if limit is passed (homepage)
  const displayedCamps = limit ? camps.slice(0, limit) : camps;
  console.log("Displayed Camp--->", displayedCamps);

  const handleClearFilters = () => {
    setSelectedSportId(null);
    setSelectedLocation(null);
    setSelectedDateRange(null);
    setSelectedSort("newest");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filter Panel */}
      <div className="border border-black/5 rounded-2xl p-4 md:p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <img src={filterIcon || null} alt="filter icon" className="h-6 w-6" />
            <CommonText text="Filter & Sort Camps" className="font-semibold text-lg" />
          </div>
          <Button
            type="text"
            icon={<ReloadOutlined />}
            onClick={handleClearFilters}
            className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
          >
            Clear Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Sport Filter */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Filter by Sport</label>
            <Select
              placeholder={sportsLoading ? "Loading sports..." : "All Sports"}
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

          {/* Location Filter */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Filter by Location</label>
            <Select
              placeholder={locationsLoading ? "Loading locations..." : "All Locations"}
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
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Filter by Date Range</label>
            <RangePicker
              value={selectedDateRange}
              onChange={setSelectedDateRange}
              allowClear
              className="w-full"
            />
          </div>

          {/* Sort */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Sort by</label>
            <Select
              placeholder="Newest First"
              value={selectedSort}
              onChange={setSelectedSort}
              className="w-full"
              options={[
                { value: "newest", label: "Newest First" },
                { value: "oldest", label: "Oldest First" },
                { value: "upcoming", label: "Upcoming First" },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="mt-12">
        {campsLoading ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : displayedCamps?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {displayedCamps?.map((camp) => (
              <CampCard key={camp.id} camp={camp} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <CommonText
              text="No camps found matching your filters."
              className="text-lg text-gray-600"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterCamps;