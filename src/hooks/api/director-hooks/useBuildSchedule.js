import { useQuery, useMutation } from "@tanstack/react-query";
import { useBuildScheduleService } from "@/services/director-services/buildSchedule.service";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const useGetDateRange = (campId) => {
  const { getDateRange } = useBuildScheduleService();

  return useQuery({
    queryKey: ["date-range", campId],
    queryFn: async () => {
      const response = await getDateRange(campId);
      return response?.data?.data;
    },
    enabled: !!campId,
  });
};

// ── Publish schedule ────────────────────────────────────────────
export const usePublishSchedule = (campId, callbacks = {}) => {
  const { publishSchedule } = useBuildScheduleService();
  const { onSuccess: onSuccessCb, onError: onErrorCb } = callbacks;

  return useMutation({
    mutationKey: ["publish-schedule", campId],
    mutationFn: () => publishSchedule(campId),
    onSuccess: (data, variables, context) => {
      toast.success(data?.data?.message || "Schedule published successfully!");
      if (onSuccessCb) onSuccessCb(data, variables, context);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to publish schedule",
      );
      if (onErrorCb) onErrorCb(error);
    },
  });
};

// ── Clear all assignments for a schedule ────────────────────────
export const useClearSchedule = (callbacks = {}) => {
  const { clearSchedule } = useBuildScheduleService();
  const { onSuccess: onSuccessCb, onError: onErrorCb } = callbacks;

  return useMutation({
    mutationKey: ["clear-schedule"],
    mutationFn: (scheduleId) => clearSchedule(scheduleId),
    onSuccess: (data, variables, context) => {
      toast.success(data?.data?.message || "Schedule cleared successfully!");
      if (onSuccessCb) onSuccessCb(data, variables, context);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to clear schedule",
      );
      if (onErrorCb) onErrorCb(error);
    },
  });
};

// ── Delete entire schedule ───────────────────────────────────────
export const useDeleteSchedule = (campId, callbacks = {}) => {
  const { deleteSchedule } = useBuildScheduleService();
  const { onSuccess: onSuccessCb, onError: onErrorCb } = callbacks;

  return useMutation({
    mutationKey: ["delete-schedule", campId],
    mutationFn: () => deleteSchedule(campId),
    onSuccess: (data, variables, context) => {
      toast.success(data?.data?.message || "Schedule deleted successfully!");
      if (onSuccessCb) onSuccessCb(data, variables, context);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete schedule",
      );
      if (onErrorCb) onErrorCb(error);
    },
  });
};

// ── Create schedule ──────────────────────────────────────────────
export const useCreateSchedule = (campId, options) => {
  const { createSchedule } = useBuildScheduleService();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["create-schedule", campId],
    mutationFn: (data) => createSchedule(campId, data),
    onSuccess: (response) => {
      const message =
        response?.data?.message || "Schedule created successfully.";
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: message,
        confirmButtonColor: "#00AEEF",
      });
      navigate(`/director-dashboard/court-list/${campId}`);
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err?.response?.data?.message || "Please fill all fields properly",
        confirmButtonColor: "#00AEEF",
      });
    },
    ...options,
  });
};
