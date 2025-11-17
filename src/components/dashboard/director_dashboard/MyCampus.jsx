import MyCampusCart from "./MyCampusCart";
import { HiOutlineUser } from "react-icons/hi2";
import { BsArrowLeftRight } from "react-icons/bs";
import { PiSunglassesLight } from "react-icons/pi";
import { CiCalendar } from "react-icons/ci";
import basketBall from "@/assets/dashboard/basketball.png"
import football from "@/assets/dashboard/football.png"

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
            { id: "schedule", label: "Schedule", icon: <CiCalendar className="text-xl shrink-0" /> },
            { id: "evaluate", label: "Evaluate", icon: <PiSunglassesLight className="text-xl shrink-0" /> },
            { id: "ranking", label: "Ranking", icon: <BsArrowLeftRight className="text-xl shrink-0" /> },
            { id: "roster", label: "Roster", icon: <HiOutlineUser className="text-xl shrink-0" /> },
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
            { id: "schedule", label: "Schedule", icon: <CiCalendar className="text-xl shrink-0" /> },
            { id: "evaluate", label: "Evaluate", icon: <PiSunglassesLight className="text-xl shrink-0" /> },
            { id: "ranking", label: "Ranking", icon: <BsArrowLeftRight className="text-xl shrink-0" /> },
            { id: "roster", label: "Roster", icon: <HiOutlineUser className="text-xl shrink-0" /> },
        ],
    },
];

const MyCampus = () => {
    return (
        <div className="w-full border border-[#E8E8E8] rounded-xl p-5 mt-10 gap-5 grid grid-cols-1">
            <h4 className="text-2xl font-medium text-[#333]">MY Camps</h4>
            {leaguesData?.map((league) => {
                return (
                    <MyCampusCart key={league.id} league={league} />
                )
            })}
        </div>
    );
};
export default MyCampus;