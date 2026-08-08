import ActiveEvalutorList2 from "./components/ActiveEvalutorList2";
import PendingEvaluator2 from "./components/PendingEvaluator2";
import RejectedEvaluators from "./components/RejectedEvaluators";
import { LuDownload } from "react-icons/lu";
import { useParams, useSearchParams } from "react-router-dom";
import { useExportEvaluators } from "@/hooks/api/director-hooks/useExport";
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

  // ── Export CSV ────────────────────────────────────────
  const { mutate: exportEvaluators, isPending: isExporting } =
    useExportEvaluators(id);

  const handlePageChange = (page, section) => {
    const params = new URLSearchParams(searchParams);
    params.set(`${section}Page`, String(page));
    setSearchParams(params);
  };

  return (
    <div className="w-full flex flex-col items-start gap-12 mb-16">
      {/* Export CSV */}
      <div className="w-full flex justify-end">
        <button
          onClick={() => exportEvaluators()}
          disabled={isExporting}
          className="inline-flex shrink-0 items-center gap-2 px-5 py-3 rounded-[10px] border border-border bg-white text-[#333] font-semibold text-sm whitespace-nowrap transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LuDownload className="text-base" />
          {isExporting ? "Exporting..." : "Export CSV"}
        </button>
      </div>

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
