import ActiveCmpsBackBtn from "@/components/common/ActiveCmpsBackBtn";
import CommonText from "@/components/common/CommonText";
import CampCard from "@/components/reusable/CampCard";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";

export default function ActiveCamps() {
  const axiosInstance = useAxiosSecure()
  const { data: camps, isLoading } = useQuery({
    queryKey: ["camps"],
    queryFn: async () => {
      const response = await axiosInstance.get("/v1/referee/camp/my-registrations");
      return response?.data?.data?.registrations || [];
    },
  });
  console.log(camps, 'active camps');

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <section className="container w-full px-4 mx-auto mt-5">
      <ActiveCmpsBackBtn label="Active Camps" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
        {camps?.length > 0 ? (
          camps?.map((item) => <CampCard key={item.id} camp={item.camp} />)
        ) : (
          <div className="col-span-4 text-center py-12">
            <CommonText
              text=" You have not registered for any camps."
              className="text-lg"
            />
          </div>
        )}
      </div>
    </section>
  );
}
