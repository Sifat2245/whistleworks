import { motion } from "framer-motion";
import { MdClose, MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { IoCheckboxOutline } from "react-icons/io5";

const RefereeDetailsModal = ({ isOpen, onClose, referee }) => {
  if (!referee || !isOpen) return null;

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
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
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Referee Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Close modal"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center text-center">
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
              src={referee.avatar || "/default-avatar.png"}
              alt={referee.name}
              className="w-28 h-28 rounded-full object-cover border-4 border-[#00AEEF]/20 mb-4 shadow-lg"
              onError={(e) => (e.target.src = "/default-avatar.png")}
            />
            <h3 className="text-xl font-semibold text-gray-900">
              {referee.name || "Unnamed Referee"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Jersey ID: #{referee.jourcy_number || "—"}
            </p>
            <span className={`mt-3 inline-block text-sm font-medium px-4 py-1.5 rounded-full ${
              referee.status === "checked_in"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}>
              {referee.status === "checked_in" ? "Checked In" : "Registered"}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MdEmail className="text-gray-400 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">
                  {referee.email || "N/A"}
                </p>
              </div>
            </div>

            {referee.phone && (
              <div className="flex items-center gap-3">
                <MdPhone className="text-gray-400 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900 tracking-wide">
                    {formatPhone(referee.phone)}
                  </p>
                </div>
              </div>
            )}

            {referee.address && (
              <div className="flex items-center gap-3">
                <MdLocationOn className="text-gray-400 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium text-gray-900">
                    {referee.address}
                  </p>
                </div>
              </div>
            )}

            {referee.biography && (
              <div className="flex items-start gap-3">
                <MdLocationOn className="text-gray-400 text-xl mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Biography</p>
                  <p className="font-medium text-gray-900 text-sm leading-relaxed">
                    {referee.biography}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <IoCheckboxOutline className="text-gray-400 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Games Assigned</p>
                <p className="text-2xl font-bold text-[#00AEEF]">
                  {referee.assigned_games_count ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>

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
  );
};

export default RefereeDetailsModal;
