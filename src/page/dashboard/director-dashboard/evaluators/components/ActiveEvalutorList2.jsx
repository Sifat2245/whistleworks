import { useState } from "react";
import EvaluatorCard from "@/page/dashboard/director-dashboard/evaluators/components/EvaluatorCard";
import EvaluatorDetailsModal from "@/page/dashboard/director-dashboard/evaluators/components/EvaluatorDetailsModal";
import PaginationV2 from "@/components/common/PaginationV2";
import EvaluatorListSkeleton from "./EvaluatorListSkeleton";
import EvaluatorSectionHeader from "./EvaluatorSectionHeader";
import EvaluatorStateCard from "./EvaluatorStateCard";
import { LuClipboardCheck } from "react-icons/lu";

const ActiveEvaluatorList2 = ({
  activeEvaluatorData = [],
  pagination,
  onPageChange,
  campId,
  isLoading = false,
  isError = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvaluator, setSelectedEvaluator] = useState(null);

  const openModal = (evaluator) => {
    setSelectedEvaluator(evaluator);
    setIsModalOpen(true);
  };

  return (
    <section className="w-full">
      <EvaluatorSectionHeader
        icon={LuClipboardCheck}
        title="Active Evaluators"
        subtitle="Approved evaluators assigned to this camp"
        count={pagination.total}
        countLabel="active"
        tone="primary"
      />

      {isError ? (
        <EvaluatorStateCard
          type="error"
          title="Failed to Load Active Evaluators"
          description="We couldn't load active evaluators. Please try again."
        />
      ) : isLoading ? (
        <EvaluatorListSkeleton count={8} />
      ) : activeEvaluatorData.length === 0 ? (
        <EvaluatorStateCard
          icon={LuClipboardCheck}
          title="No Active Evaluators Yet"
          description="Approved evaluators will appear here. Approve pending applications to get started."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
          {activeEvaluatorData.map((evaluator) => (
            <EvaluatorCard
              key={evaluator.id}
              evaluator={evaluator}
              onCardClick={openModal}
              campId={campId}
            />
          ))}
        </div>
      )}

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
    </section>
  );
};

export default ActiveEvaluatorList2;
