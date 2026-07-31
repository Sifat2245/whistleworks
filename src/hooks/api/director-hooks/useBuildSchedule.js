import { useQuery, useMutation } from "@tanstack/react-query";
import { useBuildScheduleService } from "@/services/director-services/buildSchedule.service";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

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
