/* eslint-disable no-unused-vars */
import useCampSchedule from "@/hooks/useCampSchedule";
import { BsArrowLeftRight } from "react-icons/bs";
import { CiCalendar } from "react-icons/ci";
import { HiOutlineUser } from "react-icons/hi2";
import { MdSchedule } from "react-icons/md";
import { PiCourtBasketball, PiSunglassesLight } from "react-icons/pi";
import { Link } from "react-router-dom";

const actions = [
  {
    id: "schedule",
    label: "Build Schedule",
    icon: <CiCalendar className="text-xl shrink-0" />,
    path: "/director-dashboard/build-schedule",
  },
  {
    id: "court",
    label: "Game Assignments",
    icon: <PiCourtBasketball className="text-xl shrink-0" />,
    path: "/director-dashboard/court-list",
  },
  {
    id: "camp-schedules",
    label: "Game Schedules",
    icon: <MdSchedule className="text-xl shrink-0" />,
    path: "/director-dashboard/camp-schedules",
  },
  {
    id: "evaluate",
    label: "Evaluate",
    icon: <PiSunglassesLight className="text-xl shrink-0" />,
    path: "/director-dashboard/evaluate",
  },
  {
    id: "ranking",
    label: "Ranking",
    icon: <BsArrowLeftRight className="text-xl shrink-0" />,
    path: "/director-dashboard/ranking",
  },
  {
    id: "roster",
    label: "Roster",
    icon: <HiOutlineUser className="text-xl shrink-0" />,
    path: "/director-dashboard/roster",
  },
];

const MyCampusCart = ({ league }) => {
  const {
    camp_id,
    camp_logo,
    camp_name,
    location,
    status,
    total_referees,
    total_courts,
    director_id,
    sports_type,
    sports_type_id,
  } = league || {};
  // console.log(league, "league");

  const { scheduleData } = useCampSchedule(total_courts > 0 ? camp_id : null);

  const scheduleStatus = scheduleData?.status;
  // console.log(scheduleData, "schedule data");

  const filteredActions = actions.filter((action) => {
    if (total_courts > 0) {
      return action.id !== "schedule";
    } else {
      return action.id !== "court";
    }
  });

  // Note: main ui component
  return (
    <div className="border border-[#E8E8E8] rounded-lg p-3 md:p-5 lg:p-6 w-full">
      {/* league name and location - Improved for mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
          {/* image */}
          <div className="size-8 md:size-10 shrink-0 rounded-full">
            <img
              src={camp_logo || ""}
              alt={league?.name || "Location icon"}
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          {/* location and name */}
          <div className="w-full min-w-0">
            <Link to={`/director-dashboard/camp-overview/${camp_id}`}>
              <h2 className="font-medium text-base sm:text-lg md:text-xl text-[#333] truncate underline hover:text-primary">
                {camp_name || "N/A"}
              </h2>
            </Link>
            <p className="text-gray-500 text-sm sm:text-base truncate">
              {location || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          {(scheduleStatus === "published" || scheduleStatus === "draft") &&
            (scheduleStatus === "published" ? (
              <span className="px-3 py-1 bg-green-100 text-green-500 font-medium rounded-md text-sm sm:text-base md:text-lg w-fit self-start sm:self-auto">
                {scheduleStatus}
              </span>
            ) : (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-600 font-medium rounded-md text-sm sm:text-base md:text-lg w-fit self-start sm:self-auto">
                {scheduleStatus}
              </span>
            ))}

          {status === "active" ? (
            <span className="px-3 py-1 bg-blue-100 text-primary font-medium rounded-md text-sm sm:text-base md:text-lg w-fit self-start sm:self-auto">
              {status || "N/F"}
            </span>
          ) : (
            <span className="px-3 py-1 bg-red-100 text-red-500 font-medium rounded-md text-sm sm:text-base md:text-lg w-fit self-start sm:self-auto">
              {status || "N/F"}
            </span>
          )}
        </div>
      </div>

      {/* referees and games - Stack on mobile */}
      <div className="flex flex-col sm:flex-row items-center justify-around mt-4 sm:mt-5 md:mt-6 gap-4 sm:gap-0">
        <div className="text-center w-full sm:w-auto">
          <p className="text-[#00AEEF] text-xl sm:text-2xl md:text-3xl font-medium">
            {total_referees || "00"}
          </p>
          <p className="text-[#666] text-sm sm:text-base">Referees</p>
        </div>

        <div className="hidden sm:block h-12 w-px bg-[#E8E8E8]"></div>
        <div className="block sm:hidden h-px w-full bg-[#E8E8E8]"></div>

        <div className="text-center w-full sm:w-auto">
          <p className="text-[#00AEEF] text-xl sm:text-2xl md:text-3xl font-medium">
            {total_courts || "00"}
          </p>
          <p className="text-[#666] text-sm sm:text-base">Games</p>
        </div>
      </div>

      {/* action buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 mt-4 sm:mt-5 md:mt-6">
        {filteredActions?.map((action) => (
          <Link
            to={`${action.path}/${camp_id}`}
            key={action.id}
            className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 cursor-pointer border border-[#E8E8E8] p-2 sm:p-3 rounded-md bg-[#F5F5F5] hover:bg-gray-200 transition-colors duration-200 text-center sm:text-left"
          >
            <span className="text-lg sm:text-xl">{action?.icon}</span>
            <span className="text-xs sm:text-sm md:text-base truncate w-full text-center">
              {action?.label || "N/A"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default MyCampusCart;
