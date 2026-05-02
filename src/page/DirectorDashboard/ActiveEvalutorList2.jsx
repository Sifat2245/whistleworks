import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Spin } from "antd";
import EvaluatorCard from "@/components/dashboard/director_dashboard/Roster/EvaluatorCard";
import EvaluatorDetailsModal from "@/components/dashboard/director_dashboard/Roster/EvaluatorDetailsModal";

const ActiveEvaluatorList2 = ({
  activeEvaluatorData = [],
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
  onRemoveEvaluator,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvaluator, setSelectedEvaluator] = useState(null);

  const { ref, inView } = useInView({
    threshold: 0.5,
    rootMargin: "150px",
  });

  useEffect(() => {
    if (inView && hasMore && !isLoadingMore && onLoadMore) {
      onLoadMore();
    }
  }, [inView, hasMore, isLoadingMore, onLoadMore]);

  const openModal = (evaluator) => {
    setSelectedEvaluator(evaluator);
    setIsModalOpen(true);
  };

  const handleRemove = (evaluatorId) => {
    if (onRemoveEvaluator) onRemoveEvaluator(evaluatorId);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl lg:text-3xl text-[#333333] uppercase pb-6 sm:pb-8 font-semibold tracking-wide">
        ACTIVE EVALUATORS
      </h2>

      {/* Scrollable Container with Fixed Height */}
      <div className="h-[550px] overflow-y-auto pr-2 custom-scrollbar">
        {activeEvaluatorData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
            {activeEvaluatorData.map((evaluator) => (
              <EvaluatorCard
                key={evaluator.id}
                evaluator={evaluator}
                onCardClick={openModal}
                onRemove={handleRemove}
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-center py-20">
            <div>
              <h3 className="text-xl font-semibold text-gray-700">No Active Evaluators Yet</h3>
              <p className="text-gray-500 mt-2">Approved evaluators will appear here.</p>
            </div>
          </div>
        )}

        {/* Infinite Scroll Trigger */}
        {hasMore && (
          <div ref={ref} className="py-10 flex justify-center">
            {isLoadingMore && <Spin size="large" />}
          </div>
        )}
      </div>

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