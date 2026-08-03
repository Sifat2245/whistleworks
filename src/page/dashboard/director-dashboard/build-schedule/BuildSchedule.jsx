import BackBtn from "@/components/common/BackBtn";
import DailyTimeRange from "@/page/dashboard/director-dashboard/build-schedule/components/DailyTimeRange";
import CommonSectionTitle from "@/components/common/CommonSectionTitle";
import { useGetDateRange } from "@/hooks/api/director-hooks/useBuildSchedule";
import { useParams } from "react-router-dom";

const BuildSchedule = () => {
    const { id } = useParams()
    const { data: getDateRange } = useGetDateRange(id);

    return (
        <div className="w-full">
            <BackBtn />
            <CommonSectionTitle
                text="Build Schedule"
                subText={`${getDateRange?.checked_in_referees_count || "0"} referees for this game or use auto-assign`}
            />
            <DailyTimeRange getDateRange={getDateRange} />
        </div>
    );
};
export default BuildSchedule;