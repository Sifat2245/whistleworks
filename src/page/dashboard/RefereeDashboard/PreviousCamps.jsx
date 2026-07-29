import ActiveCmpsBackBtn from "@/components/common/ActiveCmpsBackBtn";
import CampCard from "@/components/shared/CampCard";
import { useAuth } from "@/hooks/useAuth";
import PaginationV2 from "@/components/common/PaginationV2";
import { useEvaluatorPreviousCamps } from "@/hooks/api/evaluator-hooks/useEvaluatorCamps";
import { useRefereePreviousCamps } from "@/hooks/api/referee-hooks/useRefereeCamps";
import { useState } from "react";

export default function PreviousCamps() {
  const { userData } = useAuth();

  const role = userData?.role?.toLowerCase();
  const [page, setPage] = useState(1);

  const isEvaluator = role === "evaluator";

  const {
    registrations: evaluatorRegistrations,
    pagination: evaluatorPagination,
    isLoading: evaluatorLoading,
    isError: evaluatorError,
  } = useEvaluatorPreviousCamps(isEvaluator ? page : null);

  const {
    previousCamps: refereeCampData,
    pagination: refereePagination,
    isLoading: refereeLoading,
    isError: refereeError,
  } = useRefereePreviousCamps(!isEvaluator ? page : null);

  const isLoading = isEvaluator ? evaluatorLoading : refereeLoading;
  const isError = isEvaluator ? evaluatorError : refereeError;

  // Normalize data based on role
  let normalizedCamps = [];
  let pagination = {
    total: 0,
    per_page: 12,
    current_page: 1,
    last_page: 1,
  };

  if (isEvaluator) {
    pagination = evaluatorPagination || pagination;
    const registrationsData = evaluatorRegistrations || [];
    normalizedCamps = registrationsData.map((reg) => {
      const camp = reg.camp || {};
      return {
        id: camp.id,
        camp_name: camp.camp_name || camp.name,
        camp_logo: camp.camp_logo || camp.logo,
        sports_type: camp.sports_type_name,
        location: camp.location,
        start_date: camp.start_date,
        end_date: camp.end_date,
        price: camp.price || "0.00",
        referee_registration_status: reg.status || "completed",
        director: camp.director || {},
      };
    });
  } else {
    pagination = refereePagination || pagination;
    const refereeCamps = refereeCampData || [];
    normalizedCamps = refereeCamps.map((item) => {
      const camp = item.camp || {};
      const payment = item.payment || {};
      return {
        id: camp.id,
        camp_name: camp.name,
        camp_logo: camp.logo,
        sports_type: camp.sports_type,
        location: camp.location,
        start_date: camp.start_date,
        end_date: camp.end_date,
        price: payment.amount || "0.00",
        referee_registration_status: item.registration_status || item.status,
        director: camp.director || {},
      };
    });
  }

  const previousCamps = normalizedCamps;

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
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