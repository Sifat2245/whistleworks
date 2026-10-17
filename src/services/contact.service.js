import useAxiosPublic from "@/hooks/useAxiosPublic";

export const useContactService = () => {
  const axiosPublic = useAxiosPublic();

  return {
    /**
     * Submit contact form to super-admin /contact-form
     * Accepts either FormData or a plain object { name, email, subject, message, phone }
     */
    submitContactForm: (data) => {
      let payload = data;
      if (!(data instanceof FormData)) {
        const formData = new FormData();
        Object.entries(data || {}).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
        payload = formData;
      }

      return axiosPublic.post("/contact-form", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
  };
};
