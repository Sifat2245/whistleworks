import { useState } from "react";
import ActiveCmpsBackBtn from "@/components/common/ActiveCmpsBackBtn";
import CampCard from "@/components/shared/CampCard";
import { useAuth } from "@/hooks/useAuth";
import PaginationV2 from "@/components/common/PaginationV2";
import { useEvaluatorPreviousCamps } from "@/hooks/api/evaluator-hooks/useEvaluatorCamps";
import { useRefereePreviousCamps } from "@/hooks/api/referee-hooks/useRefereeCamps";
import { Spin } from "antd";

export default function PreviousCamps() {
  const { userData } = useAuth();
  const role = userData?.role?.toLowerCase();
  const [page, setPage] = useState(1);

  const isEvaluator = role === "evaluator";
  const isReferee = role === "referee";

  const {
    registrations: evaluatorRegistrations,
    pagination: evaluatorPagination,
    isLoading: evaluatorLoading,
    isError: evaluatorError,
  } = useEvaluatorPreviousCamps(page, { enabled: isEvaluator });

  const {
    previousCamps: refereeCampData,
    pagination: refereePagination,
    isLoading: refereeLoading,
    isError: refereeError,
  } = useRefereePreviousCamps(page, { enabled: isReferee });

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
        sports_type: camp.sports_type_name || "Basketball",
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
        camp_name: camp.name || camp.camp_name,
        camp_logo: camp.logo || camp.camp_logo,
        sports_type: camp.sports_type || "Basketball",
        location: camp.location,
        start_date: camp.start_date,
        end_date: camp.end_date,
        price: payment.amount || camp.price || "0.00",
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

  return (
    <section className="w-full mt-2 font-sans">
      <ActiveCmpsBackBtn label="Previous Camps" />

      {/* Clean White Card Container matching Director Dashboard */}
      <div className="w-full bg-white rounded-xl border border-[#E8E8E8] md:p-6 p-4 my-6 shadow-xs">
        {/* Header */}
        <div className="mb-6 border-b border-[#E8E8E8] pb-4">
          <h4 className="text-xl md:text-2xl font-semibold text-[#333]">
            Previous Camps
            <span className="text-sm font-normal text-gray-600 ml-2">
              ({pagination.total || previousCamps.length || 0} total)
            </span>
          </h4>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            View completed officiating camps and historical evaluation records.
          </p>
        </div>

        {/* Content Section */}
        {isLoading && previousCamps.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : isError ? (
          <div className="text-center py-16 bg-red-50/50 rounded-xl border border-dashed border-red-200">
            <p className="text-sm font-medium text-red-600">
              Failed to load previous camps. Please try again.
            </p>
          </div>
        ) : previousCamps.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {previousCamps.map((campData) => (
                <CampCard key={campData.id} camp={campData} />
              ))}
            </div>

            {/* Pagination - only show if more than 1 page */}
            {pagination.last_page > 1 && (
              <div className="mt-8 flex justify-center">
                <PaginationV2
                  handlePageClick={handlePageChange}
                  currentPage={pagination.current_page}
                  perPage={pagination.per_page}
                  totalItem={pagination.total}
                  variant="my-6"
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <p className="text-base text-gray-500 font-medium">
              No previous camps found.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}