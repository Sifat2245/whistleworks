import { useForm } from "react-hook-form";
import { useState } from "react";
import Swal from "sweetalert2";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import CommonSectionTitle from "@/components/common/CommonSectionTitle";
import SectionCard from "@/components/common/SectionCard";
import BackBtn from "@/components/common/BackBtn";
import { useParams } from "react-router-dom";
import { useSendAnnouncement } from "@/hooks/api/director-hooks/useAnnouncements";
import { cn } from "@/lib/utils";
import {
  LuMegaphone,
  LuSend,
  LuUsers,
  LuUserCog,
  LuUserCheck,
  LuMail,
  LuMessageSquare,
} from "react-icons/lu";

const recipientOptions = [
  {
    value: "all",
    label: "All Members",
    description: "Everyone registered in the camp",
    icon: <LuUsers />,
  },
  {
    value: "evaluators",
    label: "All Evaluators",
    description: "Camp evaluators & staff",
    icon: <LuUserCog />,
  },
  {
    value: "referees",
    label: "All Referees",
    description: "Referees only",
    icon: <LuUserCheck />,
  },
];

const MakeAnnouncement = () => {
  const { id: camp_id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      recipientType: "all",
      subject: "",
      message: "",
    },
  });

  const recipientType = watch("recipientType");

  // Send announcement mutation
  const sendAnnouncementMutation = useSendAnnouncement({
    onSuccess: (data) => {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text:
          data?.data?.message ||
          "Your announcement has been sent successfully.",
        confirmButtonColor: "#00AEEF",
        timer: 4000,
        timerProgressBar: true,
      });

      reset({
        recipientType: "all",
        subject: "",
        message: "",
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        "Failed to send announcement. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
        confirmButtonColor: "#ef4444",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (formData) => {
    const payload = {
      subject: formData.subject,
      message: formData.message,
      announcement_to: formData.recipientType,
      camp_id,
    };

    setIsSubmitting(true);
    sendAnnouncementMutation.mutate(payload);
  };

  return (
    <div className="w-full pb-12">
      <BackBtn />

      <CommonSectionTitle
        text="Make an Announcement"
        subText="Send an update to your camp members"
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 sm:gap-8 mt-8"
      >
        {/* Send To */}
        <SectionCard
          icon={<LuMegaphone />}
          title="Recipients"
          description="Who should receive this announcement?"
        >
          <div className="p-5 sm:p-7 flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recipientOptions.map((option) => {
                const selected = recipientType === option.value;
                return (
                  <label
                    key={option.value}
                    className={cn(
                      "flex items-start gap-3.5 p-4 rounded-[10px] border cursor-pointer transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/40",
                      selected
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border bg-white hover:border-primary/40 hover:bg-primary/[0.03]"
                    )}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      {...register("recipientType")}
                      className="sr-only"
                    />
                    <span
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 transition-colors",
                        selected
                          ? "bg-primary text-white"
                          : "bg-primary/10 text-primary"
                      )}
                    >
                      {option.icon}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-medium text-[#333]">
                          {option.label}
                        </span>
                        <span
                          className={cn(
                            "w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors",
                            selected
                              ? "border-primary bg-primary"
                              : "border-[#BBB] bg-white"
                          )}
                        >
                          {selected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </span>
                      </span>
                      <span className="block text-xs text-[#666] mt-0.5">
                        {option.description}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </SectionCard>

        {/* Announcement Content */}
        <SectionCard
          icon={<LuMessageSquare />}
          title="Announcement"
          description="Write the subject and message"
        >
          <div className="p-5 sm:p-7 flex flex-col gap-5">
            {/* Subject */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="subject"
                className="capitalize font-medium text-[#333] text-base flex items-center gap-2"
              >
                <LuMail className="text-primary" /> Subject
                <span className="text-red-500">*</span>
              </label>
              <input
                id="subject"
                type="text"
                placeholder="Enter a clear and concise subject"
                className="w-full px-4 py-3 rounded-lg placeholder-[#5A5C5F] outline-none text-black border border-black/20 bg-[rgba(255,255,255,0.05)] focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                {...register("subject", {
                  required: "Subject is required",
                  maxLength: {
                    value: 150,
                    message: "Subject too long (max 150 characters)",
                  },
                })}
              />
              {errors.subject && (
                <p className="text-red-600 text-sm">{errors.subject.message}</p>
              )}
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="message"
                className="capitalize font-medium text-[#333] text-base flex items-center gap-2"
              >
                <LuMessageSquare className="text-primary" /> Message
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                rows={8}
                placeholder="Write your announcement message here..."
                className="w-full px-4 py-3 min-h-44 rounded-lg placeholder-[#5A5C5F] outline-none text-black border border-black/20 bg-[rgba(255,255,255,0.05)] focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200 resize-none"
                {...register("message", {
                  required: "Message is required",
                  minLength: {
                    value: 10,
                    message: "Message too short (min 10 characters)",
                  },
                })}
              />
              {errors.message && (
                <p className="text-red-600 text-sm">{errors.message.message}</p>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 pb-4">
          <p className="text-sm text-[#666] max-w-md">
            Your announcement will be delivered to the selected recipients
            immediately.
          </p>
          <CommonSubmitBtn
            type="submit"
            variant="primary"
            className="px-8 justify-center"
            isLoading={isSubmitting || sendAnnouncementMutation.isPending}
          >
            <span className="inline-flex items-center gap-2">
              <LuSend className="text-base" /> Send Announcement
            </span>
          </CommonSubmitBtn>
        </div>
      </form>
    </div>
  );
};

export default MakeAnnouncement;
