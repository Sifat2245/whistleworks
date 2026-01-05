import ActiveCmpsBackBtn from "@/components/common/ActiveCmpsBackBtn";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import CampCard from "@/components/reusable/CampCard";

export default function PreviousCamps() {
  const axiosInstance = useAxiosSecure();

  const { data: previousCamps = [], isLoading, isError } = useQuery({
    queryKey: ["previous-camps"],
    queryFn: async () => {
      const response = await axiosInstance.get("/v1/referee/camp/previous-camps");
      return response?.data?.data?.previous_camps || [];
    },
  });

  if (isLoading) {
    return (
      <div className="text-center py-20 text-lg">
        Loading previous camps...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-red-600">
        Failed to load previous camps. Please try again.
      </div>
    );
  }

  return (
    <section className="container w-full px-4 mx-auto mt-5 mb-18">
      <ActiveCmpsBackBtn label="Previous Camps" />

      <h2 className="text-2xl font-semibold mb-8 mt-6">Previous Camps</h2>

      {previousCamps.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {previousCamps.map((registration) => {
            const camp = registration.camp;
            const payment = registration.payment || {};
            const status = registration.registration_status;

            const campDataForCard = {
              id: camp.id,
              camp_name: camp.name,
              camp_logo: camp.logo,
              location: camp.location,
              start_date: camp.start_date,
              end_date: camp.end_date,
              price: payment.amount || "0.00",
              referee_registration_status: status, // "checked_in" or "registered"
            };

            return (
              <CampCard
                key={camp.id} // Use camp.id as key
                camp={campDataForCard}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-gray-600">No previous camps found.</p>
        </div>
      )}
    </section>
  );
}