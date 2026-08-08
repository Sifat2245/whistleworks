import { motion } from "framer-motion";
import { format } from "date-fns";
import { MdClose, MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const formatMonthYear = (dateStr) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d)) return "N/A";
  return format(d, "MMMM yyyy");
};

const EvaluatorDetailsModal = ({ isOpen, onClose, evaluator }) => {
  if (!evaluator || !isOpen) return null;

  const formatPhone = (phone) => {
    if (!phone) return "N/A";

    const digits = phone.replace(/\D/g, "");

    if (digits.length !== 10) {
      return digits.length === 0 ? "N/A" : digits;
    }

    // Format as (xxx) xxx-xxxx
    const areaCode = digits.slice(0, 3);
    const part1 = digits.slice(3, 6);
    const part2 = digits.slice(6, 10);

    return `(${areaCode}) ${part1}-${part2}`;
  };

  const infoRows = [
    {
      icon: MdEmail,
      label: "Email",
      value: evaluator.evaluatorMail || "N/A",
    },
    {
      icon: MdPhone,
      label: "Phone",
      value:
        evaluator.isPhoneShow !== false && evaluator.evaluatorNumber
          ? formatPhone(evaluator.evaluatorNumber)
          : "-",
    },
    {
      icon: MdLocationOn,
      label: "Address",
      value:
        evaluator.isAddressShow !== false && evaluator.evaluatorAddress
          ? evaluator.evaluatorAddress
          : "-",
    },
  ];

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
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-bold text-[#333]">Evaluator Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            aria-label="Close modal"
          >
            <MdClose className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center text-center">
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
              src={evaluator.image || "/default-avatar.png"}
              alt={evaluator.name}
              className="w-28 h-28 rounded-full object-cover ring-4 ring-primary/15 shadow-lg"
              onError={(e) => (e.target.src = "/default-avatar.png")}
            />
            <h3 className="text-xl font-semibold text-[#333] mt-4">
              {evaluator.name || "Unnamed Evaluator"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Evaluator ID: #{evaluator.id}
            </p>
            <span className="mt-3 inline-flex items-center gap-2 bg-green-50 text-green-700 border border-green-200/80 text-xs font-semibold px-4 py-1.5 rounded-full">
              <span className="relative flex size-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-70 motion-reduce:animate-none" />
                <span className="relative inline-flex rounded-full size-1.5 bg-green-500" />
              </span>
              Active since {formatMonthYear(evaluator.approvedAt)}
            </span>
          </div>

          <div className="space-y-3">
            {infoRows.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-3.5 bg-slate-50/80 rounded-xl p-3.5"
              >
                <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon className="text-lg" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="font-medium text-gray-900 truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-border">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EvaluatorDetailsModal;
