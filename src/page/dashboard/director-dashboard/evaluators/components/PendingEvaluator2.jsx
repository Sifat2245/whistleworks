import { useState } from "react";
import Swal from "sweetalert2";
import { formatDistanceToNow } from "date-fns";
import PaginationV2 from "@/components/common/PaginationV2";
import Loader from "@/components/common/Loader";
import EvaluatorListSkeleton from "./EvaluatorListSkeleton";
import EvaluatorSectionHeader from "./EvaluatorSectionHeader";
import EvaluatorStateCard from "./EvaluatorStateCard";
import {
  useApproveEvaluator,
  useRejectEvaluator,
} from "@/hooks/api/director-hooks/useEvaluator";
import {
  LuClock,
  LuCheck,
  LuX,
  LuPhone,
  LuCalendarDays,
} from "react-icons/lu";

const timeAgo = (dateStr) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d)) return "N/A";
  return formatDistanceToNow(d, { addSuffix: true });
};

const PendingEvaluator2 = ({
  pendingEvaluatorData = [],
  pagination,
  onPageChange,
  campId,
  isLoading = false,
  isError = false,
}) => {
  const approveMutation = useApproveEvaluator(campId);
  const rejectMutation = useRejectEvaluator(campId);

  // Track which registration + action is in flight so only that card shows a spinner.
  // Stored as { id, type } and reset functionally so rapid clicks on another card
  // never leave stale loading state behind.
  const [actingOn, setActingOn] = useState(null);

  const handleApprove = (registrationId) => {
    setActingOn({ id: registrationId, type: "approve" });
    approveMutation.mutate(registrationId, {
      onSettled: () =>
        setActingOn((current) =>
          current?.id === registrationId ? null : current,
        ),
    });
  };

  const handleReject = async (registrationId, evaluatorName) => {
    const result = await Swal.fire({
      title: "Reject Evaluator?",
      text: `Are you sure you want to reject ${
        evaluatorName || "this evaluator"
      }?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Reject",
    });

    if (!result.isConfirmed) return;

    setActingOn({ id: registrationId, type: "reject" });
    rejectMutation.mutate(registrationId, {
      onSettled: () =>
        setActingOn((current) =>
          current?.id === registrationId ? null : current,
        ),
    });
  };

  return (
    <section className="w-full">
      <EvaluatorSectionHeader
        icon={LuClock}
        title="Pending Evaluators"
        subtitle="Applications waiting for your review"
        count={pagination.total}
        countLabel="pending"
        tone="amber"
      />

      {isError ? (
        <EvaluatorStateCard
          type="error"
          title="Failed to Load Pending Evaluators"
          description="We couldn't load pending applications. Please try again."
        />
      ) : isLoading ? (
        <EvaluatorListSkeleton count={8} />
      ) : pendingEvaluatorData.length === 0 ? (
        <EvaluatorStateCard
          icon={LuClock}
          title="No Pending Evaluators"
          description="All applications have been processed. New applications will appear here as they come in."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
          {pendingEvaluatorData.map((evaluator) => {
            const isBusy = actingOn?.id === evaluator.id;
            const showApproveLoader = isBusy && actingOn?.type === "approve";
            const showRejectLoader = isBusy && actingOn?.type === "reject";

            return (
              <div
                key={evaluator.id}
                className="group relative bg-white border border-border rounded-2xl p-5 shadow-sm hover:shadow-xl hover:shadow-amber-100/70 hover:-translate-y-1 hover:border-amber-300/70 transition-all duration-300 flex flex-col"
              >
                {/* Status pill */}
                <div className="flex justify-end mb-4">
                  <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200/80 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    <span className="relative flex size-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-70 motion-reduce:animate-none" />
                      <span className="relative inline-flex rounded-full size-1.5 bg-amber-500" />
                    </span>
                    Awaiting review
                  </span>
                </div>

                {/* Profile */}
                <div className="flex flex-col items-center mb-5">
                  <div className="relative">
                    <img
                      src={evaluator.image || "/default-avatar.png"}
                      alt={evaluator.name}
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-amber-100 shadow-md group-hover:ring-amber-200 transition"
                      onError={(e) => (e.target.src = "/default-avatar.png")}
                    />
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center">
                      <LuClock className="w-3 h-3 text-amber-600" />
                    </span>
                  </div>
                  <h6 className="text-base font-bold text-[#333] text-center line-clamp-1 mt-3.5">
                    {evaluator.name}
                  </h6>
                  <p className="text-xs text-[#999] mt-1 truncate max-w-full">
                    {evaluator.evaluatorMail || "No email provided"}
                  </p>
                </div>

                {/* Contact details */}
                <div className="space-y-2 text-sm flex-1">
                  <div className="flex items-center gap-2.5 text-[#666] min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-amber-50/80 text-amber-600 flex items-center justify-center shrink-0">
                      <LuPhone className="w-3.5 h-3.5" />
                    </span>
                    <span className="truncate">
                      {evaluator.isPhoneShow !== false &&
                      evaluator.evaluatorNumber
                        ? evaluator.evaluatorNumber
                        : "Phone hidden"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[#666]">
                    <span className="w-7 h-7 rounded-lg bg-amber-50/80 text-amber-600 flex items-center justify-center shrink-0">
                      <LuCalendarDays className="w-3.5 h-3.5" />
                    </span>
                    <span className="truncate">
                      Applied {timeAgo(evaluator.registeredAt)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-5 pt-4 border-t border-border">
                  <button
                    onClick={() => handleApprove(evaluator.id)}
                    disabled={isBusy}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                  >
                    {showApproveLoader ? (
                      <Loader size={16} color="#ffffff" />
                    ) : (
                      <>
                        <LuCheck className="w-4 h-4" /> Approve
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleReject(evaluator.id, evaluator.name)}
                    disabled={isBusy}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 active:scale-[0.98] py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                  >
                    {showRejectLoader ? (
                      <Loader size={16} color="#dc2626" />
                    ) : (
                      <>
                        <LuX className="w-4 h-4" /> Deny
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pagination.total > 0 && (
        <PaginationV2
          handlePageClick={onPageChange}
          perPage={pagination.per_page}
          totalItem={pagination.total}
          currentPage={pagination.current_page}
        />
      )}
    </section>
  );
};

export default PendingEvaluator2;
