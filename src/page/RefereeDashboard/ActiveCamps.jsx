import ActiveCmpsBackBtn from "@/components/common/ActiveCmpsBackBtn";
import CommonText from "@/components/common/CommonText";
import CampCard from "@/components/reusable/CampCard";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";

export default function ActiveCamps() {
  const axiosInstance = useAxiosSecure();

  const { data: registrations = [], isLoading } = useQuery({
    queryKey: ["active-camps"],
    queryFn: async () => {
      const response = await axiosInstance.get("/v1/referee/camp/active-camps");
      return response?.data?.data?.active_camps || []; // Note: API returns active_camps array
    },
  });

  // Separate checked-in and registered camps
  const checkedInCamps = registrations.filter(
    (item) => item.registration_status === "checked_in"
  );

  const registeredCamps = registrations.filter(
    (item) => item.registration_status === "registered"
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  const hasAnyCamps = registrations.length > 0;

  return (
    <section className="container w-full px-4 mx-auto mt-5">
      <ActiveCmpsBackBtn label="Active Camps" />

      {!hasAnyCamps ? (
        <div className="text-center py-20">
          <CommonText
            text="You have not registered for any camps."
            className="text-lg text-gray-600"
          />
        </div>
      ) : (
        <div className="space-y-12 mb-16">
          {/* Checked-In Camps Section */}
          {checkedInCamps.length > 0 && (
            <div>
              <h2 className="text-2xl font-medium mb-6 ">
                Checked-In Camps ({checkedInCamps.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {checkedInCamps.map((item) => (
                  <CampCard key={item.id} camp={item.camp} />
                ))}
              </div>
            </div>
          )}

          {/* Registered Camps Section */}
          {registeredCamps.length > 0 && (
            <div>
              <h2 className="text-2xl font-medium mb-6">
                Registered Camps ({registeredCamps.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {registeredCamps.map((item) => (
                  <CampCard key={item.id} camp={item.camp} />
                ))}
              </div>
            </div>
          )}

          {/* Fallback if somehow no camps in either category (shouldn't happen) */}
          {checkedInCamps.length === 0 && registeredCamps.length === 0 && (
            <div className="text-center py-12">
              <CommonText text="No active or registered camps found." className="text-lg" />
            </div>
          )}
        </div>
      )}
    </section>
  );
}