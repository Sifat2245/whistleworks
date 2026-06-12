import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export const useGetRefereeDetails = (campId, refereeId) => {
    const axiosInstance = useAxiosSecure();

    const { data: refereeDetails, isLoading } = useQuery({
        queryKey: ["referee-details", campId, refereeId],
        queryFn: async () => {
            const response = await axiosInstance.get(
                `/referee-details/${campId}/${refereeId}`
            );
            return response?.data?.data;
        },
        enabled: !!campId && !!refereeId,
    });

    return { refereeDetails, isLoading };
}