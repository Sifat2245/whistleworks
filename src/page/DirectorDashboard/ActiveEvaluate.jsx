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

  const {
    data: responseData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["evaluator-registrations", id, currentPage],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/director/evaluator-registrations/camp/${id}?page=${currentPage}`,
      );
      return response?.data?.data || {}; // Return full data object
    },
    enabled: !!id,
  });

  const registrations = responseData?.registrations || [];
  const pagination = responseData?.pagination || {
    total: 0,
    per_page: 12,
    current_page: 1,
    last_page: 1,
  };

  // Separate approved and pending (only from current page)
  const approvedEvaluators = registrations
    .filter((reg) => reg.status === "approved")
    .map((reg) => ({
      id: reg.id,
      image: reg.evaluator.avatar,
      name: reg.evaluator.name?.trim() || "Unnamed Evaluator",
      evaluatorMail: reg.evaluator.email,
      evaluatorAddress: reg.evaluator.address,
      evaluatorNumber: reg.evaluator.phone,
      registeredAt: reg.registered_at,
      approvedAt: reg.approved_at,
    }));

  const pendingEvaluators = registrations
    .filter((reg) => reg.status === "pending")
    .map((reg) => ({
      id: reg.id,
      image: reg.evaluator.avatar,
      name: reg.evaluator.name?.trim() || "Unnamed Evaluator",
      evaluatorMail: reg.evaluator.email,
      evaluatorAddress: "",
      evaluatorNumber: "",
      registeredAt: reg.registered_at,
    }));

  const handlePageChange = (page) => {
    setSearchParams({ page });
  };

  const handleRemoveEvaluator = async (registrationId) => {
    try {

      refetch();
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
