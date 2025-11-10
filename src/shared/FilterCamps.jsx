"use client";
import { Select, DatePicker, Spin } from "antd";
import filterIcon from "@/assets/svg/mage_filter.png";
import CommonText from "@/components/common/CommonText";
import { useMemo, useState } from "react";
import CampCard from "@/components/reusable/CampCard";

const { RangePicker } = DatePicker;

const FilterCamps = ({ camps, isLoading }) => {
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [selectedSort, setSelectedSort] = useState(null);

  const filterCamps = useMemo(() => {
    let filtered = [...camps];

    if (selectedSport) {
      filtered = filtered.filter(
        (camp) =>
          camp?.sport_type?.toLowerCase() === selectedSport.toLowerCase()
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter(
        (camp) =>
          camp?.location?.toLowerCase() === selectedLocation.toLowerCase()
      );
    }

    if (selectedDateRange && selectedDateRange.length === 2) {
      const [startDate, endDate] = selectedDateRange;
      filtered = filtered.filter((camp) => {
        const campStart = new Date(camp.start_date);
        const campEnd = new Date(camp.end_date);
        return campStart.toDate() >= startDate && campEnd <= endDate.toDate();
      });
    }

    if (selectedSort === "newest") {
      filtered = filtered.sort(
        (a, b) => new Date(b.start_date) - new Date(a.start_date)
      );
    } else if (selectedSort === "oldest") {
      filtered = filtered.sort(
        (a, b) => new Date(a.start_date) - new Date(b.start_date)
      );
    } else if (selectedSort === "upcoming") {
      const today = new Date();
      filtered = filtered
        .filter((camp) => new Date(camp.start_date) >= today)
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
    }

    return filtered;
  }, [selectedSport, selectedLocation, selectedDateRange, camps, selectedSort]);

  //   console.log("camps", camps);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <>
      <div className="custom-container border border-black/5 rounded-2xl p-6 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <img src={filterIcon} alt="filter icon" className="h-6 w-6" />
          <CommonText
            text="Filter & Sort Camps"
            className="font-semibold text-lg"
          />
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-4 md:gap-6 w-full">
          {/* Filter by Sport */}
          <div className="flex flex-col flex-1">
            <label className="text-sm text-gray-600 mb-1">
              Filter by Sport
            </label>
            <Select
              placeholder="Select sport"
              className="min-w-[180px]"
              value={selectedSport}
              onChange={setSelectedSport}
              allowClear
              options={[
                { value: "football", label: "Football" },
                { value: "basketball", label: "Basketball" },
                { value: "tennis", label: "Tennis" },
                { value: "swimming", label: "Swimming" },
              ]}
            />
          </div>

          {/* Filter by Location */}
          <div className="flex flex-col flex-1">
            <label className="text-sm text-gray-600 mb-1">
              Filter by Location
            </label>
            <Select
              placeholder="Select location"
              className="min-w-[180px]"
              value={selectedLocation}
              onChange={setSelectedLocation}
              allowClear
              options={[
                { value: "new-york", label: "New York" },
                { value: "london", label: "London" },
                { value: "sydney", label: "Sydney" },
                { value: "toronto", label: "Toronto" },
              ]}
            />
          </div>

          {/* Filter by Date Range */}
          <div className="flex flex-col flex-1">
            <label className="text-sm text-gray-600 mb-1">
              Filter by Date Range
            </label>
            <RangePicker
              value={selectedDateRange}
              onChange={setSelectedDateRange}
              allowClear
              className="min-w-[220px]"
            />
          </div>

          {/* Sort by Newest First */}
          <div className="flex flex-col flex-1">
            <label className="text-sm text-gray-600 mb-1">Sort by</label>
            <Select
              placeholder="Sort by"
              className="min-w-[180px]"
              value={selectedSort}
              onChange={setSelectedSort}
              allowClear
              options={[
                { value: "newest", label: "Newest First" },
                { value: "oldest", label: "Oldest First" },
                { value: "upcoming", label: "Upcoming First" },
              ]}
            />
          </div>
        </div>
      </div>
      {/* render card by filtering */}
      <div className="custom-container mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
        {filterCamps.length > 0 ? (
          filterCamps.map((camp) => <CampCard key={camp.id} camp={camp} />)
        ) : (
          <div className="col-span-3 text-center py-12">
            <CommonText
              text=" No camps found matching your filters."
              className="text-lg"
            />
          </div>
        )}
      </div>
    </>
  );
};
export default FilterCamps;