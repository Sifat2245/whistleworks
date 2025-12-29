// components/schedule/ScheduleActionButtons.jsx
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useCampSchedule from "@/hooks/useCampSchedule";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // For beautiful confirmation

const ScheduleActionButtons = ({ campId }) => {
  const axiosInstance = useAxiosSecure();
  const navigate = useNavigate();
  const { scheduleData } = useCampSchedule(campId);

  const scheduleId = scheduleData?.id;
  // console.log(scheduleId, "schedule id");

  // === Publish Schedule Mutation ===
  const publishMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(
        `/v1/camp/${campId}/schedule/publish`
      );
      return res?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Schedule published successfully!");
      navigate("/director-dashboard");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to publish schedule";
      toast.error(message);
    },
  });

  // === Delete Schedule Mutation ===
  const clearSchedule = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(
        `/v1/director/court-assign/schedules/${scheduleId}/clear-assignments`
      );
      return res?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Schedule Cleared successfully!");
      window.location.reload();
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete schedule";
      toast.error(message);
    },
  });

  // == clear schedule mutation ==
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
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete schedule";
      toast.error(message);
    },
  });

  // == clear schedule mutation ==
  const autoAssign = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(
        `/v1/director/court-assign/camp/${campId}/auto-assign`
      );
      return res?.data;
    },
    onSuccess: (data) => {
      toast.success(
        data?.message || "All available referees assigned successfully!"
      );
      window.location.reload();
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete schedule";
      toast.error(message);
    },
  });

  // Confirm before publishing
  const handlePublish = () => {
    Swal.fire({
      title: "Publish Schedule?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Publish",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#00AEEF",
    }).then((result) => {
      if (result.isConfirmed) {
        publishMutation.mutate();
      }
    });
  };

  // Confirm before deleting
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
      if (result.isConfirmed) {
        deleteMutation.mutate();
      }
    });
  };
  const handleClearSchedule = () => {
    Swal.fire({
      title: "Clear Schedule?",
      text: "Are you sure you want to clear the schedule?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Clear",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        clearSchedule.mutate();
      }
    });
  };

  const handleAutoAssign = () => {
    Swal.fire({
      title: "Assign Referees?",
      text: "Assign all available referees to the schedule?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Proceed",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        autoAssign.mutate();
      }
    });
  };

  return (
    <div className="flex justify-between items-center mt-10">
      {/* Left Side */}
      <div className="flex gap-6">
        <CommonSubmitBtn
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg transition-colors"
          onClick={handleDelete}
          loading={deleteMutation.isPending}
          disabled={deleteMutation.isPending}
        >
          Delete Schedule
        </CommonSubmitBtn>

        <CommonSubmitBtn
          onClick={handleClearSchedule}
          isLoading={clearSchedule.isPending}
          disabled={clearSchedule.isPending}
          className="border border-primary bg-white text-primary px-8 py-4 hover:bg-gray-50"
          // onClick={handleClear} // Add later
        >
          Clear Schedule
        </CommonSubmitBtn>
      </div>

      {/* Right Side */}
      <div className="flex gap-6">
        <CommonSubmitBtn
          onClick={handleAutoAssign}
          variant="primary"
          isLoading={autoAssign.isPending}
          disabled={autoAssign.isPending}
        >
          Auto-Assign Referees
        </CommonSubmitBtn>

        <CommonSubmitBtn
          variant="primary"
          className="px-10 py-4"
          onClick={handlePublish}
          loading={publishMutation.isPending}
          disabled={publishMutation.isPending}
        >
          Publish Schedule
        </CommonSubmitBtn>
      </div>
    </div>
  );
};

export default ScheduleActionButtons;
