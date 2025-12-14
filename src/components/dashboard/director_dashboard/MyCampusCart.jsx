import { Link } from "react-router-dom";

const MyCampusCart = ({ league }) => {
    return (
        <div className="border border-[#E8E8E8] rounded-lg p-3 md:p-5 lg:p-6 w-full">

            {/* league name and location - Improved for mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
                    {/* image */}
                    <div className="size-8 md:size-10 shrink-0" >
                        <img
                            src={league?.locationIcon}
                            alt={league?.name || "Location icon"}
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* location and name */}
                    <div className="w-full min-w-0"> {/* Added min-w-0 for text truncation */}
                        <h2 className="font-medium text-base sm:text-lg md:text-xl text-[#333] truncate">
                            {league?.name}
                        </h2>
                        <p className="text-gray-500 text-sm sm:text-base truncate">
                            {league?.location}
                        </p>
                    </div>
                </div>

                <span className="px-3 py-1 bg-blue-100 text-primary font-medium rounded-md text-sm sm:text-base md:text-lg w-fit self-start sm:self-auto">
                    {league?.status}
                </span>
            </div>

            {/* referees and games - Stack on mobile */}
            <div className="flex flex-col sm:flex-row items-center justify-around mt-4 sm:mt-5 md:mt-6 gap-4 sm:gap-0">
                <div className="text-center w-full sm:w-auto">
                    <p className="text-[#00AEEF] text-xl sm:text-2xl md:text-3xl font-medium">
                        {league?.referees}
                    </p>
                    <p className="text-[#666] text-sm sm:text-base">Referees</p>
                </div>

                <div className="hidden sm:block h-12 w-px bg-[#E8E8E8]"></div>
                <div className="block sm:hidden h-px w-full bg-[#E8E8E8]"></div>

                <div className="text-center w-full sm:w-auto">
                    <p className="text-[#00AEEF] text-xl sm:text-2xl md:text-3xl font-medium">
                        {league?.games}
                    </p>
                    <p className="text-[#666] text-sm sm:text-base">Games</p>
                </div>
            </div>

            {/* action buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 mt-4 sm:mt-5 md:mt-6">
                {league?.actions?.map((action) => (
                    <Link
                        to={action.path}
                        key={action.id}
                        className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 cursor-pointer border border-[#E8E8E8] p-2 sm:p-3 rounded-md bg-[#F5F5F5] hover:bg-gray-200 transition-colors duration-200 text-center sm:text-left"
                    >
                        <span className="text-lg sm:text-xl">{action?.icon}</span>
                        <span className="text-xs sm:text-sm md:text-base truncate w-full text-center">
                            {action?.label}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
};
export default MyCampusCart;