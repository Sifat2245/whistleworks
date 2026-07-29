import { useMutation } from "@tanstack/react-query";
import { useAnnouncementService } from "@/services/director-services/announcement.service";

// ── Send announcement ──────────────────────────────────────────
export const useSendAnnouncement = (callbacks = {}) => {
  const { sendAnnouncement } = useAnnouncementService();
  const { onSuccess: onSuccessCb, onError: onErrorCb, onSettled: onSettledCb } = callbacks;

  return useMutation({
    mutationKey: ["send-announcement"],
    mutationFn: (payload) => sendAnnouncement(payload),
    onSuccess: (data, variables, context) => {
      if (onSuccessCb) onSuccessCb(data, variables, context);
    },
    onError: (error) => {
      if (onErrorCb) onErrorCb(error);
    },
    onSettled: (data, error, variables, context) => {
      if (onSettledCb) onSettledCb(data, error, variables, context);
    },
  });
};
