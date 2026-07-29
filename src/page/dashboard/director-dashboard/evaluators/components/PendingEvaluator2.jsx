import { FiCheck, FiX } from "react-icons/fi";
import Swal from "sweetalert2";
import PaginationV2 from "@/components/common/PaginationV2";
import {
  useApproveEvaluator,
  useRejectEvaluator,
} from "@/hooks/api/director-hooks/useEvaluator";

const PendingEvaluator2 = ({
  pendingEvaluatorData = [],
  pagination,
  onPageChange,
  campId,
}) => {
  const approveMutation = useApproveEvaluator(campId);
  const rejectMutation = useRejectEvaluator(campId);

  const handleApprove = (registrationId) =>
    approveMutation.mutate(registrationId);

  const handleReject = async (registrationId, evaluatorName) => {
    const result = await Swal.fire({
      title: "Reject Evaluator?",
      text: `Are you sure you want to reject ${evaluatorName || "this evaluator"}?`,
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

  const isLoading = approveMutation.isPending || rejectMutation.isPending;

  return (
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl lg:text-3xl text-[#333333] uppercase pb-6 sm:pb-8 font-semibold tracking-wide flex items-center gap-3">
        PENDING EVALUATORS
        <span className="text-lg sm:text-xl text-gray-600 font-medium">
          ({pagination.total} pending)
        </span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
        {pendingEvaluatorData.map((evaluator) => (
          <div
            key={evaluator.id}
            className="relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-[#179F30]/40 transition-all duration-300"
          >
            <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1.5 rounded-full">
              Pending
            </div>

            <div className="flex flex-col items-center mb-5">
              <div className="relative w-24 h-24 mb-4">
                <img
                  src={evaluator.image || "/default-avatar.png"}
                  alt={evaluator.name}
                  className="w-full h-full rounded-full object-cover border-4 border-gray-100"
                  onError={(e) => (e.target.src = "/default-avatar.png")}
                />
              </div>
              <h6 className="text-lg font-bold text-gray-800 text-center">
                {evaluator.name}
              </h6>
            </div>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-medium text-gray-500 min-w-12">
                  Email:
                </span>
                <span className="text-blue-600 truncate">
                  {evaluator.evaluatorMail}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-medium text-gray-500 min-w-12">
                  Phone:
                </span>
                <span>
                  {evaluator.isPhoneShow !== false && evaluator.evaluatorNumber ? evaluator.evaluatorNumber : "-"}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleApprove(evaluator.id)}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 bg-[#179F30] hover:bg-[#128a27] text-white py-3 rounded-lg transition"
              >
                <FiCheck /> Approve
              </button>
              <button
                onClick={() => handleReject(evaluator.id, evaluator.name)}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg transition"
              >
                <FiX /> Deny
              </button>
            </div>
          </div>
        ))}
      </div>

      {pendingEvaluatorData.length === 0 && (
        <div className="h-[400px] flex items-center justify-center text-center">
          <div>
            <h3 className="text-xl font-semibold text-gray-700">
              No Pending Evaluators
            </h3>
            <p className="text-gray-500 mt-2">
              All applications have been processed.
            </p>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.total > 0 && (
        <PaginationV2
          handlePageClick={onPageChange}
          perPage={pagination.per_page}
          totalItem={pagination.total}
          currentPage={pagination.current_page}
        />
      )}
    </div>
  );
};

export default PendingEvaluator2;
