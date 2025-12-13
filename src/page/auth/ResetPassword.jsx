import { useForm } from "react-hook-form";
import CommonInputWrapper from "@/components/common/CommonInputWrapper";
import CommonTitle from "@/components/common/CommonTitle";
import CommonText from "@/components/common/CommonText";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { useMutation } from "@tanstack/react-query";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import toast from "react-hot-toast";
import LoaderV2 from "@/components/common/LoaderV2";

const ResetPassword = () => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  // Note: react hook form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch("password_confirmation");

  // Note: reset password mutation
  const resetPasswordMutation = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: async (data) => {
      const response = await axiosPublic.post(`/reset-password`, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      return response;
    },
    onSuccess: (res) => {
      const message = res?.data?.message;
      toast.success(message || "OTP verification successful");
      sessionStorage.removeItem("reset_token");
      sessionStorage.removeItem("verify_email");
      sessionStorage.removeItem("testing_purpose_otp");
      navigate("/auth/signin");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "OTP verification failed");
    }
  });

  const onSubmit = (data) => {
    console.log("Reset Password Data:", data);
    const token = sessionStorage.getItem("reset_token");
    const email = sessionStorage.getItem("verify_email");

    resetPasswordMutation.mutate({
      token,
      email,
      password: data.password,
      password_confirmation: data.password_confirmation
    });
  };

  // Note: main ui component
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <CommonTitle text="Reset Password" />
        <CommonText text="Enter your new password to continue" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* New Password */}
        <CommonInputWrapper
          label="New Password"
          type="password"
          placeholder="Enter new password"
          register_as="password"
          register={register}
          errors={errors}
          validationRules={{
            required: "New password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
        />

        {/* Confirm Password */}
        <CommonInputWrapper
          label="Confirm Password"
          type="password"
          placeholder="Confirm new password"
          register_as="password_confirmation"
          register={register}
          errors={errors}
          validationRules={{
            required: "Please confirm your password",
            validate: (value) =>
              value === password || "Passwords do not match",
          }}
        />

        {/* Submit Button */}
        <CommonSubmitBtn disabled={resetPasswordMutation.isPending} type="submit" variant="primary" className="w-full">
          {resetPasswordMutation.isPending ? <LoaderV2 /> : "Reset Password"}
        </CommonSubmitBtn>
      </form>

      <Link to={'/auth/signin'} className="flex gap-2 justify-center items-center mt-8 text-primary hover:text-[#0097ce]">
        <FaArrowLeft />
        <span>Back to Login</span>
      </Link>
    </div>
  );
};

export default ResetPassword;
