import BackBtn from "@/components/common/BackBtn";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import CommonSectionTitle from "@/components/dashboard/director_dashboard/CommonSectionTitle";
import RosterTable from "@/components/dashboard/director_dashboard/Roster/RosterTable";
import ActiveEvaluate from "./ActiveEvaluate";
import ActiveCrews from "./ActiveCrews";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useMemo } from "react"; // ← Added useMemo
import { FiSearch } from "react-icons/fi";
import { ImCross } from "react-icons/im";
import { RxDropdownMenu } from "react-icons/rx";
import { Spin } from "antd";

const Roster = () => {
  const { id: campId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // ← Search state

  // Fetch camp details
  const {
    data: campData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["camp-roster-details", campId],
    queryFn: async () => {
      const response = await axiosSecure.get(`/roster/camp/details/${campId}`);
      return response?.data?.data?.camp;
    },
    enabled: !!campId,
  });

  // Determine active tab
  const pathname = location.pathname;
  const isEvaluatorsActive = pathname.includes("active-evaluate");
  const isCrewsActive = pathname.includes("active-crews");
  const isRefereesActive = !isEvaluatorsActive && !isCrewsActive;

  const btnClasses = (isActive) =>
    `px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 whitespace-nowrap
     ${isActive 
       ? "bg-[#00AEEF] text-white shadow-md" 
       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
     }`;

  const handleTabClick = (path) => {
    navigate(path);
    setShowMobileMenu(false);
  };

  // Filter referees based on search query
  const filteredReferees = useMemo(() => {
    if (!campData?.referees || !isRefereesActive) return [];

    const query = searchQuery.trim().toLowerCase();
    if (!query) return campData.referees;

    return campData.referees.filter((ref) => {
      return (
        ref.name?.toLowerCase().includes(query) ||
        ref.email?.toLowerCase().includes(query) ||
        ref.id.toString().includes(query)
      );
    });
  }, [campData?.referees, searchQuery, isRefereesActive]);

  const totalReferees = campData?.referees?.length || 0;
  const displayedCount = filteredReferees.length;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !campData) {
    return (
      <div className="text-center py-20 text-red-600">
        <p className="text-xl font-medium">Failed to load camp details.</p>
        <p>Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="w-full container mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-8">
        <div className="flex items-center justify-between w-full lg:w-auto">
          <BackBtn />
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            {showMobileMenu ? (
              <ImCross className="w-6 h-6 text-gray-700" />
            ) : (
              <RxDropdownMenu className="w-8 h-8 text-gray-700" />
            )}
          </button>
        </div>

        <div className={`w-full lg:w-auto ${showMobileMenu ? "block" : "hidden lg:block"}`}>
          <div className="flex flex-col sm:flex-row gap-3 bg-gray-50 p-3 rounded-xl">
            <button
              onClick={() => handleTabClick(`/director-dashboard/roster/${campId}`)}
              className={btnClasses(isRefereesActive)}
            >
              Referees ({totalReferees})
            </button>
            <button
              onClick={() => handleTabClick(`/director-dashboard/active-evaluate/${campId}`)}
              className={btnClasses(isEvaluatorsActive)}
            >
              Evaluators ({campData.evaluators?.length || 0})
            </button>
            <button
              onClick={() => handleTabClick(`/director-dashboard/active-crews/${campId}`)}
              className={btnClasses(isCrewsActive)}
            >
              Crews
            </button>
          </div>
        </div>

        <div className="w-full lg:w-auto">
          <CommonSubmitBtn
            type="button"
            variant="primary"
            className="w-full lg:w-auto py-3 px-8 text-base font-medium"
          >
            Make Announcement
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

        <div className="flex items-center gap-4">
          <button className="bg-[#00AEEF]/10 text-[#00AEEF] px-6 py-3 rounded-lg font-semibold text-base whitespace-nowrap">
            {displayedCount} of {totalReferees} Referee{displayedCount !== 1 ? "s" : ""} Shown
          </button>
        </div>
      </div>

      {/* Functional Search Bar */}
      <div className="relative mb-10">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, email, or ID..."
          className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/10 text-base placeholder-gray-500 transition"
        />
        {/* Clear button */}
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            <ImCross className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="mt-8">
        {isEvaluatorsActive && <ActiveEvaluate />}
        {isRefereesActive && (
          <RosterTable
            referees={filteredReferees}
            campId={campId}
          />
        )}
        {isCrewsActive && <ActiveCrews campId={campId} />}
      </div>
    </div>
  );
};

export default Roster;