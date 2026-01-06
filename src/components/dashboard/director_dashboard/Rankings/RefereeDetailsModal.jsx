import { AnimatePresence, motion } from "framer-motion";
import { BsTrophy } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { Avatar } from "antd";

const RefereeDetailsModal = ({ isOpen, onClose, referee }) => {
  if (!referee) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Referee Performance</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition"
                aria-label="Close"
              >
                <MdClose className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8">
              {/* Avatar + Name + Rank */}
              <div className="flex flex-col items-center text-center mb-8">
                <Avatar size={100} className="mb-4 text-3xl">
                  {referee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </Avatar>
                <h3 className="text-2xl font-bold text-gray-900">{referee.name}</h3>
                <div className="flex items-center gap-3 mt-3">
                  <BsTrophy className="w-8 h-8 text-yellow-500" />
                  <span className="text-3xl font-bold text-gray-800">
                    Rank #{referee.rank}
                  </span>
                </div>
                <p className="text-lg text-gray-600 mt-2">
                  Overall Score:{" "}
                  <span className="font-bold text-2xl text-cyan-600">
                    {referee.overall_percentage}%
                  </span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Based on {referee.count} evaluation{referee.count > 1 ? "s" : ""}
                </p>
              </div>

              {/* Performance Criteria */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                {[
                  { label: "Call Accuracy", value: referee.call_accuracy },
                  { label: "Communication", value: referee.communication_skills },
                  { label: "Consistency", value: referee.consistency_of_calls },
                  { label: "Mechanics", value: referee.court_position_mechanics },
                  { label: "Fitness & Mobility", value: referee.fitness_mobility },
                  { label: "Game Awareness", value: referee.game_awareness },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 text-center"
                  >
                    <p className="text-sm text-gray-600 mb-2">{item.label}</p>
                    <p className="text-3xl font-bold text-gray-800">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Recommended Levels */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Recommended Levels
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(referee.levels).map(([level, count]) => (
                    <div
                      key={level}
                      className={`text-center py-3 px-4 rounded-lg font-medium ${
                        count > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      <div className="text-sm">{level}</div>
                      <div className="text-2xl font-bold">{count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RefereeDetailsModal;