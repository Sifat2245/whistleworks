import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import Swal from "sweetalert2";
import LoaderV2 from "@/components/common/LoaderV2";
import useRegisteredReferees from "@/hooks/get-registered-referees";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Select } from "antd"; // ← Ant Design Select
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import BackBtn from "@/components/common/BackBtn";

const MakeAnnouncement = ({ camp_id }) => {
  const { getRegisterReferess } = useRegisteredReferees(camp_id);
  const axiosInstance = useAxiosSecure();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      recipientType: "all",
      specificUserIds: [],
      subject: "",
      message: "",
    },
  });

  // Convert users to Ant Design option format
  const userOptions = getRegisterReferess?.map((user) => ({
    value: user.id,
    label: (
      <div className="flex items-center gap-3 py-1">
        <img
          src={user.avatar || "/default-avatar.png"}
          alt={user.name}
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="text-sm font-medium">{user.name}</span>
      </div>
    ),
  }));

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let payload = {
        subject: data.subject,
        message: data.message,
        announcement_to: data.recipientType,
      };

      if (
        data.recipientType === "specific" &&
        data.specificUserIds.length > 0
      ) {
        payload.specific_user_ids = data.specificUserIds;
      }

      await axiosInstance.post("/director/announcements", payload);

      Swal.fire({
        icon: "success",
        title: "Announcement Sent!",
        text: "Your announcement has been successfully delivered to the recipients.",
        confirmButtonColor: "#00AEEF",
        timer: 3500,
        timerProgressBar: true,
      });

      reset();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Send",
        text:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const recipientType = watch("recipientType");

  return (
    <div>
        <BackBtn />
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-10 border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Make an Announcement
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Recipient Selection */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              Send To
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition">
                <input
                  type="radio"
                  value="all"
                  {...register("recipientType")}
                  className="mr-3 text-[#00AEEF] focus:ring-[#00AEEF]"
                />
                <span className="font-medium">All Members</span>
              </label>

              <label className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition">
                <input
                  type="radio"
                  value="evaluators"
                  {...register("recipientType")}
                  className="mr-3 text-[#00AEEF] focus:ring-[#00AEEF]"
                />
                <span className="font-medium">All Evaluators</span>
              </label>

              <label className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition">
                <input
                  type="radio"
                  value="referees"
                  {...register("recipientType")}
                  className="mr-3 text-[#00AEEF] focus:ring-[#00AEEF]"
                />
                <span className="font-medium">All Referees</span>
              </label>

              <label className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition">
                <input
                  type="radio"
                  value="specific"
                  {...register("recipientType")}
                  className="mr-3 text-[#00AEEF] focus:ring-[#00AEEF]"
                />
                <span className="font-medium">Specific Users</span>
              </label>
            </div>
          </div>

          {/* Specific Users - Ant Design Select */}
          {recipientType === "specific" && (
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Select Recipients
              </label>
              <Controller
                name="specificUserIds"
                control={control}
                rules={{
                  required:
                    recipientType === "specific"
                      ? "Please select at least one user"
                      : false,
                }}
                render={({ field }) => (
                  <Select
                    mode="multiple"
                    style={{ width: "100%" }}
                    placeholder="Search and select users..."
                    optionLabelProp="label"
                    {...field}
                    options={userOptions}
                    className="ant-select-custom border border-black/15 rounded-xl py-2!"
                    dropdownClassName="z-50"
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                      option.label.props.children[1].props.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                )}
              />
              {errors.specificUserIds && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.specificUserIds.message}
                </p>
              )}
            </div>
          )}

          {/* Subject */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Subject
            </label>
            <input
              type="text"
              {...register("subject", { required: "Subject is required" })}
              className="w-full px-5 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/20 transition"
              placeholder="Enter a clear subject line"
            />
            {errors.subject && (
              <p className="text-red-500 text-sm mt-2">
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Message
            </label>
            <textarea
              {...register("message", { required: "Message is required" })}
              rows={6}
              className="w-full px-5 py-4 text-base border border-gray-300 rounded-xl focus:outline-none focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/20 transition resize-none"
              placeholder="Write your full announcement here..."
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-2">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4">
            <CommonSubmitBtn
              variant="primary"
              className="w-full py-4 text-lg font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? <LoaderV2 /> : "Send Announcement"}
            </CommonSubmitBtn>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MakeAnnouncement;
