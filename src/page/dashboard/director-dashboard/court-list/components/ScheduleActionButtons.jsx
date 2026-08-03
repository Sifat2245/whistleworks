// components/schedule/ScheduleActionButtons.jsx
import { useState } from "react";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import useCampSchedule from "@/hooks/useCampSchedule";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import LoaderV2 from "@/components/common/LoaderV2";
import {
  usePublishSchedule,
  useClearSchedule,
  useDeleteSchedule,
} from "@/hooks/api/director-hooks/useBuildSchedule";
import { useAutoAssign } from "@/hooks/api/director-hooks/useGameAssingments";

const ScheduleActionButtons = ({ campId }) => {
  const navigate = useNavigate();
  const { scheduleData } = useCampSchedule(campId);

  const scheduleId = scheduleData?.id;

  const [showTooltip, setShowTooltip] = useState(false);

  // === Mutations ===
  const publishMutation = usePublishSchedule(campId, {
    onSuccess: () => navigate("/director-dashboard"),
  });

  const clearSchedule = useClearSchedule({
    onSuccess: () => window.location.reload(),
  });

  const deleteMutation = useDeleteSchedule(campId, {
    onSuccess: () => navigate("/director-dashboard"),
  });

  const autoAssign = useAutoAssign(campId, {
    onSuccess: () => window.location.reload(),
  });

  // === Confirmations ===
  const handlePublish = () => {
    Swal.fire({
      title: "Publish Schedule?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Publish",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#00AEEF",
    }).then((result) => {
      if (result.isConfirmed) publishMutation.mutate();
    });
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Delete Schedule?",
      text: "This action cannot be undone. All assignments will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate();
    });
  };

  const handleClearSchedule = () => {
    Swal.fire({
      title: "Clear Schedule?",
      text: "This will remove all current assignments.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Clear",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) clearSchedule.mutate(scheduleId);
    });
  };

  const handleAutoAssign = () => {
    Swal.fire({
      title: "Auto-Assign Referees?",
      text: "This will automatically assign available referees following the rules below.",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Proceed",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#00AEEF",
    }).then((result) => {
      if (result.isConfirmed) autoAssign.mutate();
    });
  };

  return (
    <div className="mt-10 pt-6 border-t border-border flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
      {/*
        Mobile (default): Publish (full width) then Auto-Assign (full width),
        then Clear & Delete side by side — Publish shows first.
        Desktop (lg+): this group moves to the right via lg:order-2, keeping
        the original Auto-Assign → Publish order.
      */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-3 lg:order-2">
        {/* Publish — primary action, shown first on mobile, rightmost on desktop */}
        <CommonSubmitBtn
          variant="primary"
          className="w-full lg:w-auto lg:order-2"
          onClick={handlePublish}
          isLoading={publishMutation.isPending}
          disabled={publishMutation.isPending}
        >
          Publish Schedule
        </CommonSubmitBtn>

        {/* Auto-Assign Button with Tooltip */}
        <div
          className="relative w-full lg:w-auto lg:order-1"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <CommonSubmitBtn
            onClick={handleAutoAssign}
            variant="primary"
            isLoading={autoAssign.isPending}
            disabled={autoAssign.isPending}
            className="w-full"
          >
            Auto-Assign Referees
          </CommonSubmitBtn>

          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-80 max-w-[calc(100vw-2rem)] z-50">
              <div className="bg-gray-800 text-white text-sm rounded-lg shadow-2xl p-5 border border-gray-700">
                <h4 className="font-bold text-lg mb-3 text-center">
                  Auto Assign Rules
                </h4>
                <ol className="list-decimal list-inside space-y-3 text-left">
                  <li>
                    A <strong>MINIMUM of 1 game rest</strong> between games
                  </li>
                  <li>
                    Referees will <strong>not be assigned</strong> to
                    previously assigned court unless no other courts are
                    available
                  </li>
                  <li>
                    Referees will be assigned{" "}
                    <strong>similar number of games</strong>
                  </li>
                </ol>
                <p className="mt-4 text-xs italic text-gray-300 text-center">
                  Note: Manual adjustments can be made after auto-assignment
                </p>

                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                  <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-800"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/*
        Mobile: Clear & Delete side by side (grid-cols-2).
        Desktop (lg+): this group moves to the left via lg:order-1.
      */}
      <div className="grid grid-cols-2 gap-3 lg:flex lg:gap-3 lg:order-1">
        {/* Delete */}
        <CommonSubmitBtn
          className="bg-red-500 hover:bg-red-600 text-white px-4 lg:px-8 py-3 rounded-lg transition-colors"
          onClick={handleDelete}
          isLoading={deleteMutation.isPending}
          disabled={deleteMutation.isPending}
        >
          Delete Schedule
        </CommonSubmitBtn>

        {/* Clear */}
        <CommonSubmitBtn
          onClick={handleClearSchedule}
          isLoading={clearSchedule.isPending}
          disabled={clearSchedule.isPending}
          className="border border-primary bg-white text-primary px-4 lg:px-8 py-3 hover:bg-gray-50"
        >
          {clearSchedule.isPending ? <LoaderV2 /> : "Clear Schedule"}
        </CommonSubmitBtn>
      </div>
    </div>
  );
};

export default ScheduleActionButtons;
