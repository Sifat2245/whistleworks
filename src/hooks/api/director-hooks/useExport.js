import { useMutation } from "@tanstack/react-query";
import { useExportService } from "@/services/director-services/export.service";
import toast from "react-hot-toast";

// ── Export Camp Game Schedule to CSV ──────────────────────────
export const useExportSchedule = (campId) => {
  const { exportSchedule } = useExportService();

  return useMutation({
    mutationKey: ["export-schedule", campId],
    mutationFn: () => exportSchedule(campId),
    onSuccess: (response) => {
      // Trigger browser download of the returned CSV blob
      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `schedule-${campId}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Schedule exported successfully");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to export schedule.",
      );
    },
  });
};
