// ActiveCamps.jsx
import { useSearchParams } from "react-router-dom";
import ActiveCmpsBackBtn from "@/components/common/ActiveCmpsBackBtn";
import CommonText from "@/components/common/CommonText";
import CampCard from "@/components/reusable/CampCard";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Spin, Tabs, Select } from "antd";
import { useEffect } from "react";
import PaginationV2 from "@/components/common/PaginationV2";

const { TabPane } = Tabs;
const { Option } = Select;

const TAB_KEYS = {
  CHECKED_IN: "checked-in",
  REGISTERED: "registered",
};

const PER_PAGE_OPTIONS = [5, 10, 20, 30, 50];

export default function ActiveCamps() {
  const axiosInstance = useAxiosSecure();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get params from URL
  const urlTab = searchParams.get("tab") || TAB_KEYS.CHECKED_IN;
  const activeTab =
    urlTab === TAB_KEYS.REGISTERED ? TAB_KEYS.REGISTERED : TAB_KEYS.CHECKED_IN;

  const urlPage = parseInt(searchParams.get("page")) || 1;
  const currentPage = Math.max(1, urlPage);

  const urlPerPage = parseInt(searchParams.get("per_page")) || 10;
  const perPage = PER_PAGE_OPTIONS.includes(urlPerPage) ? urlPerPage : 10;

  // Update URL
  const updateUrl = ({
    tab = activeTab,
    page = currentPage,
    perPage: newPerPage = perPage,
  }) => {
    setSearchParams(
      {
        tab,
        page: page.toString(),
        per_page: newPerPage.toString(),
      },
      { replace: true }
    );
  };

  const handleTabChange = (key) => {
    updateUrl({ tab: key, page: 1 });
  };

  const handlePageChange = (page) => {
    updateUrl({ page });
  };

  const handlePerPageChange = (value) => {
    updateUrl({ page: 1, perPage: value }); // Reset to page 1
  };

  // Default values on first load
  useEffect(() => {
    const needsUpdate = [];
    if (!searchParams.has("tab"))
      needsUpdate.push({ tab: TAB_KEYS.CHECKED_IN });
    if (!searchParams.has("page")) needsUpdate.push({ page: 1 });
    if (!searchParams.has("per_page")) needsUpdate.push({ perPage: 10 });

    if (needsUpdate.length > 0) {
      updateUrl({
        tab: TAB_KEYS.CHECKED_IN,
        page: 1,
        perPage: 10,
      });
    }
  }, []);

  // Queries
  const { data: checkedInResponse = {}, isLoading: loadingCheckedIn } =
    useQuery({
      queryKey: ["my-checkins", currentPage, perPage],
      queryFn: async () => {
        const res = await axiosInstance.get("/v1/referee/camp/my-checkins", {
          params: { page: currentPage, per_page: perPage },
        });
        return res?.data?.data || {};
      },
      enabled: activeTab === TAB_KEYS.CHECKED_IN,
    });

  const { data: registeredResponse = {}, isLoading: loadingRegistered } =
    useQuery({
      queryKey: ["my-registrations", currentPage, perPage],
      queryFn: async () => {
        const res = await axiosInstance.get(
          "/v1/referee/camp/my-registrations",
          {
            params: { page: currentPage, per_page: perPage },
          }
        );
        return res?.data?.data || {};
      },
      enabled: activeTab === TAB_KEYS.REGISTERED,
    });

  // Current data
  const currentResponse =
    activeTab === TAB_KEYS.CHECKED_IN ? checkedInResponse : registeredResponse;
  const isLoading =
    activeTab === TAB_KEYS.CHECKED_IN ? loadingCheckedIn : loadingRegistered;

  const camps =
    activeTab === TAB_KEYS.CHECKED_IN
      ? currentResponse.checked_in || []
      : currentResponse.registrations || [];

  const pagination = currentResponse.pagination || {};
  const summary = currentResponse.summary || {};

  const totalItems = pagination.total || 0;
  const hasCamps = camps.length > 0;

  return (
    <section className="container w-full px-4 mx-auto mt-5">
      <ActiveCmpsBackBtn label="Active Camps" />

      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <Tabs activeKey={activeTab} onChange={handleTabChange} size="large">
            <TabPane
              tab={
                <span>
                  Checked-In{" "}
                  <span className="ml-1 text-sm font-normal text-gray-500">
                    ({summary.checked_in || 0})
                  </span>
                </span>
              }
              key={TAB_KEYS.CHECKED_IN}
            />
            <TabPane
              tab={
                <span>
                  Registered{" "}
                  <span className="ml-1 text-sm font-normal text-gray-500">
                    ({summary.registered_only || 0})
                  </span>
                </span>
              }
              key={TAB_KEYS.REGISTERED}
            />
          </Tabs>

          {/* Per Page Selector */}
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>Show</span>
            <Select
              value={perPage}
              onChange={handlePerPageChange}
              size="middle"
              style={{ width: 100 }}
              className="border border-black/15 p-2!"
            >
              {PER_PAGE_OPTIONS.map((num) => (
                <Option key={num} value={num}>
                  {num}
                </Option>
              ))}
            </Select>
            <span>per page</span>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : hasCamps ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {camps.map((item) => (
                <CampCard key={item.registration_id} camp={item.camp} />
              ))}
            </div>

            {totalItems > perPage && (
              <div className="my-10">
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
          <div className="text-center py-16">
            <CommonText
              text={`No ${
                activeTab === TAB_KEYS.CHECKED_IN ? "checked-in" : "registered"
              } camps at the moment.`}
              className="text-lg text-gray-500"
            />
          </div>
        )}
      </div>
    </section>
  );
}
