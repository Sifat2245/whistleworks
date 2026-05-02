import { FiCheck, FiX } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Spin } from "antd";

const PendingEvaluator2 = ({
  pendingEvaluatorData = [],
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
}) => {
  const axiosInstance = useAxiosSecure();
  const queryClient = useQueryClient();

  const { ref, inView } = useInView({
    threshold: 0.5,
    rootMargin: "100px",
  });

  // Trigger load more when scrolled to bottom
  useEffect(() => {
    if (inView && hasMore && !isLoadingMore && onLoadMore) {
      onLoadMore();
    }
  }, [inView, hasMore, isLoadingMore, onLoadMore]);

  // Approve Mutation
  const approveMutation = useMutation({
    mutationFn: async (registrationId) => {
      const res = await axiosInstance.post(
        `/director/evaluator-registrations/approve/${registrationId}`
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Evaluator approved successfully!");
      queryClient.invalidateQueries(["pending-evaluators"]);
      queryClient.invalidateQueries(["approved-evaluators"]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to approve evaluator.");
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
    onSuccess: () => {
      toast.success("Evaluator rejected.");
      queryClient.invalidateQueries(["pending-evaluators"]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to reject evaluator.");
    },
  });

  const handleApprove = (registrationId) => approveMutation.mutate(registrationId);

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
          ({pendingEvaluatorData.length} pending)
        </span>
      </h2>

      {/* Scrollable Container with Fixed Height */}
      <div className="h-[550px] overflow-y-auto pr-2 custom-scrollbar">
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
                  <span className="font-medium text-gray-500 min-w-12">Email:</span>
                  <span className="text-blue-600 truncate">{evaluator.evaluatorMail}</span>
                </div>
                {evaluator.evaluatorNumber && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="font-medium text-gray-500 min-w-12">Phone:</span>
                    <span>{evaluator.evaluatorNumber}</span>
                  </div>
                )}
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

        {/* Loading Trigger */}
        {hasMore && (
          <div ref={ref} className="py-8 flex justify-center">
            {isLoadingMore && <Spin size="large" />}
          </div>
        )}

        {pendingEvaluatorData.length === 0 && (
          // Empty state (same as before)
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-700">No Pending Evaluators</h3>
              <p className="text-gray-500 mt-2">All applications have been processed.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingEvaluator2;