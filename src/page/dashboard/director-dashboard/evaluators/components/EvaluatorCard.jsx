import Swal from "sweetalert2";
import { useRemoveEvaluator } from "@/hooks/api/director-hooks/useEvaluator";
import {
  LuTrash2,
  LuMail,
  LuPhone,
  LuMapPin,
  LuUserCheck,
} from "react-icons/lu";

const EvaluatorCard = ({ evaluator, onCardClick, campId }) => {
  const removeMutation = useRemoveEvaluator(campId);
  const isDeleting = removeMutation.isPending;

  // Phone formatter - optimized for Bangladesh + safe fallback
  const formatPhone = (phone) => {
    if (!phone) return "N/A";

    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, "");

    // If we don't have exactly 10 digits → return original digits or N/A
    if (digits.length !== 10) {
      return digits.length === 0 ? "N/A" : digits;
    }

    // Format as (xxx) xxx-xxxx
    const areaCode = digits.slice(0, 3);
    const part1 = digits.slice(3, 6);
    const part2 = digits.slice(6, 10);

    return `(${areaCode}) ${part1}-${part2}`;
  };

  const handleRemove = async (e) => {
    e.stopPropagation();

    const result = await Swal.fire({
      title: "Remove Evaluator?",
      text: `Are you sure you want to remove ${
        evaluator.name || "this evaluator"
      }? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Remove",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    removeMutation.mutate(evaluator.id, {
      onSuccess: () => {
        Swal.fire({
          title: "Removed!",
          text: `${
            evaluator.name || "Evaluator"
          } has been removed successfully.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      },
    });
  };

  return (
    <div
      className="relative bg-white border border-border rounded-[10px] p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 group flex flex-col h-full cursor-pointer"
      onClick={() => !isDeleting && onCardClick?.(evaluator)}
    >
      {/* Remove Icon - Top Right */}
      <button
        onClick={handleRemove}
        disabled={isDeleting}
        className={`cursor-pointer absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 p-2 rounded-lg flex items-center gap-2 ${
          isDeleting
            ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-100"
            : "bg-red-50 hover:bg-red-100 text-red-600"
        }`}
        title="Remove Evaluator"
        aria-label="Remove evaluator"
      >
        <LuTrash2 className="w-4 h-4" />
        {isDeleting && <span className="text-xs">Removing...</span>}
      </button>

      {/* Profile Section */}
      <div className="flex flex-col items-center mb-5">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24">
          <img
            src={evaluator.image || "/default-avatar.png"}
            alt={evaluator.name}
            className="w-full h-full rounded-full object-cover border-4 border-primary/20 shadow-md"
            onError={(e) => (e.target.src = "/default-avatar.png")}
          />
          <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
            <LuUserCheck className="w-3 h-3 text-white" />
          </span>
        </div>

        <div className="text-base sm:text-lg font-bold text-[#333] text-center line-clamp-1 mt-4">
          {evaluator.name || "Unnamed Evaluator"}
        </div>

        <span className="mt-2 inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
          Active Evaluator
        </span>
      </div>

      {/* Info Section */}
      <div className="space-y-2.5 text-sm flex-1">
        <div className="flex items-center gap-2 text-[#666] min-w-0">
          <LuMail className="text-primary shrink-0" />
          <span className="truncate">{evaluator.evaluatorMail || "N/A"}</span>
        </div>

        <div className="flex items-center gap-2 text-[#666]">
          <LuPhone className="text-primary shrink-0" />
          <span className="truncate font-medium tracking-wide">
            {evaluator.isPhoneShow !== false && evaluator.evaluatorNumber
              ? formatPhone(evaluator.evaluatorNumber)
              : "-"}
          </span>
        </div>

        <div className="flex items-start gap-2 text-[#666]">
          <LuMapPin className="text-primary shrink-0 mt-0.5" />
          <span className="line-clamp-2 flex-1">
            {evaluator.isAddressShow !== false && evaluator.evaluatorAddress
              ? evaluator.evaluatorAddress
              : "-"}
          </span>
        </div>
      </div>

      {/* Status Footer */}
      <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-green-500 animate-pulse" />
          <span className="font-medium text-[#666]">Active</span>
        </div>
        {evaluator.approvedAt && (
          <span className="text-[#999]">
            Since{" "}
            {new Date(evaluator.approvedAt).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </span>
        )}
      </div>
    </div>
  );
};

export default EvaluatorCard;
