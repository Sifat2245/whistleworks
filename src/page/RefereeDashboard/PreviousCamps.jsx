import ActiveCmpsBackBtn from "@/components/common/ActiveCmpsBackBtn";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import CampCard from "@/components/reusable/CampCard";
import { useAuth } from "@/hooks/useAuth";
import PaginationV2 from "@/components/common/PaginationV2";
import { useState } from "react";

export default function PreviousCamps() {
  const axiosInstance = useAxiosSecure();
  const { userData } = useAuth();

  const role = userData?.role?.toLowerCase();
  const [page, setPage] = useState(1);

  const getApiEndpoint = () => {
    if (role === "evaluator") {
      return "/evaluator/camp-registration/previous-camps";
    }
    return "/v1/referee/camp/previous-camps";
  };

  const {
    data = { camps: [], pagination: {} },
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["previous-camps", role, page],
    queryFn: async () => {
      const endpoint = getApiEndpoint();
      const response = await axiosInstance.get(endpoint, {
        params: { page }, // ?page=1, ?page=2, etc.
      });

      const rawData = response?.data?.data || {};
      let normalizedCamps = [];
      let pagination = {
        total: 0,
        per_page: 12,
        current_page: 1,
        last_page: 1,
      };

      // Both endpoints return pagination in the same structure
      pagination = rawData.pagination || pagination;

      if (role === "evaluator") {
        const registrations = rawData.registrations || [];
        normalizedCamps = registrations.map((reg) => {
          const camp = reg.camp || {};
          return {
            id: camp.id,
            camp_name: camp.camp_name || camp.name,
            camp_logo: camp.camp_logo || camp.logo,
            location: camp.location,
            start_date: camp.start_date,
            end_date: camp.end_date,
            price: camp.price || "0.00",
            referee_registration_status: reg.status || "completed",
            director: camp.director || {},
          };
        });
      } else {
        // Referee response
        const previousCamps = rawData.previous_camps || [];
        normalizedCamps = previousCamps.map((item) => {
          const camp = item.camp || {};
          const payment = item.payment || {};
          return {
            id: camp.id,
            camp_name: camp.name,
            camp_logo: camp.logo,
            location: camp.location,
            start_date: camp.start_date,
            end_date: camp.end_date,
            price: payment.amount || "0.00",
            referee_registration_status: item.registration_status || item.status,
            director: camp.director || {},
          };
        });
      }

      return {
        camps: normalizedCamps,
        pagination,
      };
    },
    enabled: !!role,
    keepPreviousData: true, // Smooth transitions between pages
  });

  const previousCamps = data.camps || [];
  const pagination = data.pagination || {
    total: 0,
    per_page: 12,
    current_page: 1,
    last_page: 1,
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Nice UX
  };

  if (isLoading && previousCamps.length === 0) {
    return (
      <div className="text-center py-20 text-lg">Loading previous camps...</div>
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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {previousCamps.map((campData) => (
              <CampCard key={campData.id} camp={campData} />
            ))}
          </div>

          {/* Pagination - only show if more than 1 page */}
          {pagination.last_page > 1 && (
            <div className="mt-12 flex justify-center">
              <PaginationV2
                handlePageClick={handlePageChange}
                currentPage={pagination.current_page}
                perPage={pagination.per_page}
                totalItem={pagination.total}
                variant="my-12"
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-gray-600">No previous camps found.</p>
        </div>
      )}
    </section>
  );
}