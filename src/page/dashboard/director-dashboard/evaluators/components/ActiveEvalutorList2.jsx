import { useState } from "react";
import EvaluatorCard from "@/page/dashboard/director-dashboard/evaluators/components/EvaluatorCard";
import EvaluatorDetailsModal from "@/page/dashboard/director-dashboard/evaluators/components/EvaluatorDetailsModal";
import PaginationV2 from "@/components/common/PaginationV2";

const ActiveEvaluatorList2 = ({
  activeEvaluatorData = [],
  pagination,
  onPageChange,
  campId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvaluator, setSelectedEvaluator] = useState(null);

  const openModal = (evaluator) => {
    setSelectedEvaluator(evaluator);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl lg:text-3xl text-[#333333] uppercase pb-6 sm:pb-8 font-semibold tracking-wide">
        ACTIVE EVALUATORS
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
        {activeEvaluatorData.length > 0 ? (
          activeEvaluatorData.map((evaluator) => (
            <EvaluatorCard
              key={evaluator.id}
              evaluator={evaluator}
              onCardClick={openModal}
              campId={campId}
            />
          ))
        ) : (
          <div className="col-span-full h-[400px] flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-700">
                No Active Evaluators Yet
              </h3>
              <p className="text-gray-500 mt-2">
                Approved evaluators will appear here.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.total > 0 && (
        <PaginationV2
          handlePageClick={onPageChange}
          perPage={pagination.per_page}
          totalItem={pagination.total}
          currentPage={pagination.current_page}
        />
      )}

      <EvaluatorDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvaluator(null);
        }}
        evaluator={selectedEvaluator}
      />
    </div>
  );
};

export default ActiveEvaluatorList2;
