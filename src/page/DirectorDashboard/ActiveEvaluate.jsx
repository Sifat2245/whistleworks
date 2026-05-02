import ActiveEvalutorList2 from "./ActiveEvalutorList2";
import BackBtn from "@/components/common/BackBtn";
import PendingEvaluator2 from "./PendingEvaluator2";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { Spin } from "antd";

const ActiveEvaluate = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const axiosInstance = useAxiosSecure();

  // Pending Evaluators
  const { 
    data: pendingData, 
    isLoading: pendingLoading, 
    isError: pendingError 
  } = useQuery({
    queryKey: ["pending-evaluators", id, currentPage],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/roster/evaluator-registrations/camp/${id}/pending`
      );
      return res?.data?.data || { registrations: [], pagination: {} };
    },
  });

  // Approved Evaluators
  const { 
    data: approvedData, 
    isLoading: approvedLoading, 
    isError: approvedError,
    refetch: refetchApproved 
  } = useQuery({
    queryKey: ["approved-evaluators", id, currentPage],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/roster/evaluator-registrations/camp/${id}/approved`
      );
      return res?.data?.data || { registrations: [], pagination: {} };
    },
  });

  const isLoading = pendingLoading || approvedLoading;
  const isError = pendingError || approvedError;

  // Transform approved evaluators
  const approvedEvaluators = (approvedData?.registrations || []).map((reg) => ({
    id: reg.id,
    image: reg.evaluator?.avatar,
    name: reg.evaluator?.name?.trim() || "Unnamed Evaluator",
    evaluatorMail: reg.evaluator?.email,
    evaluatorAddress: reg.evaluator?.address,
    evaluatorNumber: reg.evaluator?.phone,
    registeredAt: reg.registered_at,
    approvedAt: reg.approved_at,
  }));

  // Transform pending evaluators
  const pendingEvaluators = (pendingData?.registrations || []).map((reg) => ({
    id: reg.id,
    image: reg.evaluator?.avatar,
    name: reg.evaluator?.name?.trim() || "Unnamed Evaluator",
    evaluatorMail: reg.evaluator?.email,
    evaluatorAddress: "",
    evaluatorNumber: "",
    registeredAt: reg.registered_at,
  }));

  const pagination = approvedData?.pagination || {
    total: 0,
    per_page: 12,
    current_page: 1,
    last_page: 1,
  };

  const handlePageChange = (page) => {
    setSearchParams({ page });
  };

  const handleRemoveEvaluator = async (registrationId) => {
    try {
      // Add your remove logic here (API call)
      await axiosInstance.delete(`/roster/evaluator-registrations/${registrationId}`);
      refetchApproved(); // Refresh approved list after removal
    } catch (error) {
      console.error("Failed to remove evaluator:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full text-center py-12 text-red-500">
        Failed to load evaluators. Please try again later.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-start gap-10 mb-16">
      <BackBtn />

      <PendingEvaluator2 pendingEvaluatorData={pendingEvaluators} />

      <ActiveEvalutorList2
        activeEvaluatorData={approvedEvaluators}
        pagination={pagination}
        onPageChange={handlePageChange}
        onRemoveEvaluator={handleRemoveEvaluator}
      />
    </div>
  );
};

export default ActiveEvaluate;