import { useForm } from "react-hook-form";
import CommonInputWrapper from "@/components/common/CommonInputWrapper";
import CommonTitle from "@/components/common/CommonTitle";
import CommonText from "@/components/common/CommonText";
import { FaArrowLeft } from "react-icons/fa6";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LoaderV2 from "@/components/common/LoaderV2";
import { useForgotPassword } from "@/hooks/api/useAuth";

const ForgetPassword = () => {
  const navigate = useNavigate();

  // Note: react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Note: Forgot password mutation
  const forgotPasswordMutation = useForgotPassword({
    onSuccess: (res) => {
      const data = res?.data;
      toast.success(data?.message || "Please check your email.");
      sessionStorage.setItem("verify_email", data?.data?.email);
      sessionStorage.setItem("testing_purpose_otp", data?.data?.otp);

      setTimeout(() => {
        navigate("/auth/reset-password-otp");
      }, 1500);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong! Please try again.");
    },
  });

  const onSubmit = (data) => {
    // console.log("Forget Password Data:", data);
    forgotPasswordMutation.mutate(data);
  };

  // Note: main ui component
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

        <CommonSubmitBtn disabled={forgotPasswordMutation.isPending} variant="primary" type="submit" className="w-full">
          {forgotPasswordMutation.isPending ? <LoaderV2 /> : "Reset Password"}
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
