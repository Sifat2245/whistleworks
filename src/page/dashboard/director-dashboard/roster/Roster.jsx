import BackBtn from "@/components/common/BackBtn";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import CommonSectionTitle from "@/components/common/CommonSectionTitle";
import RosterTable from "@/page/dashboard/director-dashboard/roster/components/RosterTable";
import RosterSkeleton from "@/page/dashboard/director-dashboard/roster/components/RosterSkeleton";
import ActiveEvaluate from "../evaluators/ActiveEvaluate";
import ActiveCrews from "../crews/ActiveCrews";
import { useCampRosterDetails } from "@/hooks/api/director-hooks/useRosterForDirector";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useMemo } from "react";
import {
  LuUsers,
  LuClipboardCheck,
  LuLayers,
  LuSearch,
  LuX,
  LuMegaphone,
  LuTriangleAlert,
  LuRefreshCw,
} from "react-icons/lu";
import { cn } from "@/lib/utils";

const Roster = () => {
  const { id: campId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: campData,
    isLoading,
    isError,
  } = useCampRosterDetails(campId);

  // Determine active tab
  const pathname = location.pathname;
  const isEvaluatorsActive = pathname.includes("active-evaluate");
  const isCrewsActive = pathname.includes("active-crews");
  const isRefereesActive = !isEvaluatorsActive && !isCrewsActive;

  const handleTabClick = (path) => {
    navigate(path);
    setShowMobileMenu(false);
    setSearchQuery("");
  };

  // Filter referees based on search query
  const filteredReferees = useMemo(() => {
    if (!campData?.referees) return [];

    const query = searchQuery.trim().toLowerCase();
    if (!query) return campData.referees;

    return campData.referees.filter((ref) => {
      return (
        ref.name?.toLowerCase().includes(query) ||
        ref.email?.toLowerCase().includes(query) ||
        ref.id.toString().includes(query) ||
        ref.phone?.toString().includes(query)
      );
    });
  }, [campData?.referees, searchQuery]);

  const totalReferees = campData?.referees?.length || 0;
  const displayedCount = filteredReferees.length;

  // Dynamic counter label based on active tab
  const counterLabel = isEvaluatorsActive
    ? `${campData?.evaluators?.length || 0} Evaluator${campData?.evaluators?.length !== 1 ? "s" : ""
    }`
    : isCrewsActive
      ? "Crew Groups"
      : `${displayedCount} of ${totalReferees} Referee${displayedCount !== 1 ? "s" : ""
      } Shown`;

  if (isLoading) {
    return (
      <div className="w-full">
        <RosterSkeleton />
      </div>
    );
  }

  if (isError || !campData) {
    return (
      <div className="w-full py-6">
        <BackBtn />
        <div className="mt-6 mx-auto max-w-md bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <LuTriangleAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-3">
            Failed to Load Camp Roster
          </h2>
          <p className="text-red-600 mb-4">
            Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
          >
            <LuRefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      key: "referees",
      label: "Referees",
      count: totalReferees,
      icon: <LuUsers />,
      path: `/director-dashboard/roster/${campId}`,
      active: isRefereesActive,
    },
    {
      key: "evaluators",
      label: "Evaluators",
      count: campData.evaluators?.length || 0,
      icon: <LuClipboardCheck />,
      path: `/director-dashboard/active-evaluate/${campId}`,
      active: isEvaluatorsActive,
    },
    {
      key: "crews",
      label: "Crews",
      count: null,
      icon: <LuLayers />,
      path: `/director-dashboard/active-crews/${campId}`,
      active: isCrewsActive,
    },
  ];

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-8">
        <div className="flex items-center justify-between w-full lg:w-auto">
          <BackBtn />
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 rounded-lg hover:bg-[#FAFAFA] transition cursor-pointer"
            aria-label="Toggle menu"
          >
            {showMobileMenu ? (
              <LuX className="w-6 h-6 text-[#333]" />
            ) : (
              <span className="block w-8 h-8 bg-[#FAFAFA] border border-border rounded-lg text-[#333] text-sm font-semibold flex items-center justify-center">
                ☰
              </span>
            )}
          </button>
        </div>

        <div
          className={`w-full lg:w-auto ${showMobileMenu ? "block" : "hidden lg:block"
            }`}
        >
          <div className="inline-flex flex-col sm:flex-row gap-2 bg-[#FAFAFA] p-1.5 rounded-[10px] border border-border w-full sm:w-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.path)}
                className={cn(
                  "flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 whitespace-nowrap cursor-pointer",
                  tab.active
                    ? "bg-primary text-white shadow-md"
                    : "text-[#666] hover:bg-white hover:text-primary hover:shadow-sm",
                )}
              >
                <span className="text-base">{tab.icon}</span>
                {tab.label}
                {tab.count !== null && (
                  <span
                    className={cn(
                      "min-w-6 h-6 px-1.5 rounded-full text-xs font-semibold flex items-center justify-center",
                      tab.active
                        ? "bg-white/20 text-white"
                        : "bg-primary/10 text-primary",
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-auto">
          <CommonSubmitBtn
            link
            path={`/director-dashboard/make-announcement/${campId}`}
            type="button"
            variant="primary"
            className="w-full lg:w-auto py-3 px-8 text-base font-medium"
          >
            <span className="inline-flex items-center gap-2">
              <LuMegaphone className="text-base" /> Make Announcement
            </span>
          </CommonSubmitBtn>
        </div>
      </div>

      {/* Title Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-5 mb-8">
        <CommonSectionTitle
          text={`Roster - ${campData.camp_name}`}
          subText="View and manage officials roster for this camp"
          className="max-w-3xl"
        />

        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center bg-primary/10 text-primary px-5 py-2.5 rounded-[10px] font-semibold text-sm whitespace-nowrap">
            {counterLabel}
          </span>
        </div>
      </div>

      {/* Search Bar - rendered for Evaluators tab */}
      {isEvaluatorsActive && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
          <div className="relative flex-1">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999] text-xl pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search evaluators by name, email, or ID..."
              className="w-full pl-12 pr-12 py-3.5 bg-white border border-border rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-base placeholder-[#999] transition shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition cursor-pointer"
                aria-label="Clear search"
              >
                <LuX className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mt-6">
        {isEvaluatorsActive && <ActiveEvaluate searchQuery={searchQuery} />}
        {isRefereesActive && (
          <RosterTable
            referees={filteredReferees}
            campId={campId}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}
        {isCrewsActive && <ActiveCrews campId={campId} />}
      </div>
    </div>
  );
};

export default Roster;
