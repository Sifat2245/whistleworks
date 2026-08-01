import PaginationV2 from "@/components/common/PaginationV2";
import EvaluatorListSkeleton from "./EvaluatorListSkeleton";
import {
  LuBan,
  LuInbox,
  LuMail,
  LuPhone,
  LuTriangleAlert,
  LuRefreshCw,
  LuCalendarX,
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

const RejectedEvaluators = ({
  rejectedEvaluatorData = [],
  pagination,
  onPageChange,
  isLoading = false,
  isError = false,
}) => {
  if (isError) {
    return (
      <section className="w-full">
        <RejectedHeader count={pagination.total} />
        <div className="mx-auto max-w-md bg-red-50 border border-red-200 rounded-[10px] p-8 text-center">
          <LuTriangleAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-3">
            Failed to Load Rejected Evaluators
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
      <RejectedHeader count={pagination.total} />

      {isLoading ? (
        <EvaluatorListSkeleton count={4} />
      ) : rejectedEvaluatorData.length === 0 ? (
        <div className="rounded-[10px] border border-border bg-white py-16 text-center">
          <LuInbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-[#333]">
            No Rejected Evaluators
          </h3>
          <p className="text-sm text-[#666] mt-1">
            Rejected applications will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rejectedEvaluatorData.map((evaluator) => (
            <div
              key={evaluator.id}
              className="bg-white border border-border rounded-[10px] p-4 flex flex-col lg:flex-row lg:items-center gap-4"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <img
                  src={evaluator.image || "/default-avatar.png"}
                  alt={evaluator.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-red-200 shrink-0 grayscale"
                  onError={(e) => (e.target.src = "/default-avatar.png")}
                />
                <div className="min-w-0">
                  <p className="font-semibold text-[#333] truncate">
                    {evaluator.name}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-[#666] mt-0.5 min-w-0">
                    <LuMail className="text-[#999] shrink-0" />
                    <span className="truncate">
                      {evaluator.evaluatorMail || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6 text-xs text-[#666] shrink-0 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <LuPhone className="text-[#999]" />
                  <span>
                    {evaluator.isPhoneShow !== false &&
                    evaluator.evaluatorNumber
                      ? evaluator.evaluatorNumber
                      : "-"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <LuCalendarX className="text-[#999]" />
                  <span>{formatDate(evaluator.rejectedAt)}</span>
                </div>
                <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-full font-semibold">
                  <LuBan className="w-3.5 h-3.5" /> Rejected
                </span>
              </div>

              {evaluator.rejectionReason && (
                <p
                  className="text-xs text-[#666] lg:w-64 lg:text-right shrink-0 line-clamp-2"
                  title={evaluator.rejectionReason}
                >
                  Reason: {evaluator.rejectionReason}
                </p>
              )}
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

const RejectedHeader = ({ count }) => {
  return (
    <div className="flex items-center gap-3.5 mb-6">
      <span className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center text-xl shrink-0">
        <LuBan />
      </span>
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold text-[#333]">
          Rejected Evaluators
        </h2>
        <p className="text-sm text-[#666]">
          Applications that were declined for this camp
        </p>
      </div>
      <span className="bg-red-50 text-red-500 text-xs font-semibold px-3 py-1.5 rounded-full shrink-0">
        {count} rejected
      </span>
    </div>
  );
};

export default RejectedEvaluators;
