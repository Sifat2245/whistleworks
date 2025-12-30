import ActiveCmpsBackBtn from "@/components/common/ActiveCmpsBackBtn";
import CommonText from "@/components/common/CommonText";
import CampCard from "@/components/reusable/CampCard";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";

export default function MyCamps() {
  const axiosInstance = useAxiosSecure();

  const { data: registrations = [], isLoading } = useQuery({
    queryKey: ["my-camp-registrations"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        "/evaluator/camp-registration/my-registrations"
      );
      return response?.data?.data?.registrations || [];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <section className="container w-full px-4 mx-auto mt-5">
      <ActiveCmpsBackBtn label="My Registered Camps" />

      {registrations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {registrations.map((registration) => {
            const camp = registration.camp;
            const status = registration.status; 

            return (
              <CampCard
                key={registration.id} 
                camp={camp}
                registrationStatus={status} 
                registrationId={registration.id} 
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <CommonText
            text="You have not registered for any camps yet."
            className="text-lg text-gray-600"
          />
        </div>
      )}
    </section>
  );
}