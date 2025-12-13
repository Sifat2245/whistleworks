import { useForm } from "react-hook-form";
import CommonInputWrapper from "@/components/common/CommonInputWrapper";
import CommonTitle from "@/components/common/CommonTitle";
import CommonText from "@/components/common/CommonText";
import { FaArrowLeft } from "react-icons/fa6";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import { Link } from "react-router-dom";

const ForgetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Forget Password Data:", data);
    // TODO: integrate forget password API
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 mb-6">
        <CommonTitle text="Forgot Password" />
        <CommonText text="Enter your email to reset your password" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <CommonInputWrapper
          label="Email"
          type="email"
          placeholder="Enter your email"
          register_as="email"
          register={register}
          errors={errors}
          validationRules={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          }}
        />

        <CommonSubmitBtn link={true} path="/auth/reset-password-otp" variant="primary" type="submit" className="w-full">
          Reset Password
        </CommonSubmitBtn>
      </form>
      <Link to={'/auth/signin'} className="flex gap-2 justify-center items-center mt-8 text-primary hover:text-[#0097ce]">
        <FaArrowLeft />
        <span>Back to Login</span>
      </Link>
    </div>
  );
};

export default ForgetPassword;
