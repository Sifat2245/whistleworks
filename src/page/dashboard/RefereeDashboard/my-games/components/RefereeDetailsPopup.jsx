import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdEmail, MdPhone, MdLocationOn, MdPerson } from "react-icons/md";
import { Spin } from "antd";
import { useGetRefereeDetails } from "@/hooks/api/useRefereeDetails";
import { format } from "date-fns";
import { formatRefereePosition } from "@/utils/refereePositions";
import { LuUser } from "react-icons/lu";

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 font-sans"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-[#E8E8E8]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-[#E8E8E8]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#00AEEF] flex items-center justify-center text-lg">
                  <LuUser />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Co-Referee Details
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                aria-label="Close modal"
              >
                <MdClose className="w-5 h-5" />
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
                    <img
                      src={refData?.avatar || referee.avatar || "/default-avatar.png"}
                      alt={refData ? `${refData.first_name} ${refData.last_name}` : referee.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-[#00AEEF]/20 mb-3 shadow-md"
                      onError={(e) => (e.target.src = "/default-avatar.png")}
                    />
                    <h3 className="text-lg font-bold text-gray-900">
                      {refData
                        ? `${refData.first_name} ${refData.last_name}`
                        : referee.name || "Unnamed Referee"}
                    </h3>

                    {referee?.position && (
                      <span className="mt-1 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#00AEEF] border border-blue-100">
                        {formatRefereePosition(referee.position)}
                      </span>
                    )}

                    {refData?.jersey_number && (
                      <p className="text-xs text-gray-500 font-mono mt-1">
                        Jersey #: {refData.jersey_number}
                      </p>
                    )}

                    {refData?.checked_in_at && (
                      <p className="text-xs text-emerald-600 mt-2 font-medium">
                        Checked in: {format(new Date(refData.checked_in_at), "MMM d, yyyy h:mm a")}
                      </p>
                    )}
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-4 pt-2 border-t border-[#E8E8E8]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                        <MdEmail className="text-base" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email Address</p>
                        <p className="font-medium text-gray-900 text-sm break-all">
                          {refData?.email || referee.email || "N/A"}
                        </p>
                      </div>
                    </div>

                    {(refData?.phone || referee.phone) && (
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                          <MdPhone className="text-base" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Phone Number</p>
                          <p className="font-medium text-gray-900 text-sm tracking-wide">
                            {formatPhone(refData?.phone || referee.phone)}
                          </p>
                        </div>
                      </div>
                    )}

                    {refData?.address && (
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                          <MdLocationOn className="text-base" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="font-medium text-gray-900 text-sm">
                            {refData.address}
                          </p>
                        </div>
                      </div>
                    )}

                    {refData?.biography && (
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 shrink-0 mt-0.5">
                          <MdPerson className="text-base" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Biography</p>
                          <p className="font-normal text-gray-700 text-xs sm:text-sm leading-relaxed mt-0.5">
                            {refData.biography}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-[#E8E8E8]">
                  <button
                    onClick={onClose}
                    className="w-full py-2.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold text-sm rounded-xl transition cursor-pointer"
                  >
                    Close Details
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
