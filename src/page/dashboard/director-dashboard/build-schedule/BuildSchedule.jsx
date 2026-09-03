import BackBtn from "@/components/common/BackBtn";
import DailyTimeRange from "@/page/dashboard/director-dashboard/build-schedule/components/DailyTimeRange";
import BuildScheduleSkeleton from "@/page/dashboard/director-dashboard/build-schedule/components/BuildScheduleSkeleton";
import CommonSectionTitle from "@/components/common/CommonSectionTitle";
import { useGetDateRange } from "@/hooks/api/director-hooks/useBuildSchedule";
import { useParams } from "react-router-dom";
import {
  LuCalendarRange,
  LuCalendarDays,
  LuGlobe,
  LuUsers,
} from "react-icons/lu";

const BuildSchedule = () => {
  const { id } = useParams();
  const { data: getDateRange, isLoading } = useGetDateRange(id);

  if (isLoading) return <BuildScheduleSkeleton />;

  const {
    start_date = "—",
    end_date = "—",
    timezone_name,
    timezoneName,
    timezone,
    dates = [],
    checked_in_referees_count = 0,
  } = getDateRange || {};

  const displayTimezone = timezone_name || timezoneName || timezone || "—";

  const stats = [
    {
      label: "Camp Dates",
      value: `${start_date} — ${end_date}`,
      icon: <LuCalendarRange />,
    },
    {
      label: "Playing Days",
      value: `${dates.length} day${dates.length === 1 ? "" : "s"}`,
      icon: <LuCalendarDays />,
    },
    {
      label: "Timezone",
      value: displayTimezone,
      icon: <LuGlobe />,
    },
    {
      label: "Referees Available",
      value: `${checked_in_referees_count}`,
      icon: <LuUsers />,
    },
  ];

  return (
    <div className="w-full pb-12">
      <BackBtn />

      <CommonSectionTitle
        text="Build Schedule"
        subText={`${checked_in_referees_count} referees available — set your times, game setup and venues below, then generate the schedule`}
      />

      {/* Overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-border rounded-[10px] px-4 py-3.5 flex items-center gap-3"
          >
            <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-lg shrink-0">
              {stat.icon}
            </span>
            <div className="min-w-0">
              <p className="text-xs text-[#666]">{stat.label}</p>
              <p className="text-sm font-medium text-[#333] truncate">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <DailyTimeRange getDateRange={getDateRange} />
    </div>
  );
};
export default BuildSchedule;