import { Modal } from "antd";
import { LuClipboardCheck, LuTriangleAlert } from "react-icons/lu";
import { useMyEvaluationDetails } from "@/hooks/api/referee-hooks/useRefereePerformance";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import Loader from "@/components/common/Loader";
import EvaluationDetailsContent from "@/page/dashboard/RefereeDashboard/performancePage/components/EvaluationDetailsContent";

export default function RefereeEvaluationDetailsModal({
  isOpen,
  onClose,
  evaluationId,
}) {
  const { data, isLoading, isError, error, isFetching, refetch } =
    useMyEvaluationDetails(evaluationId, { enabled: isOpen });

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      centered
      width={880}
      style={{ maxWidth: "calc(100vw - 24px)" }}
      styles={{
        body: {
          maxHeight: "min(72dvh, calc(100dvh - 200px))",
          overflowY: "auto",
          paddingRight: 4,
        },
      }}
      destroyOnHidden
      title={
        <div className="flex items-center gap-3 pb-2 pr-6">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xl text-sky-700">
            <LuClipboardCheck aria-hidden="true" />
          </span>
          <div>
            <span className="block text-lg font-semibold text-slate-900">
              Evaluation details
            </span>
            {evaluationId != null && (
              <span className="block text-xs font-normal text-slate-500">
                Evaluation #{evaluationId}
              </span>
            )}
          </div>
        </div>
      }
      footer={
        <CommonSubmitBtn
          type="button"
          variant="secondary"
          onClick={onClose}
          className="min-h-11 px-5 text-sm text-sky-700 hover:bg-primary/10 hover:text-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800"
        >
          Done
        </CommonSubmitBtn>
      }
    >
      {isLoading ? (
        <div
          role="status"
          className="flex min-h-72 items-center justify-center gap-3 text-sm text-slate-600"
        >
          <Loader color="#00AEEF" size={28} />
          Loading evaluation details…
        </div>
      ) : isError ? (
        <div
          role="alert"
          className="my-3 rounded-xl border border-slate-200 bg-slate-50 px-5 py-12 text-center"
        >
          <LuTriangleAlert
            aria-hidden="true"
            className="mx-auto mb-3 size-7 text-slate-500"
          />
          <h3 className="text-base font-semibold text-slate-900">
            Unable to load evaluation
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
            {error?.response?.data?.message ||
              error?.message ||
              "Please try again."}
          </p>
          <CommonSubmitBtn
            type="button"
            variant="secondary"
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-5 min-h-11 text-sm text-sky-700 hover:bg-primary/10 hover:text-sky-800"
          >
            {isFetching ? "Retrying…" : "Try again"}
          </CommonSubmitBtn>
        </div>
      ) : data ? (
        <EvaluationDetailsContent evaluation={data} />
      ) : (
        <p role="status" className="py-12 text-center text-sm text-slate-500">
          No evaluation details available.
        </p>
      )}
    </Modal>
  );
}
