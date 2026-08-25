import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useGameAssignmentService } from "@/services/director-services/gameAssingment.service";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const handleAssignmentError = (error, defaultMsg) => {
  const errorData = error?.response?.data;
  const isForbidden = error?.response?.status === 403 || errorData?.code === 403;

  if (isForbidden) {
    const msg = errorData?.data || errorData?.message || defaultMsg;
    Swal.fire({
      icon: "error",
      title: "Permission Denied",
      text: msg,
      confirmButtonColor: "#00AEEF",
    });
    return true;
  }
  return false;
};

export const useAvailableDates = (campId) => {
  const { getAvailableDates } = useGameAssignmentService();

  return useQuery({
    queryKey: ["available-dates", campId],
    queryFn: async () => {
      const response = await getAvailableDates(campId);
      return response?.data?.data;
    },
    enabled: !!campId,
  });
};


export const useCourtInfo = (campId, selectedDate) => {
  const { getCourtInfo } = useGameAssignmentService();

  return useQuery({
    queryKey: ["court-info", campId, selectedDate],
    queryFn: async () => {
      const response = await getCourtInfo(campId, selectedDate);
      return response?.data?.data;
    },
    enabled: !!campId && !!selectedDate,
  });
};


export const useAvailableReferees = (campId, slotId, enabled = false) => {
  const { getAvailableReferees } = useGameAssignmentService();

  return useQuery({
    queryKey: ["referee-list", campId, slotId],
    queryFn: async () => {
      const res = await getAvailableReferees(slotId);
      return res?.data?.data?.referees || [];
    },
    enabled: !!slotId && enabled,
  });
};

export const useAvailableCrews = (campId, slotId, enabled = false) => {
  const { getAvailableCrews } = useGameAssignmentService();

  return useQuery({
    queryKey: ["crew-list", campId, slotId],
    queryFn: async () => {
      const res = await getAvailableCrews(slotId);
      return res?.data?.data?.crews || [];
    },
    enabled: !!slotId && enabled,
  });
};

// ════════════════════════════════════════════════════════════════════
//  MUTATION HOOKS  —  CourtLists
// ════════════════════════════════════════════════════════════════════

export const useBulkUpdateCourtNames = (campId, selectedDate, callbacks = {}) => {
  const queryClient = useQueryClient();
  const { bulkUpdateCourtNames } = useGameAssignmentService();
  const { onSuccess: onSuccessCb, onError: onErrorCb } = callbacks;

  return useMutation({
    mutationKey: ["bulk-update-court-names", campId],
    mutationFn: ({ location_id, court_number, new_court_name }) =>
      bulkUpdateCourtNames(location_id, court_number, new_court_name),
    onSuccess: (data, variables, context) => {
      toast.success("Court name updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["court-info", campId, selectedDate],
      });
      if (onSuccessCb) onSuccessCb(data, variables, context);
    },
    onError: (error) => {
      if (!handleAssignmentError(error, "You do not have permission to update court name.")) {
        toast.error(
          error?.response?.data?.message || "Failed to update court name",
        );
      }
      if (onErrorCb) onErrorCb(error);
    },
  });
};


export const useToggleBlockSlot = (campId, selectedDate, callbacks = {}) => {
  const queryClient = useQueryClient();
  const { toggleBlockSlot } = useGameAssignmentService();
  const { onSuccess: onSuccessCb, onError: onErrorCb } = callbacks;

  return useMutation({
    mutationKey: ["toggle-block-slot"],
    mutationFn: (slotId) => toggleBlockSlot(slotId),
    onSuccess: (data, variables, context) => {
      toast.success("Updated");
      queryClient.invalidateQueries({
        queryKey: ["court-info", campId, selectedDate],
      });
      if (onSuccessCb) onSuccessCb(data, variables, context);
    },
    onError: (error) => {
      if (!handleAssignmentError(error, "You do not have permission to update block status.")) {
        toast.error("Failed to update block status");
      }
      if (onErrorCb) onErrorCb(error);
    },
  });
};


export const useBulkToggleBlock = (campId, selectedDate, callbacks = {}) => {
  const queryClient = useQueryClient();
  const { bulkToggleBlock } = useGameAssignmentService();
  const { onSuccess: onSuccessCb, onError: onErrorCb } = callbacks;

  return useMutation({
    mutationKey: ["bulk-toggle-block"],
    mutationFn: ({ scheduleId, date, start_time, action }) =>
      bulkToggleBlock(scheduleId, { date, start_time, action }),
    onSuccess: (data, variables, context) => {
      toast.success("Time slot updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["court-info", campId, selectedDate],
      });
      if (onSuccessCb) onSuccessCb(data, variables, context);
    },
    onError: (error) => {
      if (!handleAssignmentError(error, "You do not have permission to update time slot.")) {
        toast.error(
          error?.response?.data?.message || "Failed to update time slot",
        );
      }
      if (onErrorCb) onErrorCb(error);
    },
  });
};

