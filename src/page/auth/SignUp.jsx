import { useForm } from "react-hook-form";
import CommonInputWrapper from "@/components/common/CommonInputWrapper";
import CommonText from "@/components/common/CommonText";
import CommonTitle from "@/components/common/CommonTitle";
import SocialLogin from "./SocialLogin";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = (data) => {
    console.log("Sign Up Data:", data);
    // TODO: Integrate sign-up API here
  };

  return (
    <div className="w-full max-w-2xl max-h-screen overflow-y-auto py-24 hide-scrollbar">
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <CommonTitle text="Create an Account" />
        <CommonText text="Join us to manage your referee camps efficiently" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* First Name */}
        <CommonInputWrapper
          label="First Name"
          placeholder="Enter your first name"
          register_as="firstName"
          register={register}
          errors={errors}
          validationRules={{ required: "First name is required" }}
        />

        {/* Last Name */}
        <CommonInputWrapper
          label="Last Name"
          placeholder="Enter your last name"
          register_as="lastName"
          register={register}
          errors={errors}
          validationRules={{ required: "Last name is required" }}
        />

        {/* Address */}
        <CommonInputWrapper
          label="Address"
          placeholder="Enter your address"
          register_as="address"
          register={register}
          errors={errors}
          validationRules={{ required: "Address is required" }}
        />

        {/* Phone Number */}
        <CommonInputWrapper
          label="Phone Number"
          type="tel"
          placeholder="Enter your phone number"
          register_as="phone"
          register={register}
          errors={errors}
          validationRules={{
            required: "Phone number is required",
            pattern: {
              value: /^[0-9]{6,15}$/,
              message: "Enter a valid phone number",
            },
          }}
        />

        {/* Email */}
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

        {/* Password */}
        <CommonInputWrapper
          label="Password"
          type="password"
          placeholder="Enter your password"
          register_as="password"
          register={register}
          errors={errors}
          validationRules={{
            required: "Password is required",
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
          placeholder="Re-enter your password"
          register_as="confirmPassword"
          register={register}
          errors={errors}
          validationRules={{
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          }}
        />

        {/* Role Select */}
        <CommonInputWrapper
          label="Role"
          type="select"
          placeholder="Select your role"
          register_as="role"
          control={control}
          errors={errors}
          options={[
            { label: "Director", value: "director" },
            { label: "Referee", value: "referee" },
            { label: "Evaluator", value: "evaluator" },
          ]}
          validationRules={{
            required: "Role is required",
          }}
        />

        {/* Agree Terms */}
        <div className="flex items-start gap-2 mt-3">
          <input
            type="checkbox"
            {...register("agreeTerms", {
              required: "You must agree to the terms and conditions",
            })}
            className="w-4 h-4 accent-primary mt-1"
          />
          <p className="text-sm text-neutral-600">
            I agree to the{" "}
            <a
              href="/terms"
              className="text-primary font-medium hover:underline"
            >
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="text-primary font-medium hover:underline"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
        {errors.agreeTerms && (
          <p className="text-red-500 text-sm mt-1">
            {errors.agreeTerms.message}
          </p>
        )}

        {/* Submit Button */}
        <CommonSubmitBtn link={true} path="/referee-dashboard" variant="primary" type="submit" className="w-full">
          Sign Up
        </CommonSubmitBtn>
      </form>

      {/* OR Separator */}
      <div className="flex items-center gap-4 my-6">
        <div className="grow h-px bg-neutral-300"></div>
        <span className="text-neutral-500 text-sm font-medium">or</span>
        <div className="grow h-px bg-neutral-300"></div>
      </div>

      {/* Social Login */}
      <SocialLogin />

      {/* Footer */}
      <p className="text-center text-sm text-neutral-600 mt-6">
        Already have an account?{" "}
        <a href="/auth/signin" className="text-primary font-medium hover:underline">
          Sign In
        </a>
      </p>
    </div>
  );
};

export default SignUp;
