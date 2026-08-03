import Swal from "sweetalert2";
import PaginationV2 from "@/components/common/PaginationV2";
import EvaluatorListSkeleton from "./EvaluatorListSkeleton";
import {
  useApproveEvaluator,
  useRejectEvaluator,
} from "@/hooks/api/director-hooks/useEvaluator";
import {
  LuClock,
  LuCheck,
  LuX,
  LuInbox,
  LuTriangleAlert,
  LuRefreshCw,
  LuMail,
  LuPhone,
  LuCalendarDays,
} from "react-icons/lu";

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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

  const handleApprove = (registrationId) =>
    approveMutation.mutate(registrationId);

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

    if (result.isConfirmed) {
      rejectMutation.mutate(registrationId);
    }
  };

  const busy = approveMutation.isPending || rejectMutation.isPending;

  if (isError) {
    return (
      <section className="w-full">
        <PendingHeader count={pagination.total} />
        <div className="mx-auto max-w-md bg-red-50 border border-red-200 rounded-[10px] p-8 text-center">
          <LuTriangleAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-3">
            Failed to Load Pending Evaluators
          </h3>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
          >
            <LuRefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <PendingHeader count={pagination.total} />

      {isLoading ? (
        <EvaluatorListSkeleton count={8} />
      ) : pendingEvaluatorData.length === 0 ? (
        <div className="rounded-[10px] border border-border bg-white py-16 text-center">
          <LuInbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-[#333]">
            No Pending Evaluators
          </h3>
          <p className="text-sm text-[#666] mt-1">
            All applications have been processed.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
          {pendingEvaluatorData.map((evaluator) => (
            <div
              key={evaluator.id}
              className="relative bg-white border border-border rounded-[10px] p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 flex flex-col"
            >
              <span className="absolute top-4 right-4 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                Pending
              </span>

              <div className="flex flex-col items-center mb-5">
                <img
                  src={evaluator.image || "/default-avatar.png"}
                  alt={evaluator.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-primary/20 shadow-md"
                  onError={(e) => (e.target.src = "/default-avatar.png")}
                />
                <h6 className="text-lg font-bold text-[#333] text-center line-clamp-1 mt-4">
                  {evaluator.name}
                </h6>
              </div>

              <div className="space-y-2.5 text-sm flex-1">
                <div className="flex items-center gap-2 text-[#666] min-w-0">
                  <LuMail className="text-primary shrink-0" />
                  <span className="truncate">
                    {evaluator.evaluatorMail || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#666]">
                  <LuPhone className="text-primary shrink-0" />
                  <span>
                    {evaluator.isPhoneShow !== false &&
                    evaluator.evaluatorNumber
                      ? evaluator.evaluatorNumber
                      : "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#666]">
                  <LuCalendarDays className="text-primary shrink-0" />
                  <span>Applied {formatDate(evaluator.registeredAt)}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-5 pt-4 border-t border-border">
                <button
                  onClick={() => handleApprove(evaluator.id)}
                  disabled={busy}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  <LuCheck /> Approve
                </button>
                <button
                  onClick={() => handleReject(evaluator.id, evaluator.name)}
                  disabled={busy}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  <LuX /> Deny
                </button>
              </div>
            </div>
          ))}
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

const PendingHeader = ({ count }) => {
  return (
    <div className="flex items-center gap-3.5 mb-6">
      <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">
        <LuClock />
      </span>
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold text-[#333]">
          Pending Evaluators
        </h2>
        <p className="text-sm text-[#666]">
          Applications waiting for your review
        </p>
      </div>
      <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-3 py-1.5 rounded-full shrink-0">
        {count} pending
      </span>
    </div>
  );
};

export default PendingEvaluator2;
