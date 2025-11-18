import BackBtn from "@/components/common/BackBtn";
import CampDateRange from "@/components/dashboard/director_dashboard/build_schedule/CampDateRange";
import DailyTimeRange from "@/components/dashboard/director_dashboard/build_schedule/DailyTimeRange";
import CommonSectionTitle from "@/components/dashboard/director_dashboard/CommonSectionTitle";

const BuildSchedule = () => {
    return (
        <div className="w-full">
            <BackBtn />
            <CommonSectionTitle
                text="Build Schedule"
                subText="2 referees for this game or use auto-assign"
            />
            
            {/*  */}
            <CampDateRange />
            <DailyTimeRange />
        </div>
    );
};
export default BuildSchedule;