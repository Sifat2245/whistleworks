import MyCampusCart from "./MyCampusCart";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import MyCampCartSkeleton from "./MyCampCartSkeleton";

const MyCampus = () => {
    const axiosSecure = useAxiosSecure();

    // Note: get all campus
    const { data: getMyCamp, isLoading: campCartLoading } = useQuery({
        queryKey: ["my-campus"],
        queryFn: async () => {
            const response = await axiosSecure.get(`/v1/director/camp/list`);
            return response?.data?.data?.camp_list || [];
        }
    });

    return (
        <div className="w-full border border-[#E8E8E8] rounded-xl md:p-5 p-3 mt-10">
            <h4 className="text-2xl font-medium text-[#333]">
                MY Camps <span className="text-lg">({getMyCamp?.length})</span>
            </h4>
            {campCartLoading ? (
                <MyCampCartSkeleton />
            ) : (
                <div className="grid grid-cols-1 gap-5 mt-5">
                    {getMyCamp?.map((league) => (
                        <MyCampusCart key={league.camp_id} league={league} />
                    ))}
                </div>
            )}
        </div>
    );
};
export default MyCampus;