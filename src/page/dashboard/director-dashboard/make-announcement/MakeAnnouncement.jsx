import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import Swal from "sweetalert2";
import LoaderV2 from "@/components/common/LoaderV2";
import { useRegisteredReferees } from "@/hooks/api/useRegisteredReferees";
import { Select } from "antd";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import BackBtn from "@/components/common/BackBtn";
import { useParams } from "react-router-dom";
import { useSendAnnouncement } from "@/hooks/api/director-hooks/useAnnouncements";

const MakeAnnouncement = () => {
  const { id: camp_id } = useParams();
  const { getRegisterReferess, isLoading: loadingReferees } =
    useRegisteredReferees(camp_id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      recipientType: "all",
      specificUserIds: [],
      subject: "",
      message: "",
    },
  });

  const recipientType = watch("recipientType");

  // ── Send announcement mutation ────────────────────────────
  const sendAnnouncementMutation = useSendAnnouncement({
    onSuccess: (data) => {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: data?.data?.message || "Your announcement has been sent successfully.",
        confirmButtonColor: "#00AEEF",
        timer: 4000,
        timerProgressBar: true,
      });

      reset({
        recipientType: "all",
        specificUserIds: [],
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

  // Convert referees to Ant Design Select options
  const userOptions =
    getRegisterReferess?.map((user) => ({
      value: user.id,
      label: (
        <div className="flex items-center gap-3 py-1">
          <img
            src={user.avatar || "/default-avatar.png"}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border border-gray-200"
            onError={(e) => (e.target.src = "/default-avatar.png")}
          />
          <div>
            <div className="font-medium text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
        </div>
      ),
    })) || [];

  const onSubmit = (formData) => {
    const payload = {
      subject: formData.subject,
      message: formData.message,
      announcement_to: formData.recipientType,
      camp_id,
    };

    if (
      formData.recipientType === "specific" &&
      formData.specificUserIds.length > 0
    ) {
      payload.specific_user_ids = formData.specificUserIds;
    }

    setIsSubmitting(true);
    sendAnnouncementMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-7xl mx-auto px-4">
        <BackBtn />

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mt-8">
          <div className="p-8 sm:p-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-10">
              Make an Announcement
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              {/* Send To */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-5">
                  Send To
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { value: "all", label: "All Members" },
                    { value: "evaluators", label: "All Evaluators" },
                    { value: "referees", label: "All Referees" },
                    // { value: "specific", label: "Specific Users" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center p-5 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-all border-2 border-transparent hover:border-[#00AEEF]/30"
                    >
                      <input
                        type="radio"
                        value={option.value}
                        {...register("recipientType")}
                        className="w-5 h-5 text-[#00AEEF] focus:ring-[#00AEEF] focus:ring-2"
                      />
                      <span className="ml-4 text-lg font-medium text-gray-800">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Specific Recipients */}
              {recipientType === "specific" && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Select Recipients
                  </h3>
                  {loadingReferees ? (
                    <div className="text-center py-8">
                      <LoaderV2 />
                    </div>
                  ) : (
                    <Controller
                      name="specificUserIds"
                      control={control}
                      rules={{
                        validate: (value) =>
                          recipientType === "specific" &&
                          (!value || value.length === 0)
                            ? "Please select at least one recipient"
                            : true,
                      }}
                      render={({ field }) => (
                        <Select
                          mode="multiple"
                          placeholder="Search and select users..."
                          loading={loadingReferees}
                          options={userOptions}
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.label.props.children[1].props.children[0]
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          className="w-full"
                          dropdownStyle={{ zIndex: 9999 }}
                          allowClear
                          showSearch
                          size="large"
                          {...field}
                        />
                      )}
                    />
                  )}
                  {errors.specificUserIds && (
                    <p className="text-red-600 text-sm mt-2">
                      {errors.specificUserIds.message}
                    </p>
                  )}
                </div>
              )}

              {/* Subject */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Subject
                </h3>
                <input
                  type="text"
                  placeholder="Enter a clear and concise subject"
                  className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/20 transition"
                  {...register("subject", {
                    required: "Subject is required",
                    maxLength: {
                      value: 150,
                      message: "Subject too long (max 150 characters)",
                    },
                  })}
                />
                {errors.subject && (
                  <p className="text-red-600 text-sm mt-2">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Message
                </h3>
                <textarea
                  rows={8}
                  placeholder="Write your announcement message here..."
                  className="w-full px-6 py-5 text-base border border-gray-300 rounded-xl focus:outline-none focus:border-[#00AEEF] focus:ring-4 focus:ring-[#00AEEF]/20 transition resize-none"
                  {...register("message", {
                    required: "Message is required",
                    minLength: {
                      value: 10,
                      message: "Message too short (min 10 characters)",
                    },
                  })}
                />
                {errors.message && (
                  <p className="text-red-600 text-sm mt-2">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <CommonSubmitBtn
                  type="submit"
                  variant="primary"
                  className="w-full py-5 text-xl font-bold"
                  disabled={isSubmitting || sendAnnouncementMutation.isPending}
                >
                  {isSubmitting || sendAnnouncementMutation.isPending ? (
                    <LoaderV2 />
                  ) : (
                    "Send Announcement"
                  )}
                </CommonSubmitBtn>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeAnnouncement;