// ════════════════════════════════════════════════════════════════════
//  MUTATION HOOKS  —  CourtSlotBox (remove assignment)
// ════════════════════════════════════════════════════════════════════

// ── Auto-assign referees ────────────────────────────────────────
export const useAutoAssign = (campId, callbacks = {}) => {
  const { autoAssignReferees } = useGameAssignmentService();
  const { onSuccess: onSuccessCb, onError: onErrorCb } = callbacks;

  return useMutation({
    mutationKey: ["auto-assign", campId],
    mutationFn: () => autoAssignReferees(campId),
    onSuccess: (data, variables, context) => {
      toast.success(
        data?.data?.message ||
          "All available referees assigned successfully!",
      );
      if (onSuccessCb) onSuccessCb(data, variables, context);
    },
    onError: (error) => {
      if (!handleAssignmentError(error, "You do not have permission to auto-assign referees.")) {
        toast.error(
          error?.response?.data?.message || "Failed to auto-assign referees",
        );
      }
      if (onErrorCb) onErrorCb(error);
    },
  });
};

export const useRemoveAssignment = (campId, selectedDate) => {
  const queryClient = useQueryClient();
  const { removeAssignment } = useGameAssignmentService();

  return useMutation({
    mutationKey: ["remove-assignment", campId],
    mutationFn: (assignmentId) => removeAssignment(assignmentId),
    onSuccess: () => {
      toast.success("Assignment removed successfully");
      queryClient.invalidateQueries({
        queryKey: ["court-info", campId, selectedDate],
      });
    },
    onError: (error) => {
      if (!handleAssignmentError(error, "You do not have permission to remove assignment.")) {
        toast.error("Failed to remove assignment");
      }
    },
  });
};

// ════════════════════════════════════════════════════════════════════
//  MUTATION HOOKS  —  ScheduleAddModal
// ════════════════════════════════════════════════════════════════════

export const useAssignReferees = (callbacks = {}) => {
  const { assignReferees } = useGameAssignmentService();
  const { onSuccess: onSuccessCb, onError: onErrorCb } = callbacks;

  return useMutation({
    mutationKey: ["assign-referees"],
    mutationFn: ({ slotId, payload, formData }) =>
      assignReferees(slotId, payload || formData),
    onSuccess: (data, variables, context) => {
      toast.success("Referees assigned successfully");
      if (onSuccessCb) onSuccessCb(data, variables, context);
    },
    onError: (error) => {
      if (!handleAssignmentError(error, "You do not have permission to assign referee for this schedule.")) {
        toast.error(
          error?.response?.data?.message || "Failed to assign referees",
        );
      }
      if (onErrorCb) onErrorCb(error);
    },
  });
};


export const useAssignCrew = (callbacks = {}) => {
  const { assignCrew } = useGameAssignmentService();
  const { onSuccess: onSuccessCb, onError: onErrorCb } = callbacks;

  return useMutation({
    mutationKey: ["assign-crew"],
    mutationFn: ({ slotId, data }) => assignCrew(slotId, data),
    onSuccess: (data, variables, context) => {
      toast.success("Crew assigned successfully");
      if (onSuccessCb) onSuccessCb(data, variables, context);
    },
    onError: (error) => {
      if (handleAssignmentError(error, "You do not have permission to assign crew for this schedule.")) {
        if (onErrorCb) onErrorCb(error);
        return;
      }

      const response = error?.response?.data;

      // Handle crew time conflict with detailed info
      if (
        response?.message?.conflicting_slots &&
        Array.isArray(response.message.conflicting_slots)
      ) {
        const conflicts = response.message.conflicting_slots;

        const conflictItems = conflicts
          .map((slot) => {
            const date = new Date(slot.date);
            const formattedDate = date.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            return `
            <div class="p-3 bg-red-50 border border-red-200 rounded-lg mb-3 text-left">
              <div class="font-semibold text-red-800">${slot.court}</div>
              <div class="text-sm text-gray-700 mt-1">${slot.time}</div>
              <div class="text-xs text-gray-600 mt-1">${formattedDate}</div>
            </div>
          `;
          })
          .join("");

        Swal.fire({
          title: "Crew Already Assigned Elsewhere",
          icon: "error",
          html: `
            <div class="text-left max-w-full">
              <p class="mb-4 text-gray-700">This crew is already scheduled in the same time slot at:</p>
              ${conflictItems}
              <p class="mt-4 font-medium text-gray-800">
                Remove the crew from the conflicting assignment(s) before assigning here.
              </p>
            </div>
          `,
          confirmButtonText: "Understood",
          confirmButtonColor: "#dc2626",
          width: 680,
        });

        return;
      }

      // Fallback
      const msg =
        response?.data || response?.message || "Failed to assign crew";
      toast.error(msg);
      if (onErrorCb) onErrorCb(error);
    },
  });
};
