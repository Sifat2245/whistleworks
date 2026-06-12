import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { ImCross } from "react-icons/im";
import { MdClose, MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { IoCheckboxOutline } from "react-icons/io5";
import { AiFillProfile } from "react-icons/ai";
import Icon from "@/components/common/Icon";
import singleUser from "/referee/single-user-icon.svg";
import EvaluatorCard from "./EvaluatorCard";
import useGetRoaseter from "@/hooks/get-roaster";

export default function Evaluator({ camp_id }) {
  const { roasterData } = useGetRoaseter(camp_id);
  const { evaluators = [] } = roasterData || {};

  const [selectedEvaluator, setSelectedEvaluator] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Client-side search filter
  const filteredEvaluators = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return evaluators;
    return evaluators.filter((ev) => {
      return (
        ev.name?.toLowerCase().includes(query) ||
        ev.email?.toLowerCase().includes(query) ||
        ev.id.toString().includes(query)
      );
    });
  }, [evaluators, searchQuery]);

  const handleCardClick = (evaluator) => {
    setSelectedEvaluator(evaluator);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEvaluator(null);
  };

  const formatPhone = (phone) => {
    if (!phone) return "N/A";
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      return digits.length === 0 ? "N/A" : digits;
    }
    const areaCode = digits.slice(0, 3);
    const part1 = digits.slice(3, 6);
    const part2 = digits.slice(6, 10);
    return `(${areaCode}) ${part1}-${part2}`;
  };

  return (
    <section className="border border-border rounded-xl p-5 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border border-border p-5 rounded-[10px] mb-6">
        <h3 className="text-xl font-medium">
          Evaluators{" "}
          <span className="text-gray-500">({evaluators.length})</span>
        </h3>
        <div className="bg-primary p-3.5 rounded-full">
          <Icon src={singleUser} className="size-5 text-white" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-md mb-6">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search evaluators by name, email, or ID..."
          className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/10 text-sm placeholder-gray-500 transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            <ImCross className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Grid of Cards */}
      {filteredEvaluators.length > 0 ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvaluators.map((evaluator) => (
            <div
              key={evaluator.id}
              onClick={() => handleCardClick(evaluator)}
              className="cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <EvaluatorCard
                evaluator={evaluator}
                onCardClick={handleCardClick}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          {searchQuery
            ? "No evaluators match your search."
            : "No evaluators have submitted evaluations yet"}
        </div>
      )}

      {/* Evaluator Details Modal - Same refined design */}
      <AnimatePresence>
        {isModalOpen && selectedEvaluator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={handleModalClose}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.4,
              }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
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
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    src={
                      selectedEvaluator.avatar ||
                      selectedEvaluator.image ||
                      "/default-avatar.png"
                    }
                    alt={selectedEvaluator.name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-[#00AEEF]/20 mb-4 shadow-lg"
                    onError={(e) => (e.target.src = "/default-avatar.png")}
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
                        {selectedEvaluator.email ||
                          selectedEvaluator.evaluatorMail ||
                          "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  {(selectedEvaluator.phone ||
                    selectedEvaluator.evaluatorNumber) && (
                    <div className="flex items-center gap-3">
                      <MdPhone className="text-gray-400 text-xl" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium text-gray-900 tracking-wide">
                          {formatPhone(
                            selectedEvaluator.phone ||
                              selectedEvaluator.evaluatorNumber,
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Address */}
                  {(selectedEvaluator.address ||
                    selectedEvaluator.evaluatorAddress) && (
                    <div className="flex items-center gap-3">
                      <MdLocationOn className="text-gray-400 text-xl" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium text-gray-900">
                          {selectedEvaluator.address ||
                            selectedEvaluator.evaluatorAddress}
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

                  {/* Biography */}
                  <div className="flex items-start gap-3">
                    <AiFillProfile className="text-gray-400 text-xl mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Biography</p>
                      <p className="font-medium text-gray-900 text-sm leading-relaxed">
                        {selectedEvaluator.biography || "Not provided"}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
