import ActiveEvalutorList2 from "./ActiveEvalutorList2";
import BackBtn from "@/components/common/BackBtn";
import PendingEvaluator2 from "./PendingEvaluator2";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { Spin } from "antd";

const ActiveEvaluate = ({ searchQuery = "" }) => {
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
        `/roster/evaluator-registrations/camp/${id}/pending`,
        { params: { page: currentPage } }
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
        `/roster/evaluator-registrations/camp/${id}/approved`,
        { params: { page: currentPage } }
      );
      return res?.data?.data || { registrations: [], pagination: {} };
    },
  });

  const isLoading = pendingLoading || approvedLoading;
  const isError = pendingError || approvedError;

  // Transform approved evaluators
  const approvedEvaluators = useMemo(() => {
    const raw = (approvedData?.registrations || []).map((reg) => ({
      id: reg.id,
      image: reg.evaluator?.avatar,
      name: reg.evaluator?.name?.trim() || "Unnamed Evaluator",
      evaluatorMail: reg.evaluator?.email,
      evaluatorAddress: reg.evaluator?.address,
      evaluatorNumber: reg.evaluator?.phone,
      registeredAt: reg.registered_at,
      approvedAt: reg.approved_at,
    }));

    // Client-side search filter
    const query = searchQuery.trim().toLowerCase();
    if (!query) return raw;

    return raw.filter((ev) => {
      return (
        ev.name?.toLowerCase().includes(query) ||
        ev.evaluatorMail?.toLowerCase().includes(query) ||
        ev.id.toString().includes(query)
      );
    });
  }, [approvedData, searchQuery]);

  // Transform pending evaluators (no search for pending)
  const pendingEvaluators = (pendingData?.registrations || []).map((reg) => ({
    id: reg.id,
    image: reg.evaluator?.avatar,
    name: reg.evaluator?.name?.trim() || "Unnamed Evaluator",
    evaluatorMail: reg.evaluator?.email,
    evaluatorAddress: "",
    evaluatorNumber: reg.evaluator?.phone || "",
    registeredAt: reg.registered_at,
  }));

  const approvedPagination = approvedData?.pagination || {
    total: 0,
    per_page: 12,
    current_page: 1,
    last_page: 1,
  };

  const pendingPagination = pendingData?.pagination || {
    total: 0,
    per_page: 12,
    current_page: 1,
    last_page: 1,
  };

  const handlePageChange = (page) => {
    setSearchParams({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemoveEvaluator = async (registrationId) => {
    try {
      await axiosInstance.delete(`/roster/evaluator-registrations/${registrationId}`);
      refetchApproved();
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

      <PendingEvaluator2 
        pendingEvaluatorData={pendingEvaluators}
        pagination={pendingPagination}
        onPageChange={handlePageChange}
      />

      <ActiveEvalutorList2
        activeEvaluatorData={approvedEvaluators}
        pagination={approvedPagination}
        onPageChange={handlePageChange}
        onRemoveEvaluator={handleRemoveEvaluator}
      />
    </div>
  );
};

export default ActiveEvaluate;
