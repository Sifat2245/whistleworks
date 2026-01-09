import { useState } from "react";
import Icon from "@/components/common/Icon";
import singleUser from "/referee/single-user-icon.svg";
import EvaluatorCard from "./EvaluatorCard";
import useGetRoaseter from "@/hooks/get-roaster";
import { Modal } from "antd";

export default function Evaluator({ camp_id }) {
  const { roasterData } = useGetRoaseter(camp_id);
  const { evaluators = [] } = roasterData || {};

  const [selectedEvaluator, setSelectedEvaluator] = useState(null);

  const handleCardClick = (evaluator) => {
    setSelectedEvaluator(evaluator);
  };

  const handleModalClose = () => {
    setSelectedEvaluator(null);
  };

  return (
    <section className="border border-border rounded-xl p-5 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border border-border p-5 rounded-[10px] mb-6">
        <h3 className="text-xl font-medium">
          Evaluators <span className="text-gray-500">({evaluators.length})</span>
        </h3>
        <div className="bg-primary p-3.5 rounded-full">
          <Icon src={singleUser} className="size-5 text-white" />
        </div>
      </div>

      {/* Grid of Cards */}
      {evaluators.length > 0 ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {evaluators.map((evaluator) => (
            <div
              key={evaluator.id}
              onClick={() => handleCardClick(evaluator)}
              className="cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <EvaluatorCard evaluator={evaluator} />
            </div>
          ))}
        </div>
      ) : (
        <div className="col-span-4 text-center py-12 text-gray-500">
          No evaluators have submitted evaluations yet
        </div>
      )}

      {/* Modal with Full Evaluator Details */}
      <Modal
        title="Evaluator Details"
        open={!!selectedEvaluator}
        onCancel={handleModalClose}
        footer={null}
        width={600}
        centered
      >
        {selectedEvaluator && (
          <div className="py-4 space-y-6">
            {/* Avatar & Name */}
            <div className="flex items-center gap-6">
              <img
                src={selectedEvaluator.avatar || "https://via.placeholder.com/100"}
                alt={selectedEvaluator.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
              />
              <div>
                <h2 className="text-2xl font-bold">{selectedEvaluator.name}</h2>
                <p className="text-gray-600">{selectedEvaluator.email}</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem label="Email" value={selectedEvaluator.email} />
              <InfoItem label="Phone" value={selectedEvaluator.phone || "Not provided"} />
              <InfoItem label="Address" value={selectedEvaluator.address || "Not provided"} />
            </div>

            {/* Biography */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Biography</h4>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {selectedEvaluator.biography || "No biography provided."}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}

// Reusable Info Item Component
function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}