import { useState } from "react";
import Icon from "@/components/common/Icon";
import singleUser from "/referee/single-user-icon.svg";
import EvaluatorCard from "./EvaluatorCard";
import useGetRoaseter from "@/hooks/get-roaster";
import { Modal } from "antd";
import { MdClose, MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { IoCheckboxOutline } from "react-icons/io5";

export default function Evaluator({ camp_id }) {
  const { roasterData } = useGetRoaseter(camp_id);
  const { evaluators = [] } = roasterData || {};

  const [selectedEvaluator, setSelectedEvaluator] = useState(null);
  console.log(roasterData, 'roaster data');

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

      {/* Modal - EXACTLY YOUR DESIGN */}
      <Modal
        title={null}
        open={!!selectedEvaluator}
        onCancel={handleModalClose}
        footer={null}
        width={500}
        centered
        closable={false}
      >
        {selectedEvaluator && (
          <div className="bg-white rounded-2xl">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Evaluator Details
              </h2>
              <button
                onClick={handleModalClose}
                className="text-gray-400 hover:text-gray-600 transition"
                aria-label="Close modal"
              >
                <MdClose className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="flex flex-col items-center text-center">
                <img
                  src={selectedEvaluator.avatar || "https://via.placeholder.com/100"}
                  alt={selectedEvaluator.name}
                  className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 mb-4"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/100")}
                />
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedEvaluator.name || "Unnamed Evaluator"}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  ID: #{selectedEvaluator.id}
                </p>
              </div>

              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-center gap-3">
                  <MdEmail className="text-gray-400 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">
                      {selectedEvaluator.email || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                {selectedEvaluator.phone && (
                  <div className="flex items-center gap-3">
                    <MdPhone className="text-gray-400 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">
                        {selectedEvaluator.phone}
                      </p>
                    </div>
                  </div>
                )}

                {/* Address */}
                {selectedEvaluator.address && (
                  <div className="flex items-center gap-3">
                    <MdLocationOn className="text-gray-400 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium text-gray-900">
                        {selectedEvaluator.address}
                      </p>
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="flex items-center gap-3">
                  <IoCheckboxOutline className="text-gray-400 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium text-green-600">
                      {selectedEvaluator.status || "Registered"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={handleModalClose}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}