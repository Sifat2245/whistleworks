import { useForm } from "react-hook-form";
import CommonInputWrapper from "@/components/common/CommonInputWrapper";
import CommonTitle from "@/components/common/CommonTitle";
import CommonText from "@/components/common/CommonText";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("newPassword");

  const onSubmit = (data) => {
    console.log("Reset Password Data:", data);
    // TODO: integrate reset password API
  };

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
          register_as="newPassword"
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
          register_as="confirmPassword"
          register={register}
          errors={errors}
          validationRules={{
            required: "Please confirm your password",
            validate: (value) =>
              value === password || "Passwords do not match",
          }}
        />

        {/* Submit Button */}
        <CommonSubmitBtn type="submit" variant="primary" className="w-full">
          Save
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
