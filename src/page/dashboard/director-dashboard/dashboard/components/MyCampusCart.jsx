/* eslint-disable no-unused-vars */
import useCampSchedule from "@/hooks/useCampSchedule";
import { BsArrowLeftRight } from "react-icons/bs";
import { CiCalendar } from "react-icons/ci";
import { HiOutlineUser } from "react-icons/hi2";
import { MdSchedule } from "react-icons/md";
import { LuShieldCheck } from "react-icons/lu";
import { PiCourtBasketball, PiSunglassesLight, PiMegaphone } from "react-icons/pi";
import { Link } from "react-router-dom";

const actions = [
  {
    id: "schedule",
    label: "Build Schedule",
    icon: <CiCalendar className="text-lg shrink-0" />,
    path: "/director-dashboard/build-schedule",
  },
  {
    id: "court",
    label: "Game Assignments",
    icon: <PiCourtBasketball className="text-lg shrink-0" />,
    path: "/director-dashboard/court-list",
  },
  {
    id: "camp-schedules",
    label: "Game Schedules",
    icon: <MdSchedule className="text-lg shrink-0" />,
    path: "/director-dashboard/camp-schedules",
  },
  {
    id: "evaluate",
    label: "Evaluate",
    icon: <PiSunglassesLight className="text-lg shrink-0" />,
    path: "/director-dashboard/evaluate",
  },
  {
    id: "ranking",
    label: "Ranking",
    icon: <BsArrowLeftRight className="text-lg shrink-0" />,
    path: "/director-dashboard/ranking",
  },
  {
    id: "roster",
    label: "Roster",
    icon: <HiOutlineUser className="text-lg shrink-0" />,
    path: "/director-dashboard/roster",
  },
  {
    id: "announcement",
    label: "Make Announcement",
    icon: <PiMegaphone className="text-lg shrink-0" />,
    path: "/director-dashboard/make-announcement",
  },
];

const MyCampusCart = ({
  league,
  assignedBy,
  permissions,
  skipScheduleFetch = false,
}) => {
  const {
    camp_id,
    camp_logo,
    camp_name,
    location,
    status,
    total_referees,
    total_courts,
  } = league || {};

  const isAssistantView = !!assignedBy;

  const { scheduleData } = useCampSchedule(
    !skipScheduleFetch && total_courts > 0 ? camp_id : null
  );

  const scheduleStatus = scheduleData?.status;

  const filteredActions = actions.filter((action) => {
    if (total_courts > 0 && action.id === "schedule") return false;
    if (total_courts <= 0 && action.id === "court") return false;
    return true;
  });

  return (
    <div className="w-full bg-white rounded-xl border border-[#E8E8E8] shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* ── Content ── */}
      <div className="p-4 sm:p-5 lg:p-6">
        {/* ── Top Row: Logo + Camp Name + Statuses ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Camp Logo Avatar */}
            {camp_logo ? (
              <div className="size-11 sm:size-12 md:size-14 rounded-full overflow-hidden shrink-0 border-2 border-white/80 shadow-md bg-white">
                <img
                  src={camp_logo}
                  alt={camp_name || "Camp logo"}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="size-11 sm:size-12 md:size-14 rounded-full shrink-0 border-2 border-gray-200 bg-gray-50 flex items-center justify-center shadow-sm">
                <span className="text-xl font-medium text-gray-400">
                  {camp_name?.charAt(0)?.toUpperCase() || "C"}
                </span>
              </div>
            )}

            {/* Name + Location */}
            <div className="min-w-0">
              <Link
                to={`/director-dashboard/camp-overview/${camp_id}`}
                className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900 hover:text-[#00AEEF] transition-colors duration-200"
              >
                {camp_name || "N/A"}
              </Link>
              <p className="text-xs sm:text-base text-gray-500 mt-0.5 truncate flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {location || "Location not set"}
              </p>
            </div>
          </div>

          {/* Status badges */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {assignedBy && (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-violet-50 text-violet-700 border border-violet-200"
                title={`Assigned by ${assignedBy}`}
              >
                <LuShieldCheck className="text-[13px]" />
                Assigned by {assignedBy}
              </span>
            )}
            {(scheduleStatus === "published" || scheduleStatus === "draft") && (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${scheduleStatus === "published"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
              >

                {scheduleStatus}
              </span>
            )}

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${status === "active"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "bg-red-50 text-red-700 border border-red-200"
                }`}
            >

              {status || "N/A"}
            </span>
          </div>
        </div>

        {/* ── Stats Row: Referees & Games ── */}
        <div className="flex flex-row justify-around mt-5 sm:mt-6 py-3 sm:py-4 gap-4 sm:gap-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center shadow-sm">
              <HiOutlineUser className="text-lg text-[#00AEEF]" />
            </div>
            <div>
              <p className="text-xl sm:text-3xl font-medium text-[#00AEEF] leading-none">
                {total_referees || "0"}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-medium">Referees</p>
            </div>
          </div>

          <div className="w-px h-10 bg-gray-200" />

          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center shadow-sm">
              <PiCourtBasketball className="text-lg text-[#00AEEF]" />
            </div>
            <div>
              <p className="text-xl sm:text-3xl font-medium text-[#00AEEF] leading-none">
                {total_courts || "0"}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-medium">Games</p>
            </div>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-2.5 mt-6">
          {filteredActions?.map((action) => (
            <Link
              to={`${action.path}/${camp_id}`}
              key={action.id}
              className="group flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2.5 sm:py-3 rounded-lg bg-gray-100 backdrop-blur-sm border border-gray-200/80 hover:border-[#00AEEF]/40 hover:bg-white hover:shadow-md hover:shadow-[#00AEEF]/5 transition-all duration-200"
            >
              <span className="text-gray-600 group-hover:text-[#00AEEF] transition-colors duration-200">
                {action?.icon}
              </span>
              <span className="text-[11px] sm:text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200 text-center leading-tight">
                {action?.label || "N/A"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCampusCart;
