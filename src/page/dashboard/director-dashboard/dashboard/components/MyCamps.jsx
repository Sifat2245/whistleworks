import { useState } from "react";
import CampCard from "./CampCard";
import CampCardSkeleton from "./CampCardSkeleton";
import { useGetMyCamp } from "@/hooks/api/director-hooks/useCamps";
import PaginationV2 from "@/components/common/PaginationV2";

const MyCamps = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // We no longer control perPage from frontend — backend always decides (currently fixed at 8)
  const { camps, pagination, campCartLoading } = useGetMyCamp(currentPage);

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  // Use actual values from API response
  const actualPerPage = pagination?.per_page || 8;
  const totalCamps = pagination?.total || 0;
  const hasMultiplePages =
    pagination?.last_page > 1 || totalCamps > actualPerPage;

  return (
    <div className="w-full border border-[#E8E8E8] rounded-xl md:p-6 p-4 my-6 bg-white">
      {/* Header */}
      <div className="mb-6">
        <h4 className="text-xl md:text-2xl font-semibold text-[#333]">
          My Camps
          <span className="text-sm font-normal text-gray-600 ml-2">
            ({totalCamps} total)
          </span>
        </h4>
      </div>

      {/* Loading State */}
      {campCartLoading ? (
        <CampCardSkeleton />
      ) : camps.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No camps found.</p>
        </div>
      ) : (
        <>
          {/* Camps List */}
          <div className="grid grid-cols-1 gap-5">
            {camps.map((camp) => (
              <CampCard key={camp.camp_id} league={camp} />
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
  );
};

export default MyCamps;
