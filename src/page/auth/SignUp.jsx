import { useForm } from "react-hook-form";
import CommonInputWrapper from "@/components/common/CommonInputWrapper";
import CommonText from "@/components/common/CommonText";
import CommonTitle from "@/components/common/CommonTitle";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import { useMutation } from "@tanstack/react-query";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import LoaderV2 from "@/components/common/LoaderV2";

// Google Maps Autocomplete
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { useState, useRef } from "react";

// Phone number input
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const libraries = ["places"];

const SignUp = () => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const location = useLocation();

  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const autocompleteRef = useRef(null);

  // React Hook Form
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      receive_sms_notifications: false,
      phone: "",
    },
  });

  const password = watch("password");
  const phoneValue = watch("phone");

  const getCampIdFromFromPath = () => {
    const from = location.state?.from || "";
    const match = from.match(/\/camp\/details\/(\d+)/);
    return match ? match[1] : null;
  };

  const saveIntendedCampRedirect = (campId) => {
    if (campId) {
      sessionStorage.setItem("intended_camp_id", campId);
      sessionStorage.setItem("intended_from_signup", "true");
    }
  };

  // Sign Up Mutation
  const signUpMutation = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: async (formData) => {
      const response = await axiosPublic.post(`/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Sign up successful");

      sessionStorage.setItem("verify_email", data?.data?.email);

      const campId = getCampIdFromFromPath();
      saveIntendedCampRedirect(campId);

      navigate("/auth/verify-otp");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Sign up failed");
    },
  });

  const onSubmit = (data) => {
    // Convert boolean to 1/0 to match backend expectation
    data.receive_sms_notifications = data.receive_sms_notifications ? 1 : 0;

    if (data.phone) {
      data.phone = data.phone.toString();
    }

    signUpMutation.mutate(data);
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place?.geometry?.location) {
        const fullAddress = place.formatted_address || place.name || "";
        setValue("address", fullAddress);
      }
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={googleApiKey}
      libraries={libraries}
      onLoad={() => setIsGoogleLoaded(true)}
      onError={() => {
        toast.error("Failed to load Google Maps. Using regular input.");
        setIsGoogleLoaded(true);
      }}
    >
      <div className="w-full max-w-2xl lg:py-20">
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
            register_as="first_name"
            register={register}
            errors={errors}
            validationRules={{ required: "First name is required" }}
          />

          {/* Last Name */}
          <CommonInputWrapper
            label="Last Name"
            placeholder="Enter your last name"
            register_as="last_name"
            register={register}
            errors={errors}
            validationRules={{ required: "Last name is required" }}
          />

          {/* Address with Google Autocomplete */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address <span className="text-red-500">*</span>
            </label>

            {isGoogleLoaded ? (
              <Autocomplete
                onLoad={(ac) => (autocompleteRef.current = ac)}
                onPlaceChanged={onPlaceChanged}
                options={{
                  fields: ["formatted_address", "geometry", "name"],
                  types: ["geocode", "establishment"],
                }}
              >
                <input
                  type="text"
                  placeholder="Search address..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  {...register("address", {
                    required: "Address is required",
                  })}
                />
              </Autocomplete>
            ) : (
              <input
                type="text"
                placeholder="Loading address search... (or type manually)"
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                disabled
                {...register("address", {
                  required: "Address is required",
                })}
              />
            )}

            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Phone Number with Country Code Selector */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>

            <PhoneInput
              international
              defaultCountry="US"
              value={phoneValue}
              onChange={(value) =>
                setValue("phone", value, { shouldValidate: true })
              }
              placeholder="Enter phone number"
              className="phone-input-custom"
              error={errors.phone?.message}
              limitMaxLength={true}
              smartCaret={true}
              countrySelectProps={{
                className: "country-select-custom",
              }}
            />

            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

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
            register_as="password_confirmation"
            register={register}
            errors={errors}
            validationRules={{
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
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
              { label: "Camp Director", value: 2 },
              { label: "Evaluator", value: 3 },
              { label: "Referee", value: 4 },
            ]}
            validationRules={{
              required: "Role is required",
            }}
          />

          <div className="flex items-start gap-3 mt-3">
            <input
              type="checkbox"
              {...register("agree", {
                required: "You must agree to the terms and conditions",
              })}
              className="w-5 h-5 accent-primary mt-0.5 flex-shrink-0"
            />
            <p className="text-sm text-neutral-600">
              I agree to the{" "}
              <a
                href="/terms-conditions"
                className="text-primary font-medium hover:underline"
              >
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a
                href="/privacy-policy"
                className="text-primary font-medium hover:underline"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
          {errors.agree && (
            <p className="text-red-500 text-sm mt-1">{errors.agree.message}</p>
          )}

          {/* Receive SMS Notifications */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              {...register("receive_sms_notifications")}
              className="w-5 h-5 accent-primary mt-0.5 flex-shrink-0"
            />
            <p className="text-sm text-neutral-600">
              I agree to receive <span className="font-semibold">SMS</span>{" "}
              notifications about{" "}
              <span className="font-semibold">
                game assignments, schedule changes, and camp updates
              </span>
              . Message frequency varies. Msg & data rates may apply. Reply STOP
              to opt out.
            </p>
          </div>

          {/* Submit Button */}
          <CommonSubmitBtn
            disabled={signUpMutation.isPending}
            variant="primary"
            type="submit"
            className="w-full"
          >
            {signUpMutation.isPending ? <LoaderV2 /> : "Sign Up"}
          </CommonSubmitBtn>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-neutral-600 mt-6">
          Already have an account?{" "}
          <a
            href="/auth/signin"
            className="text-primary font-medium hover:underline"
          >
            Sign In
          </a>
        </p>
      </div>

      {/* Add custom styles for phone input */}
      <style>{`
        .phone-input-custom {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 1rem;
        }
        .phone-input-custom:focus {
          outline: none;
          border-color: #3b82f6;
          ring: 2px solid #3b82f6;
        }
        .phone-input-custom .PhoneInputCountry {
          margin-right: 0.5rem;
        }
        .country-select-custom {
          padding: 0.5rem;
          border-radius: 0.375rem;
        }
      `}</style>
    </LoadScript>
  );
};

export default SignUp;
