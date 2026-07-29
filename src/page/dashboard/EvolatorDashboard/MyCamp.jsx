import { useState } from "react";
import ActiveCmpsBackBtn from "@/components/common/ActiveCmpsBackBtn";
import CommonText from "@/components/common/CommonText";
import PaginationV2 from "@/components/common/PaginationV2";
import CampCard from "@/components/shared/CampCard";
import {
  useMyRegistrations,
  useCancelRegistration,
} from "@/hooks/api/evaluator-hooks/useEvaluatorCamps";
import { Spin } from "antd";
import Swal from "sweetalert2";

export default function MyCamps() {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(12);

  const { registrations, pagination, isLoading } = useMyRegistrations(
    currentPage,
    perPage,
  );
  const cancelRegistration = useCancelRegistration();

  const actualPerPage = pagination.per_page || perPage;

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const total = pagination.total || 0;

  const handleCancel = (registrationId, campName) => {
    Swal.fire({
      title: "Cancel Registration?",
      html: `<p class="text-gray-600">Are you sure you want to cancel your registration for <strong>${campName}</strong>?</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "Keep Registration",
      reverseButtons: true,
      customClass: {
        confirmButton:
          "bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg px-6 py-2.5",
        cancelButton:
          "bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg px-6 py-2.5",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        cancelRegistration.mutate(registrationId);
      }
    });
  };

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

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[#333]">
          My Registered Camps
          <span className="text-lg font-normal text-gray-600 ml-3">
            ({total} total)
          </span>
        </h2>
      </div>

      {registrations.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {registrations.map((registration) => {
              const camp = {
                id: registration.camp.id,
                camp_name: registration.camp.camp_name,
                camp_logo: registration.camp.camp_logo,
                sports_type: registration.camp.sports_type_name,
                location: registration.camp.location,
                start_date: registration.camp.start_date,
                end_date: registration.camp.end_date,
                price: registration.camp.price || "Free",
                director: registration.camp.director || {},
              };
              const status = registration.status;
              const canCancel = status === "pending";

              return (
                <div key={registration.id} className="flex flex-col gap-3">
                  <CampCard
                    camp={camp}
                    registrationStatus={status}
                    registrationId={registration.id}
                  />
                  {canCancel && (
                    <button
                      onClick={() =>
                        handleCancel(registration.id, registration.camp.camp_name)
                      }
                      disabled={cancelRegistration.isPending}
                      className="w-full py-2.5 px-4 rounded-lg border border-red-300 text-red-600 font-medium text-sm
                        hover:bg-red-50 hover:border-red-400 transition-all duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed
                        flex items-center justify-center gap-2"
                    >
                      {cancelRegistration.isPending ? (
                        <>
                          <Spin size="small" />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Cancel Registration
                        </>
                      )}
                    </button>
                  )}
                </div>
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
