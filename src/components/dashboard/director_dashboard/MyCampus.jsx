import MyCampusCart from "./MyCampusCart";
import { HiOutlineUser } from "react-icons/hi2";
import { BsArrowLeftRight } from "react-icons/bs";
import { PiSunglassesLight } from "react-icons/pi";
import { CiCalendar } from "react-icons/ci";
import basketBall from "@/assets/dashboard/basketball.png"
import football from "@/assets/dashboard/football.png"
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";

const leaguesData = [
    {
        id: "league-1",
        name: "Summer Basketball League",
        location: "Oakland, CA",
        referees: 24,
        games: 51,
        status: "Active",
        locationIcon: basketBall,

        actions: [
            { id: "schedule", label: "Schedule", icon: <CiCalendar className="text-xl shrink-0" />, path: "/director-dashboard/build-schedule" },
            { id: "evaluate", label: "Evaluate", icon: <PiSunglassesLight className="text-xl shrink-0" />, path: "/director-dashboard/evaluate" },
            { id: "ranking", label: "Ranking", icon: <BsArrowLeftRight className="text-xl shrink-0" />, path: "/director-dashboard/ranking" },
            { id: "roster", label: "Roster", icon: <HiOutlineUser className="text-xl shrink-0" />, path: "/director-dashboard/roster" },
        ],
    },
    {
        id: "league-2",
        name: "Winter Basketball League",
        location: "Los Angeles, CA",
        referees: 18,
        games: 39,
        status: "Inactive",
        locationIcon: football,

        actions: [
            { id: "schedule", label: "Schedule", icon: <CiCalendar className="text-xl shrink-0" />, path: "/director-dashboard/build-schedule" },
            { id: "evaluate", label: "Evaluate", icon: <PiSunglassesLight className="text-xl shrink-0" />, path: "/director-dashboard/evaluate" },
            { id: "ranking", label: "Ranking", icon: <BsArrowLeftRight className="text-xl shrink-0" />, path: "/director-dashboard/ranking" },
            { id: "roster", label: "Roster", icon: <HiOutlineUser className="text-xl shrink-0" />, path: "/director-dashboard/roster" },
        ],
    },
];

const MyCampus = () => {
    const axiosSecure = useAxiosSecure();

    // Note: get all campus
    const { data: getMyCamp } = useQuery({
        queryKey: ["my-campus"],
        queryFn: async () => {
            const response = await axiosSecure.get(`/v1/director/camp/list`);
            return response?.data?.data?.camp_list || [];
        }
    });
    console.log("My camp list:--->", getMyCamp);

    // Note: main ui component
    return (
        <div className="w-full border border-[#E8E8E8] rounded-xl md:p-5 p-3 mt-10 gap-5 grid grid-cols-1">
            <h4 className="text-2xl font-medium text-[#333]">MY Camps <span className="text-lg">({getMyCamp?.length})</span></h4>
            {leaguesData?.map((league) => {
                return (
                    <MyCampusCart key={league.id} league={league} />
                )
            })}
        </div>
    );
};
export default MyCampus;