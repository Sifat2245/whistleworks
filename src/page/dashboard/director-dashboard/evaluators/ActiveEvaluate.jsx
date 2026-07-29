import ActiveEvalutorList2 from "./components/ActiveEvalutorList2";
import BackBtn from "@/components/common/BackBtn";
import { useParams, useSearchParams } from "react-router-dom";
import { Spin } from "antd";
import PendingEvaluator2 from "./components/PendingEvaluator2";
import {
  usePendingEvaluators,
  useApprovedEvaluators,
} from "@/hooks/api/director-hooks/useEvaluator";

const ActiveEvaluate = ({ searchQuery = "" }) => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;

  // ── Pending evaluators (with caching & pagination) ────
  const {
    pendingEvaluators,
    pagination: pendingPagination,
    isLoading: pendingLoading,
    isError: pendingError,
  } = usePendingEvaluators(id, currentPage);

  // ── Approved evaluators (with caching, pagination & search) ─
  const {
    approvedEvaluators,
    pagination: approvedPagination,
    isLoading: approvedLoading,
    isError: approvedError,
  } = useApprovedEvaluators(id, currentPage, searchQuery);

  const isLoading = pendingLoading || approvedLoading;
  const isError = pendingError || approvedError;

  const handlePageChange = (page) => {
    setSearchParams({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        campId={id}
      />

      <ActiveEvalutorList2
        activeEvaluatorData={approvedEvaluators}
        pagination={approvedPagination}
        onPageChange={handlePageChange}
        campId={id}
      />
    </div>
  );
};

export default ActiveEvaluate;
