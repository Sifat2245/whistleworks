import { Link } from "react-router-dom";

const MyCampusCart = ({ league }) => {
    return (
        <div className="border border-[#E8E8E8] rounded-lg p-5">

            {/* leage name and location */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* image */}
                    <div className="size-8 shrink-0" >
                        <img src={league?.locationIcon} alt="" className="w-full h-full" />
                    </div>

                    {/* location and name */}
                    <div className="w-full">
                        <h2 className="font-medium text-lg text-[#333]">{league?.name}</h2>
                        <p className="text-gray-500">{league?.location}</p>
                    </div>
                </div>

                <span className="px-3 py-1 bg-blue-100 text-primary font-medium rounded-md text-base">
                    {league?.status}
                </span>
            </div>

            {/* referees and games */}
            <div className="flex items-center justify-around mt-5">
                <div className="text-center">
                    <p className="text-[#00AEEF] text-2xl font-medium">{league?.referees}</p>
                    <p className="text-[#666] text-base">Referees</p>
                </div>

                <div className="text-center">
                    <p className="text-[#00AEEF] text-2xl font-medium">{league?.games}</p>
                    <p className="text-[#666] text-base">Games</p>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-3 mt-5">
                {league?.actions.map((action) => (
                    <Link 
                    to={action.path}
                        key={action.id}
                        className="flex items-center justify-center gap-2 cursor-pointer border border-[#E8E8E8] p-2 rounded-md bg-[#F5F5F5] hover:bg-gray-200 transition"
                    >
                        {action?.icon}
                        {action?.label}
                    </Link>
                ))}
            </div>
        </div>
    );
};
export default MyCampusCart;