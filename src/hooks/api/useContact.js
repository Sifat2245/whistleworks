import { useMutation } from "@tanstack/react-query";
import { useContactService } from "@/services/contact.service";

/**
 * Hook for submitting the public contact form
 */
export const useSubmitContactForm = (options = {}) => {
  const { submitContactForm } = useContactService();

  return useMutation({
    mutationKey: ["contact-form"],
    mutationFn: submitContactForm,
    ...options,
  });
};
