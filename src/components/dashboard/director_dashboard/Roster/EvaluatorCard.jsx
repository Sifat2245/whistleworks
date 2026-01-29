import { useState } from "react";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { MdDeleteOutline } from "react-icons/md";
import Swal from "sweetalert2";

const EvaluatorCard = ({ evaluator, onCardClick, onRemove }) => {
  const axiosInstance = useAxiosSecure();
  const [isDeleting, setIsDeleting] = useState(false);

  // Phone formatter - optimized for Bangladesh + safe fallback
  const formatPhone = (phone) => {
    if (!phone) return "N/A";

    let digits = phone.replace(/\D/g, "");

    if (digits.startsWith("880")) {
      digits = "0" + digits.slice(3);
    } else if (digits.startsWith("88")) {
      digits = "0" + digits.slice(2);
    }

    if (digits.length === 11 && digits.startsWith("0")) {
      return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
    }

    if (digits.length === 10) {
      return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`;
    }

    let formatted = "";
    let i = digits.length;
    while (i > 0) {
      const chunk = Math.min(4, i);
      formatted =
        digits.slice(i - chunk, i) + (formatted ? " " + formatted : "");
      i -= chunk;
    }

    return formatted.trim() || "N/A";
  };

  const handleRemove = async (e) => {
    e.stopPropagation();

    const result = await Swal.fire({
      title: "Remove Evaluator?",
      text: `Are you sure you want to remove ${evaluator.name || "this evaluator"}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Remove",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    setIsDeleting(true);

    try {
      await axiosInstance.delete(
        `/director/evaluator-registrations/remove/${evaluator.id}`,
      );

      Swal.fire({
        title: "Removed!",
        text: `${evaluator.name || "Evaluator"} has been removed successfully.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      onRemove?.(evaluator.id);
    } catch (error) {
      console.error("Delete evaluator error:", error);

      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          "Failed to remove evaluator. Please try again.",
        icon: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-[#00AEEF]/50 transition-all duration-300 group flex flex-col h-full cursor-pointer"
      onClick={() => !isDeleting && onCardClick?.(evaluator)}
    >
      {/* Remove Icon - Top Right */}
      <button
        onClick={handleRemove}
        disabled={isDeleting}
        className={`cursor-pointer absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 p-2 rounded-lg flex items-center gap-2 ${
          isDeleting
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-red-50 hover:bg-red-100 text-red-600"
        }`}
        title="Remove Evaluator"
        aria-label="Remove evaluator"
      >
        <MdDeleteOutline className="w-5 h-5" />
        {isDeleting && <span className="text-xs">Removing...</span>}
      </button>

      {/* Profile Section */}
      <div className="flex flex-col items-center mb-5">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-4">
          <img
            src={evaluator.image || "/default-avatar.png"}
            alt={evaluator.name}
            className="w-full h-full rounded-full object-cover border-4 border-[#00AEEF]/20 shadow-md"
            onError={(e) => (e.target.src = "/default-avatar.png")}
          />
        </div>

        <div className="text-base sm:text-lg font-bold text-[#333] text-center line-clamp-1">
          {evaluator.name || "Unnamed Evaluator"}
        </div>

        <span className="mt-2 inline-block bg-[#00AEEF]/10 text-[#00AEEF] text-xs font-semibold px-3 py-1.5 rounded-full">
          Active Evaluator
        </span>
      </div>

      {/* Info Section */}
      <div className="space-y-3 text-sm flex-1">
        <div className="flex items-center gap-2 text-gray-600">
          <span className="font-medium text-gray-500 min-w-12">Email:</span>
          <span className="text-[#00AEEF] truncate">
            {evaluator.evaluatorMail || "N/A"}
          </span>
        </div>

        {evaluator.evaluatorNumber && (
          <div className="flex items-center gap-2 text-gray-600">
            <span className="font-medium text-gray-500 min-w-12">Phone:</span>
            <span className="truncate font-medium tracking-wide">
              {formatPhone(evaluator.evaluatorNumber)}
            </span>
          </div>
        )}

        {evaluator.evaluatorAddress && (
          <div className="flex items-start gap-2 text-gray-600">
            <span className="font-medium text-gray-500 min-w-12 mt-0.5">
              Address:
            </span>
            <span className="text-gray-700 line-clamp-2 flex-1">
              {evaluator.evaluatorAddress}
            </span>
          </div>
        )}
      </div>

      {/* Status Footer */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="font-medium text-gray-700">Active</span>
          </div>
          {evaluator.approvedAt && (
            <span className="text-gray-500">
              Since{" "}
              {new Date(evaluator.approvedAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluatorCard;
