import { useState } from "react";
import { useLocation } from "react-router-dom";
import ActiveCmpsBackBtn from "@/components/common/ActiveCmpsBackBtn";
import CommonText from "@/components/common/CommonText";
import PaginationV2 from "@/components/common/PaginationV2";
import CampCard from "@/components/shared/CampCard";
import { useMyRegistrations } from "@/hooks/api/evaluator-hooks/useEvaluatorCamps";
import { Spin } from "antd";

export default function MyCamps() {
  const [currentPage, setCurrentPage] = useState(1);
  const { pathname } = useLocation();
  const isDashboardRoot = pathname === "/evaluator-dashboard";
  const [perPage] = useState(12);

  const { registrations, pagination, isLoading } = useMyRegistrations(
    currentPage,
    perPage
  );

  const actualPerPage = pagination.per_page || perPage;

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const total = pagination.total || 0;

  return (
    <section className="w-full mt-2 font-sans">
      {!isDashboardRoot && <ActiveCmpsBackBtn label="My Registered Camps" />}

      {/* Clean White Card Container matching Director Dashboard */}
      <div className="w-full bg-white rounded-xl border border-[#E8E8E8] md:p-6 p-4 my-6 shadow-xs">
        {/* Header */}
        <div className="mb-6 border-b border-[#E8E8E8] pb-4">
          <h4 className="text-xl md:text-2xl font-semibold text-[#333]">
            My Registered Camps
            <span className="text-sm font-normal text-gray-600 ml-2">
              ({total} total)
            </span>
          </h4>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            View officiating clinics and camps assigned to your evaluator account.
          </p>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : registrations.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {registrations.map((registration) => {
                const camp = {
                  id: registration.camp.id,
                  camp_name: registration.camp.camp_name || registration.camp.name,
                  camp_logo: registration.camp.camp_logo || registration.camp.logo,
                  sports_type: registration.camp.sports_type_name || "Basketball",
                  location: registration.camp.location,
                  start_date: registration.camp.start_date,
                  end_date: registration.camp.end_date,
                  price: registration.camp.price || "Free",
                  director: registration.camp.director || {},
                };
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

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <PaginationV2
                handlePageClick={handlePageClick}
                currentPage={currentPage}
                perPage={actualPerPage}
                totalItem={total}
              />
            )}

            {/* Showing info */}
            <div className="mt-4 text-center text-sm text-gray-600">
              Showing {(currentPage - 1) * actualPerPage + 1} to{" "}
              {Math.min(currentPage * actualPerPage, total)} of {total} camps
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <CommonText
              text="You have not registered for any camps yet."
              className="text-base text-gray-500 font-medium"
            />
          </div>
        )}
      </div>
    </section>
  );
}
