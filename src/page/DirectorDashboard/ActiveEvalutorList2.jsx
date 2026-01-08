// src/components/evaluators/ActiveEvaluatorList2.jsx
import EvaluatorCard from "@/components/dashboard/director_dashboard/Roster/EvaluatorCard";
import EvaluatorDetailsModal from "@/components/dashboard/director_dashboard/Roster/EvaluatorDetailsModal";
import { useState } from "react";
import Swal from "sweetalert2";

const ActiveEvaluatorList2 = ({ activeEvaluatorData = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvaluator, setSelectedEvaluator] = useState(null);
  
  const [evaluators, setEvaluators] = useState(activeEvaluatorData);

  const openModal = (evaluator) => {
    setSelectedEvaluator(evaluator);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvaluator(null);
  };

  const handleRemove = (evaluatorId) => {
    setEvaluators(prev => prev.filter(e => e.id !== evaluatorId));

    Swal.fire({
      title: "Removed!",
      text: "The evaluator has been successfully removed.",
      icon: "success",
      timer: 1800,
      showConfirmButton: false,
    });
  };;

  return (
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl lg:text-3xl text-[#333333] uppercase pb-6 sm:pb-8 font-semibold tracking-wide">
        ACTIVE EVALUATORS
      </h2>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
        {evaluators.map((evaluator) => (
          <EvaluatorCard
            key={evaluator.id}
            evaluator={evaluator}
            onCardClick={openModal}
            onRemove={handleRemove}
          />
        ))}
      </div>

      {evaluators.length === 0 && (
        <div className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-10 sm:p-16 text-center bg-gray-50/50">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0A5.002 5.002 0 019 5c0-1.052-.143-2.074-.414-3.006m4.828 0A5.002 5.002 0 0113 5c0 1.052.143 2.074.414 3.006m-6.828 0A5.002 5.002 0 017 15c0 1.052.143 2.074.414 3.006" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-3">
            No Active Evaluators Yet
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Approved evaluators will appear here once they are confirmed.
          </p>
        </div>
      )}

      <EvaluatorDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        evaluator={selectedEvaluator}
      />
    </div>
  );
};

export default ActiveEvaluatorList2;