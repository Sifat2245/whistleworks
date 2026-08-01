import { useState } from "react";
import EvaluatorCard from "@/page/dashboard/director-dashboard/evaluators/components/EvaluatorCard";
import EvaluatorDetailsModal from "@/page/dashboard/director-dashboard/evaluators/components/EvaluatorDetailsModal";
import PaginationV2 from "@/components/common/PaginationV2";
import EvaluatorListSkeleton from "./EvaluatorListSkeleton";
import {
  LuClipboardCheck,
  LuInbox,
  LuTriangleAlert,
  LuRefreshCw,
} from "react-icons/lu";

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
      <div className="flex items-center gap-3.5 mb-6">
        <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">
          <LuClipboardCheck />
        </span>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-[#333]">
            Active Evaluators
          </h2>
          <p className="text-sm text-[#666]">
            Approved evaluators assigned to this camp
          </p>
        </div>
        <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full shrink-0">
          {pagination.total} active
        </span>
      </div>

      {isError ? (
        <div className="mx-auto max-w-md bg-red-50 border border-red-200 rounded-[10px] p-8 text-center">
          <LuTriangleAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-3">
            Failed to Load Active Evaluators
          </h3>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
          >
            <LuRefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      ) : isLoading ? (
        <EvaluatorListSkeleton count={8} />
      ) : activeEvaluatorData.length === 0 ? (
        <div className="rounded-[10px] border border-border bg-white py-16 text-center">
          <LuInbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-[#333]">
            No Active Evaluators Yet
          </h3>
          <p className="text-sm text-[#666] mt-1">
            Approved evaluators will appear here.
          </p>
        </div>
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
