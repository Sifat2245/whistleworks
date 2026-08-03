import ActiveEvalutorList2 from "./components/ActiveEvalutorList2";
import PendingEvaluator2 from "./components/PendingEvaluator2";
import RejectedEvaluators from "./components/RejectedEvaluators";
import { useParams, useSearchParams } from "react-router-dom";
import {
  usePendingEvaluators,
  useApprovedEvaluators,
  useRejectedEvaluators,
} from "@/hooks/api/director-hooks/useEvaluator";

const ActiveEvaluate = ({ searchQuery = "" }) => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // Each section keeps its own page so paginating one never affects the others
  const pendingPage = parseInt(searchParams.get("pendingPage")) || 1;
  const activePage = parseInt(searchParams.get("activePage")) || 1;
  const rejectedPage = parseInt(searchParams.get("rejectedPage")) || 1;

  // ── Pending evaluators ───────────────────────────────
  const {
    pendingEvaluators,
    pagination: pendingPagination,
    isLoading: pendingLoading,
    isError: pendingError,
  } = usePendingEvaluators(id, pendingPage);

  // ── Approved evaluators (client-searchable) ──────────
  const {
    approvedEvaluators,
    pagination: approvedPagination,
    isLoading: approvedLoading,
    isError: approvedError,
  } = useApprovedEvaluators(id, activePage, searchQuery);

  // ── Rejected evaluators ──────────────────────────────
  const {
    rejectedEvaluators,
    pagination: rejectedPagination,
    isLoading: rejectedLoading,
    isError: rejectedError,
  } = useRejectedEvaluators(id, rejectedPage);

  const handlePageChange = (page, section) => {
    const params = new URLSearchParams(searchParams);
    params.set(`${section}Page`, String(page));
    setSearchParams(params);
  };

  return (
    <div className="w-full flex flex-col items-start gap-12 mb-16">
      <PendingEvaluator2
        pendingEvaluatorData={pendingEvaluators}
        pagination={pendingPagination}
        onPageChange={(page) => handlePageChange(page, "pending")}
        campId={id}
        isLoading={pendingLoading}
        isError={pendingError}
      />

      <ActiveEvalutorList2
        activeEvaluatorData={approvedEvaluators}
        pagination={approvedPagination}
        onPageChange={(page) => handlePageChange(page, "active")}
        campId={id}
        isLoading={approvedLoading}
        isError={approvedError}
      />

      <RejectedEvaluators
        rejectedEvaluatorData={rejectedEvaluators}
        pagination={rejectedPagination}
        onPageChange={(page) => handlePageChange(page, "rejected")}
        isLoading={rejectedLoading}
        isError={rejectedError}
      />
    </div>
  );
};

export default ActiveEvaluate;
