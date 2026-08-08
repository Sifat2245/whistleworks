import Swal from "sweetalert2";
import { format } from "date-fns";
import { useRemoveEvaluator } from "@/hooks/api/director-hooks/useEvaluator";
import {
  LuTrash2,
  LuMail,
  LuPhone,
  LuMapPin,
  LuUserCheck,
  LuChevronRight,
} from "react-icons/lu";

const formatMonthYear = (dateStr) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d)) return "N/A";
  return format(d, "MMM yyyy");
};

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

const EvaluatorCard = ({ evaluator, onCardClick, campId }) => {
  const removeMutation = useRemoveEvaluator(campId);
  const isDeleting = removeMutation.isPending;

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

  const openDetails = () => {
    if (!isDeleting) onCardClick?.(evaluator);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={openDetails}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !isDeleting) {
          e.preventDefault();
          openDetails();
        }
      }}
      aria-label={`View details for ${evaluator.name || "evaluator"}`}
      className="group relative bg-white border border-border rounded-2xl p-5 shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/40 transition-all duration-300 flex flex-col h-full cursor-pointer focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
    >
      {/* Remove Icon - Top Right (revealed on hover / focus) */}
      <button
        onClick={handleRemove}
        disabled={isDeleting}
        className={`cursor-pointer absolute top-4 right-4 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-10 p-2 rounded-lg flex items-center gap-2 ${
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
        <div className="relative">
          <img
            src={evaluator.image || "/default-avatar.png"}
            alt={evaluator.name}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-green-500/15 shadow-md group-hover:ring-green-500/25 transition"
            onError={(e) => (e.target.src = "/default-avatar.png")}
          />
          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
            <LuUserCheck className="w-3 h-3 text-white" />
          </span>
        </div>

        <div className="text-base sm:text-lg font-bold text-[#333] text-center line-clamp-1 mt-3.5">
          {evaluator.name || "Unnamed Evaluator"}
        </div>

        <span className="mt-2 inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200/80 text-[11px] font-semibold px-2.5 py-1 rounded-full">
          <span className="size-1.5 rounded-full bg-green-500" />
          Active Evaluator
        </span>
      </div>

      {/* Info Section */}
      <div className="space-y-2 text-sm flex-1">
        <div className="flex items-center gap-2.5 text-[#666] min-w-0">
          <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <LuMail className="w-3.5 h-3.5" />
          </span>
          <span className="truncate">{evaluator.evaluatorMail || "N/A"}</span>
        </div>

        <div className="flex items-center gap-2.5 text-[#666]">
          <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <LuPhone className="w-3.5 h-3.5" />
          </span>
          <span className="truncate font-medium tracking-wide">
            {evaluator.isPhoneShow !== false && evaluator.evaluatorNumber
              ? formatPhone(evaluator.evaluatorNumber)
              : "Phone hidden"}
          </span>
        </div>

        <div className="flex items-start gap-2.5 text-[#666]">
          <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <LuMapPin className="w-3.5 h-3.5" />
          </span>
          <span className="line-clamp-2 flex-1">
            {evaluator.isAddressShow !== false && evaluator.evaluatorAddress
              ? evaluator.evaluatorAddress
              : "Address hidden"}
          </span>
        </div>
      </div>

      {/* Status Footer */}
      <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex rounded-full size-2 bg-green-500" />
          </span>
          <span className="font-medium text-[#666]">Active</span>
        </div>
        {evaluator.approvedAt && (
          <span className="text-[#999]">Since {formatMonthYear(evaluator.approvedAt)}</span>
        )}
      </div>

      {/* View details affordance */}
      <span className="mt-3.5 inline-flex items-center justify-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
        View details <LuChevronRight className="w-3.5 h-3.5" />
      </span>
    </div>
  );
};

export default EvaluatorCard;
