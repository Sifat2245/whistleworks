import { useEffect, useCallback } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import ActiveCmpsBackBtn from "@/components/common/ActiveCmpsBackBtn";
import CommonText from "@/components/common/CommonText";
import CampCard from "@/components/shared/CampCard";
import { useMyCheckins, useMyRegistrations } from "@/hooks/api/referee-hooks/useRefereeCamps";
import { Spin, Tabs, Select } from "antd";
import PaginationV2 from "@/components/common/PaginationV2";

const { TabPane } = Tabs;
const { Option } = Select;

const TAB_KEYS = {
  CHECKED_IN: "checked-in",
  REGISTERED: "registered",
};

const PER_PAGE_OPTIONS = [6, 12, 24, 36];

export default function ActiveCamps() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();
  const isDashboardRoot = pathname === "/referee-dashboard";

  // Get params from URL
  const urlTab = searchParams.get("tab") || TAB_KEYS.CHECKED_IN;
  const activeTab =
    urlTab === TAB_KEYS.REGISTERED ? TAB_KEYS.REGISTERED : TAB_KEYS.CHECKED_IN;

  const urlPage = parseInt(searchParams.get("page")) || 1;
  const currentPage = Math.max(1, urlPage);

  const urlPerPage = parseInt(searchParams.get("per_page")) || 12;
  const perPage = PER_PAGE_OPTIONS.includes(urlPerPage) ? urlPerPage : 12;

  // Update URL
  const updateUrl = useCallback(
    ({ tab = activeTab, page = currentPage, perPage: newPerPage = perPage }) => {
      setSearchParams(
        {
          tab,
          page: page.toString(),
          per_page: newPerPage.toString(),
        },
        { replace: true }
      );
    },
    [activeTab, currentPage, perPage, setSearchParams]
  );

  const handleTabChange = (key) => {
    updateUrl({ tab: key, page: 1 });
  };

  const handlePageChange = (page) => {
    updateUrl({ page });
  };

  const handlePerPageChange = (value) => {
    updateUrl({ page: 1, perPage: value });
  };

  // Default values on first load
  useEffect(() => {
    const needsUpdate = [];
    if (!searchParams.has("tab")) needsUpdate.push({ tab: TAB_KEYS.CHECKED_IN });
    if (!searchParams.has("page")) needsUpdate.push({ page: 1 });
    if (!searchParams.has("per_page")) needsUpdate.push({ perPage: 12 });

    if (needsUpdate.length > 0) {
      updateUrl({
        tab: TAB_KEYS.CHECKED_IN,
        page: 1,
        perPage: 12,
      });
    }
  }, [searchParams, updateUrl]);

  // Queries
  const {
    checkedInCamps,
    pagination: checkinPagination,
    summary: checkinSummary,
    isLoading: loadingCheckedIn,
  } = useMyCheckins(currentPage, perPage);

  const {
    registrations: registeredCamps,
    pagination: registrationPagination,
    summary: registrationSummary,
    isLoading: loadingRegistered,
  } = useMyRegistrations(currentPage, perPage);

  // Current data
  const isLoading =
    activeTab === TAB_KEYS.CHECKED_IN ? loadingCheckedIn : loadingRegistered;

  const camps =
    activeTab === TAB_KEYS.CHECKED_IN ? checkedInCamps : registeredCamps;

  const pagination =
    activeTab === TAB_KEYS.CHECKED_IN ? checkinPagination : registrationPagination;

  const summary =
    activeTab === TAB_KEYS.CHECKED_IN ? checkinSummary : registrationSummary;

  const totalItems = pagination.total || camps.length || 0;
  const hasCamps = camps.length > 0;

  const normalizedCamps = camps.map((item) => {
    const campData = item.camp || {};
    return {
      id: campData.id,
      camp_name: campData.camp_name || campData.name || "Untitled Camp",
      camp_logo: campData.logo || campData.camp_logo || null,
      sports_type:
        campData.sports_type?.name || campData.sports_type_name || "—",
      location: campData.location || "Not specified",
      start_date: campData.start_date,
      end_date: campData.end_date,
      price: campData.price || "0.00",
      director: campData.director || { name: "N/A" },
    };
  });

  return (
    <section className="w-full mt-2 font-sans">
      {!isDashboardRoot && <ActiveCmpsBackBtn label="Active Camps" />}

      {/* Clean White Card Container matching Director Dashboard */}
      <div className="w-full bg-white rounded-xl border border-[#E8E8E8] md:p-6 p-4 my-6 shadow-xs">
        {/* Header Title */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E8E8] pb-4">
          <div>
            <h4 className="text-xl md:text-2xl font-semibold text-[#333]">
              My Camps
              <span className="text-sm font-normal text-gray-600 ml-2">
                ({totalItems} total)
              </span>
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Manage your active officiating camps, check-in status, and assigned games.
            </p>
          </div>

          {/* Per Page Selector */}
          <div className="flex items-center gap-3 text-sm text-gray-600 shrink-0">
            <span>Show</span>
            <Select
              value={perPage}
              onChange={handlePerPageChange}
              size="middle"
              style={{ width: 110 }}
              className="border border-[#E8E8E8] rounded-lg"
            >
              {PER_PAGE_OPTIONS.map((num) => (
                <Option key={num} value={num}>
                  {num} / page
                </Option>
              ))}
            </Select>
          </div>
        </div>

        {/* Tabs Row */}
        <div className="mb-6">
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            size="large"
            className="custom-camps-tabs"
          >
            <TabPane
              tab={
                <span className="font-medium text-sm sm:text-base">
                  Checked-In{" "}
                  <span className="ml-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#00AEEF]">
                    {summary.checked_in || checkinSummary.checked_in || 0}
                  </span>
                </span>
              }
              key={TAB_KEYS.CHECKED_IN}
            />
            <TabPane
              tab={
                <span className="font-medium text-sm sm:text-base">
                  Registered{" "}
                  <span className="ml-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {summary.registered_only || registrationSummary.registered_only || 0}
                  </span>
                </span>
              }
              key={TAB_KEYS.REGISTERED}
            />
          </Tabs>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : hasCamps ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {normalizedCamps.map((camp) => (
                <CampCard key={camp.id} camp={camp} />
              ))}
            </div>

            {totalItems > perPage && (
              <div className="mt-8 flex justify-center">
                <PaginationV2
                  handlePageClick={handlePageChange}
                  perPage={perPage}
                  totalItem={totalItems}
                  currentPage={currentPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <CommonText
              text={`No ${activeTab === TAB_KEYS.CHECKED_IN ? "checked-in" : "registered"
                } camps found at the moment.`}
              className="text-base text-gray-500 font-medium"
            />
          </div>
        )}
      </div>
    </section>
  );
}
