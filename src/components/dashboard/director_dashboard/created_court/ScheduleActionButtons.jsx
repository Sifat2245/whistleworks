// components/schedule/ScheduleActionButtons.jsx
import { useState } from "react";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useCampSchedule from "@/hooks/useCampSchedule";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import LoaderV2 from "@/components/common/LoaderV2";

const ScheduleActionButtons = ({ campId }) => {
  const axiosInstance = useAxiosSecure();
  const navigate = useNavigate();
  const { scheduleData } = useCampSchedule(campId);

  const scheduleId = scheduleData?.id;

  const [showTooltip, setShowTooltip] = useState(false);

  // === Mutations ===
  const publishMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/v1/camp/${campId}/schedule/publish`);
      return res?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Schedule published successfully!");
      navigate("/director-dashboard");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to publish schedule");
    },
  });

  const clearSchedule = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(
        `/v1/director/court-assign/schedules/${scheduleId}/clear-assignments`
      );
      return res?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Schedule cleared successfully!");
      window.location.reload();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to clear schedule");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(`/v1/camp/${campId}/schedule`);
      return res?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Schedule deleted successfully!");
      navigate("/director-dashboard");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete schedule");
    },
  });

  const autoAssign = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(
        `/v1/director/court-assign/camp/${campId}/auto-assign`
      );
      return res?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "All available referees assigned successfully!");
      window.location.reload();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to auto-assign referees");
    },
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
      if (result.isConfirmed) clearSchedule.mutate();
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
    <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center mt-10">
      {/* Left Side */}
      <div className="flex flex-col md:flex-row gap-6">
        <CommonSubmitBtn
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg transition-colors"
          onClick={handleDelete}
          isLoading={deleteMutation.isPending}
          disabled={deleteMutation.isPending}
        >
          Delete Schedule
        </CommonSubmitBtn>

        <CommonSubmitBtn
          onClick={handleClearSchedule}
          isLoading={clearSchedule.isPending}
          disabled={clearSchedule.isPending}
          className="border border-primary bg-white text-primary px-8 py-4 hover:bg-gray-50"
        >
          {clearSchedule.isPending ? <LoaderV2/> : "Clear Schedule"}
        </CommonSubmitBtn>
      </div>

      {/* Right Side */}
      <div className="flex flex-col md:flex-row gap-6 items-center relative">
        {/* Auto-Assign Button with Tooltip */}
        <div
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <CommonSubmitBtn
            onClick={handleAutoAssign}
            variant="primary"
            isLoading={autoAssign.isPending}
            disabled={autoAssign.isPending}
          >
            Auto-Assign Referees
          </CommonSubmitBtn>

          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-80 z-50">
              <div className="bg-gray-800 text-white text-sm rounded-lg shadow-2xl p-5 border border-gray-700">
                <h4 className="font-bold text-lg mb-3 text-center">Auto Assign Rules</h4>
                <ol className="list-decimal list-inside space-y-3 text-left">
                  <li>
                    A <strong>MINIMUM of 1 game rest</strong> between games
                  </li>
                  <li>
                    Referees will <strong>not be assigned</strong> to previously assigned court unless no other courts are available
                  </li>
                  <li>
                    Referees will be assigned <strong>similar number of games</strong>
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

        <CommonSubmitBtn
          variant="primary"
          onClick={handlePublish}
          isLoading={publishMutation.isPending}
          disabled={publishMutation.isPending}
        >
          Publish Schedule
        </CommonSubmitBtn>
      </div>
    </div>
  );
};

export default ScheduleActionButtons;