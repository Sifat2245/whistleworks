import { useMutation } from "@tanstack/react-query";
import { useExportService } from "@/services/director-services/export.service";
import toast from "react-hot-toast";

// ── Shared helper: trigger a browser download of an axios response ──
const downloadExport = (data, filename) => {
  if (!data) {
    toast.error("No data received from server.");
    return false;
  }

  // Response may come back as a Blob (if responseType is set) or as
  // a raw CSV string / JSON when axios parses it automatically.
  let blob;
  if (data instanceof Blob) {
    blob = data;
  } else if (typeof data === "string") {
    blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
  } else {
    blob = new Blob([JSON.stringify(data)], {
      type: "application/json;charset=utf-8;",
    });
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
};

// ── Export Camp Referees Roster to CSV ────────────────────────
export const useExportReferees = (campId) => {
  const { exportReferees } = useExportService();

  return useMutation({
    mutationKey: ["export-referees", campId],
    mutationFn: () => exportReferees(campId),
    onSuccess: (response) => {
      if (downloadExport(response?.data, `referees-${campId}.csv`)) {
        toast.success("Referees exported successfully");
      }
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to export referees.",
      );
    },
  });
};

// ── Export Camp Evaluators to CSV ─────────────────────────────
export const useExportEvaluators = (campId) => {
  const { exportEvaluators } = useExportService();

  return useMutation({
    mutationKey: ["export-evaluators", campId],
    mutationFn: () => exportEvaluators(campId),
    onSuccess: (response) => {
      if (downloadExport(response?.data, `evaluators-${campId}.csv`)) {
        toast.success("Evaluators exported successfully");
      }
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to export evaluators.",
      );
    },
  });
};

// ── Export Camp Crew Groups to CSV ────────────────────────────
export const useExportCrews = (campId) => {
  const { exportCrews } = useExportService();

  return useMutation({
    mutationKey: ["export-crews", campId],
    mutationFn: () => exportCrews(campId),
    onSuccess: (response) => {
      if (downloadExport(response?.data, `crews-${campId}.csv`)) {
        toast.success("Crews exported successfully");
      }
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to export crews.",
      );
    },
  });
};

// ── Export Camp Ranking Report to CSV ─────────────────────────
export const useExportRanking = (campId) => {
  const { exportRanking } = useExportService();

  return useMutation({
    mutationKey: ["export-ranking", campId],
    mutationFn: () => exportRanking(campId),
    onSuccess: (response) => {
      if (downloadExport(response?.data, `ranking-${campId}.csv`)) {
        toast.success("Ranking exported successfully");
      }
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to export ranking.",
      );
    },
  });
};

// ── Export Camp Game Schedule to CSV ──────────────────────────
export const useExportSchedule = (campId) => {
  const { exportSchedule } = useExportService();

  return useMutation({
    mutationKey: ["export-schedule", campId],
    mutationFn: () => exportSchedule(campId),
    onSuccess: (response) => {
      if (downloadExport(response?.data, `schedule-${campId}.csv`)) {
        toast.success("Schedule exported successfully");
      }
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to export schedule.",
      );
    },
  });
};
