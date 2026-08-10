import { useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import BackBtn from "@/components/common/BackBtn";
import PaginationV2 from "@/components/common/PaginationV2";
import MyCampusCart from "@/page/dashboard/director-dashboard/dashboard/components/MyCampusCart";
import MyCampCartSkeleton from "@/page/dashboard/director-dashboard/dashboard/components/MyCampCartSkeleton";
import { useGetPreviousCamps } from "@/hooks/api/director-hooks/useCamps";

const DirectorPreviousCamps = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { previousCamps, pagination, isLoading, isError, refetch } =
    useGetPreviousCamps(currentPage);

  // Same pagination handling as the "My Camps" dashboard section
  const actualPerPage = pagination?.per_page || 10;
  const totalCamps = pagination?.total || 0;
  const hasMultiplePages = pagination?.last_page > 1 || totalCamps > actualPerPage;

  const handlePageClick = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full">
      <BackBtn />

      <div className="w-full border border-[#E8E8E8] rounded-xl md:p-6 p-4 mt-6 bg-white">
        {/* Header */}
        <div className="mb-6">
          <h4 className="text-xl md:text-2xl font-semibold text-[#333]">
            Previous Camps
            <span className="text-sm font-normal text-gray-600 ml-2">
              ({totalCamps} total)
            </span>
          </h4>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <MyCampCartSkeleton />
        ) : isError ? (
          <div className="rounded-xl border border-red-100 bg-red-50/60 p-10 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Failed to load previous camps
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
              Something went wrong while fetching your camp history. Please try
              again.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-90 active:scale-95"
            >
              <FiRefreshCw className="size-4" />
              Try again
            </button>
          </div>
        ) : previousCamps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No previous camps found.</p>
          </div>
        ) : (
          <>
            {/* Camps List — same card as My Camps */}
            <div className="grid grid-cols-1 gap-5">
              {previousCamps.map((camp) => (
                <MyCampusCart key={camp.camp_id} league={camp} />
              ))}
            </div>

            {hasMultiplePages && (
              <PaginationV2
                handlePageClick={handlePageClick}
                currentPage={currentPage}
                perPage={actualPerPage}
                totalItem={totalCamps}
              />
            )}

            {/* Accurate "Showing" info */}
            <div className="mt-4 text-center text-sm text-gray-600">
              Showing {(currentPage - 1) * actualPerPage + 1} to{" "}
              {Math.min(currentPage * actualPerPage, totalCamps)} of {totalCamps}{" "}
              camps
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DirectorPreviousCamps;
