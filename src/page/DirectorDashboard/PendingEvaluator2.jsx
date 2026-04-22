import { FiCheck, FiX } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const PendingEvaluator2 = ({ pendingEvaluatorData = [] }) => {
  const axiosInstance = useAxiosSecure();
  const queryClient = useQueryClient();

  // Approve Mutation
  const approveMutation = useMutation({
    mutationFn: async (registrationId) => {
      const res = await axiosInstance.post(
        `/director/evaluator-registrations/approve/${registrationId}`
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Evaluator approved successfully!");
      // Refetch the registrations to update both lists
      queryClient.invalidateQueries(["evaluator-registrations"]);
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.message ||
        "Failed to approve evaluator. Please try again.";
      toast.error(msg);
    },
  });

  // Reject Mutation
  const rejectMutation = useMutation({
    mutationFn: async (registrationId) => {
      const res = await axiosInstance.post(
        `/director/evaluator-registrations/reject/${registrationId}`
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Evaluator rejected.");
      queryClient.invalidateQueries(["evaluator-registrations"]);
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.message ||
        "Failed to reject evaluator. Please try again.";
      toast.error(msg);
    },
  });

  const handleApprove = (registrationId) => {
    approveMutation.mutate(registrationId);
  };

  const handleReject = async (registrationId, evaluatorName) => {
    const result = await Swal.fire({
      title: "Reject Evaluator?",
      text: `Are you sure you want to reject ${evaluatorName || "this evaluator"}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Reject",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      rejectMutation.mutate(registrationId);
    }
  };

  const isLoading = approveMutation.isPending || rejectMutation.isPending;

  return (
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl lg:text-3xl text-[#333333] uppercase pb-6 sm:pb-8 font-semibold tracking-wide flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        PENDING EVALUATORS
        <p className="text-lg sm:text-xl text-gray-600 font-medium">
          ({pendingEvaluatorData.length} pending)
        </p>
      </h2>

      {/* Evaluators Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
        {pendingEvaluatorData.map((evaluator) => (
          <div
            key={evaluator.id}
            className="relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-[#179F30]/40 transition-all duration-300 group"
          >
            {/* Pending Badge */}
            <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1.5 rounded-full">
              Pending
            </div>

            {/* Profile Image + Name */}
            <div className="flex flex-col items-center mb-5">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-4">
                <img
                  src={evaluator.image || "/default-avatar.png"}
                  alt={evaluator.name}
                  className="w-full h-full rounded-full object-cover border-4 border-gray-100 shadow-md"
                  onError={(e) => (e.target.src = "/default-avatar.png")}
                />
              </div>

              <h6 className="text-base sm:text-lg font-bold text-gray-800 text-center line-clamp-1">
                {evaluator.name || "Unnamed Evaluator"}
              </h6>
              <p className="text-sm text-gray-500 mt-1">Awaiting Approval</p>
            </div>

            {/* Info List */}
            <div className="space-y-3 text-sm mb-6">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-medium text-gray-500 min-w-12">Email:</span>
                <span className="text-blue-600 truncate">
                  {evaluator.evaluatorMail || "N/A"}
                </span>
              </div>

              {evaluator.evaluatorNumber && (
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-medium text-gray-500 min-w-12">Phone:</span>
                  <span className="truncate">{evaluator.evaluatorNumber}</span>
                </div>
              )}

              {evaluator.evaluatorAddress && (
                <div className="flex items-start gap-2 text-gray-600">
                  <span className="font-medium text-gray-500 min-w-12 mt-0.5">Address:</span>
                  <span className="text-gray-700 line-clamp-2 flex-1">
                    {evaluator.evaluatorAddress}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col xs:flex-row gap-3">
              <button
                onClick={() => handleApprove(evaluator.id)}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 bg-[#179F30] hover:bg-[#128a27] text-white font-medium py-3 px-5 rounded-lg transition-all duration-300 shadow hover:shadow-md group/btn disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {approveMutation.isPending ? (
                  <span className="animate-pulse">Approving...</span>
                ) : (
                  <>
                    <FiCheck className="text-lg group-hover/btn:scale-110 transition-transform" />
                    <span>Approve</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleReject(evaluator.id, evaluator.name)}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-5 rounded-lg transition-all duration-300 shadow hover:shadow-md group/btn disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {rejectMutation.isPending ? (
                  <span className="animate-pulse">Rejecting...</span>
                ) : (
                  <>
                    <FiX className="text-lg group-hover/btn:scale-110 transition-transform" />
                    <span>Deny</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {pendingEvaluatorData.length === 0 && (
        <div className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-10 sm:p-16 text-center bg-gray-50/50">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-3">
            No Pending Evaluators
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            All evaluator applications have been reviewed and processed.
          </p>
        </div>
      )}
    </div>
  );
};

export default PendingEvaluator2;