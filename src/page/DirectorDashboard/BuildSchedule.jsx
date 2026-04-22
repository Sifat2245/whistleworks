import BackBtn from "@/components/common/BackBtn";
import DailyTimeRange from "@/components/dashboard/director_dashboard/build_schedule/DailyTimeRange";
import CommonSectionTitle from "@/components/dashboard/director_dashboard/CommonSectionTitle";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const BuildSchedule = () => {
    const axiosSecure = useAxiosSecure();
    const { id } = useParams()

    // Note: get range data
    const { data: getDateRange } = useQuery({
        queryKey: ["date-range"],
        queryFn: async () => {
            const response = await axiosSecure.get(`/v1/camp/${id}/date-range`)
            return response?.data?.data;
        }
    });

    // console.log(getDateRange, 'date range');

    return (
        <div className="w-full">
            <BackBtn />
            <CommonSectionTitle
                text="Build Schedule"
                subText={`${getDateRange?.checked_in_referees_count || "0"} referees for this game or use auto-assign`}
            />

            {/*  */}
            {/* <CampDateRange /> */}
            <DailyTimeRange getDateRange={getDateRange} />
        </div>
    );
};
export default BuildSchedule;