import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdEmail, MdPhone, MdLocationOn, MdPerson } from "react-icons/md";
import { Tag, Spin } from "antd";
import { useGetRefereeDetails } from "@/hooks/api/useRefereeDetails";
import { format } from "date-fns";

const RefereeDetailsPopup = ({ isOpen, onClose, campId, referee }) => {
  const { refereeDetails, isLoading } = useGetRefereeDetails(campId, referee?.id);

  if (!referee || !isOpen) return null;

  const refData = refereeDetails?.referee;

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

  const getStatusBadge = (status) => {
    switch (status) {
      case "checked_in":
        return <Tag color="green">Checked In</Tag>;
      case "registered":
        return <Tag color="blue">Registered</Tag>;
      default:
        return <Tag color="default">{status || "—"}</Tag>;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Referee Details
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
                aria-label="Close modal"
              >
                <MdClose className="w-6 h-6" />
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Spin size="large" />
              </div>
            ) : (
              <>
                {/* Profile Section */}
                <div className="p-6 space-y-6">
                  <div className="flex flex-col items-center text-center">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      src={refData?.avatar || referee.avatar || "/default-avatar.png"}
                      alt={refData ? `${refData.first_name} ${refData.last_name}` : referee.name}
                      className="w-28 h-28 rounded-full object-cover border-4 border-[#00AEEF]/20 mb-4 shadow-lg"
                      onError={(e) => (e.target.src = "/default-avatar.png")}
                    />
                    <h3 className="text-xl font-semibold text-gray-900">
                      {refData
                        ? `${refData.first_name} ${refData.last_name}`
                        : referee.name || "Unnamed Referee"}
                    </h3>
                    {refData?.jersey_number && (
                      <p className="text-sm text-gray-500 mt-1">
                        Jersey #: {refData.jersey_number}
                      </p>
                    )}
                    <div className="mt-3">
                      {getStatusBadge(refData?.registration_status)}
                    </div>
                    {refData?.checked_in_at && (
                      <p className="text-xs text-gray-400 mt-2">
                        Checked in: {format(new Date(refData.checked_in_at), "MMM d, yyyy h:mm a")}
                      </p>
                    )}
                  </div>

                  {/* Contact & Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MdEmail className="text-gray-400 text-xl shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900 break-all">
                          {refData?.email || referee.email || "N/A"}
                        </p>
                      </div>
                    </div>

                    {(refData?.phone || referee.phone) && (
                      <div className="flex items-center gap-3">
                        <MdPhone className="text-gray-400 text-xl shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium text-gray-900 tracking-wide">
                            {formatPhone(refData?.phone || referee.phone)}
                          </p>
                        </div>
                      </div>
                    )}

                    {refData?.address && (
                      <div className="flex items-center gap-3">
                        <MdLocationOn className="text-gray-400 text-xl shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="font-medium text-gray-900">
                            {refData.address}
                          </p>
                        </div>
                      </div>
                    )}

                    {refData?.biography && (
                      <div className="flex items-start gap-3">
                        <MdPerson className="text-gray-400 text-xl shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Biography</p>
                          <p className="font-medium text-gray-900 text-sm leading-relaxed">
                            {refData.biography}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200">
                  <button
                    onClick={onClose}
                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RefereeDetailsPopup;
