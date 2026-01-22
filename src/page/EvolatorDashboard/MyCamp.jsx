import { useState } from "react";
import ActiveCmpsBackBtn from "@/components/common/ActiveCmpsBackBtn";
import CommonText from "@/components/common/CommonText";
import PaginationV2 from "@/components/common/PaginationV2";
import CampCard from "@/components/reusable/CampCard";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";

export default function MyCamps() {
  const axiosInstance = useAxiosSecure();

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(12);

  const {
    data: response = {},
    isLoading,
  } = useQuery({
    queryKey: ["my-camp-registrations", currentPage],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/evaluator/camp-registration/my-registrations?page=${currentPage}&per_page=${perPage}`
      );
      return res?.data?.data || { registrations: [], pagination: {} };
    },
    keepPreviousData: true,
  });

  const registrations = response.registrations || [];
  const pagination = response.pagination || {};
  const total = pagination.total || 0;
  const actualPerPage = pagination.per_page || perPage;

  console.log(registrations, 'asd');

  const handlePageClick = (page) => {
    setCurrentPage(page);
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