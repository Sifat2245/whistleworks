import { useForm } from "react-hook-form";
import CommonInputWrapper from "@/components/common/CommonInputWrapper";
import CommonText from "@/components/common/CommonText";
import CommonTitle from "@/components/common/CommonTitle";
import SocialLogin from "./SocialLogin";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import { useMutation } from "@tanstack/react-query";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import LoaderV2 from "@/components/common/LoaderV2";

// ── Google Maps Autocomplete ──────────────────────────────────────────────
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { useState, useRef } from "react";

const libraries = ["places"];

const SignUp = () => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const location = useLocation();

  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Track Google Maps script load state
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  const autocompleteRef = useRef(null);

  // Note: react hook form
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm();
  const password = watch("password");

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

  // Note: sign up mutation
  const signUpMutation = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: async (formData) => {
      const response = await axiosPublic.post(`/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      return response?.data;
    },
    onSuccess: (data) => {
      console.log("Sign up data:", data);
      toast.success(data?.message || "Sign up successful");

      sessionStorage.setItem("verify_email", data?.data?.email);
      sessionStorage.setItem("testing_purpose_otp", data?.data?.otp);

      const campId = getCampIdFromFromPath();
      saveIntendedCampRedirect(campId);

      navigate("/auth/verify-otp");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Sign up failed");
    },
  });

  const onSubmit = (data) => {
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

  // Note: main ui component
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

          {/* Address - Google Places Autocomplete */}
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
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>

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
            register_as="password_confirmation"
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
              { label: "Camp Director", value: 2 },
              { label: "Evaluator", value: 3 },
              { label: "Referee", value: 4 },
            ]}
            validationRules={{
              required: "Role is required",
            }}
          />

          {/* Agree Terms */}
          <div className="flex items-start gap-2 mt-3">
            <input
              type="checkbox"
              {...register("agree", {
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
          {errors.agree && (
            <p className="text-red-500 text-sm mt-1">
              {errors.agree.message}
            </p>
          )}

          {/* Submit Button */}
          <CommonSubmitBtn disabled={signUpMutation.isPending} variant="primary" type="submit" className="w-full">
            {signUpMutation.isPending ? <LoaderV2 /> : "Sign Up"}
          </CommonSubmitBtn>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-neutral-600 mt-6">
          Already have an account?{" "}
          <a href="/auth/signin" className="text-primary font-medium hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </LoadScript>
  );
};

export default SignUp;