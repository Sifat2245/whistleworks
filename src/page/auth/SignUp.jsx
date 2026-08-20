import { useForm } from "react-hook-form";
import CommonInputWrapper from "@/components/common/CommonInputWrapper";
import CommonText from "@/components/common/CommonText";
import CommonTitle from "@/components/common/CommonTitle";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import LoaderV2 from "@/components/common/LoaderV2";
import { useSignUp } from "@/hooks/api/useAuth";
import { LuShieldCheck, LuClipboardCheck, LuUser } from "react-icons/lu";

// Google Maps Autocomplete
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { useRef, useEffect } from "react";

// Phone number input
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const libraries = ["places"];

const roles = [
  {
    id: 2,
    title: "Camp Director",
    desc: "Manage camps & schedules",
    Icon: LuShieldCheck,
  },
  {
    id: 3,
    title: "Evaluator",
    desc: "Evaluate referee performance",
    Icon: LuClipboardCheck,
  },
  {
    id: 4,
    title: "Referee",
    desc: "Join camps & officiate games",
    Icon: LuUser,
  },
];

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded: isGoogleLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleApiKey || "",
    libraries,
  });

  const autocompleteRef = useRef(null);

  // React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      receive_sms_notifications: false,
      phone: "",
      role: 4, // Default to Referee
    },
  });

  const password = watch("password");
  const phoneValue = watch("phone");
  const selectedRole = watch("role");

  useEffect(() => {
    register("role", { required: "Please select a role" });
  }, [register]);

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
  const signUpMutation = useSignUp({
    onSuccess: (res) => {
      const data = res?.data;
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

    if (data.role) {
      data.role = Number(data.role);
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
    <div className="w-full">
      {/* Header */}
      <div className="text-center space-y-1 mb-4">
        <CommonTitle
          text="Create an Account"
          className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900"
        />
        <CommonText
          text="Join Whistle Works to manage referee camps"
          className="text-xs sm:text-sm text-gray-500"
        />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        {/* Role Select Cards */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-800">
            Select Your Role <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {roles.map((roleItem) => {
              const isSelected = Number(selectedRole) === roleItem.id;
              const IconComponent = roleItem.Icon;
              return (
                <div
                  key={roleItem.id}
                  onClick={() =>
                    setValue("role", roleItem.id, { shouldValidate: true })
                  }
                  className={`cursor-pointer rounded-xl p-2.5 sm:p-3 border-2 transition-all duration-200 flex flex-col items-center text-center justify-between select-none ${
                    isSelected
                      ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-xs"
                      : "border-gray-200 bg-gray-50/60 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center mb-1 transition-colors ${
                      isSelected
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <IconComponent className="text-base sm:text-lg" />
                  </div>
                  <div>
                    <p
                      className={`font-semibold text-xs sm:text-sm leading-tight ${
                        isSelected ? "text-primary" : "text-gray-900"
                      }`}
                    >
                      {roleItem.title}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5 leading-tight hidden xs:block">
                      {roleItem.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          {errors.role && (
            <p className="text-red-500 text-[11px] font-medium">
              {errors.role.message}
            </p>
          )}
        </div>

        {/* Input Fields Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3.5 gap-y-2.5">
          {/* First Name */}
          <CommonInputWrapper
            label="First Name"
            placeholder="First name"
            register_as="first_name"
            register={register}
            errors={errors}
            wrapperClass="gap-0.5"
            labeClass="text-xs font-medium"
            inputClass="py-2 px-3.5 text-xs sm:text-sm h-9 sm:h-10"
            validationRules={{ required: "First name is required" }}
          />

          {/* Last Name */}
          <CommonInputWrapper
            label="Last Name"
            placeholder="Last name"
            register_as="last_name"
            register={register}
            errors={errors}
            wrapperClass="gap-0.5"
            labeClass="text-xs font-medium"
            inputClass="py-2 px-3.5 text-xs sm:text-sm h-9 sm:h-10"
            validationRules={{ required: "Last name is required" }}
          />

          {/* Email */}
          <CommonInputWrapper
            label="Email"
            type="email"
            placeholder="Email address"
            register_as="email"
            register={register}
            errors={errors}
            wrapperClass="gap-0.5"
            labeClass="text-xs font-medium"
            inputClass="py-2 px-3.5 text-xs sm:text-sm h-9 sm:h-10"
            validationRules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Valid email required",
              },
            }}
          />

          {/* Phone Number */}
          <div className="relative flex flex-col gap-0.5">
            <label className="block text-xs font-medium text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </label>

            <PhoneInput
              international
              defaultCountry="US"
              value={phoneValue}
              onChange={(value) =>
                setValue("phone", value, { shouldValidate: true })
              }
              placeholder="Phone number"
              className="phone-input-custom"
              error={errors.phone?.message}
              limitMaxLength={true}
              smartCaret={true}
              countrySelectProps={{
                className: "country-select-custom",
              }}
            />

            {errors.phone && (
              <p className="text-red-500 text-[11px]">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Address with Google Autocomplete - Full Width */}
          <div className="relative sm:col-span-2 flex flex-col gap-0.5">
            <label className="block text-xs font-medium text-gray-700">
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
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-xs sm:text-sm h-9 sm:h-10"
                  {...register("address", {
                    required: "Address is required",
                  })}
                />
              </Autocomplete>
            ) : (
              <input
                type="text"
                placeholder="Type address..."
                className="w-full px-3.5 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 text-xs sm:text-sm h-9 sm:h-10"
                {...register("address", {
                  required: "Address is required",
                })}
              />
            )}

            {errors.address && (
              <p className="text-red-500 text-[11px]">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Password */}
          <CommonInputWrapper
            label="Password"
            type="password"
            placeholder="Password"
            register_as="password"
            register={register}
            errors={errors}
            wrapperClass="gap-0.5"
            labeClass="text-xs font-medium"
            inputClass="py-2 px-3.5 text-xs sm:text-sm h-9 sm:h-10"
            validationRules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "At least 6 characters",
              },
            }}
          />

          {/* Confirm Password */}
          <CommonInputWrapper
            label="Confirm Password"
            type="password"
            placeholder="Confirm password"
            register_as="password_confirmation"
            register={register}
            errors={errors}
            wrapperClass="gap-0.5"
            labeClass="text-xs font-medium"
            inputClass="py-2 px-3.5 text-xs sm:text-sm h-9 sm:h-10"
            validationRules={{
              required: "Confirm password",
              validate: (value) =>
                value === password || "Passwords do not match",
            }}
          />
        </div>

        {/* Checkboxes */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              {...register("agree", {
                required: "You must agree to terms",
              })}
              className="w-4 h-4 accent-primary mt-0.5 flex-shrink-0 cursor-pointer"
            />
            <p className="text-[11px] sm:text-xs text-neutral-600 leading-tight">
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
            <p className="text-red-500 text-[11px]">{errors.agree.message}</p>
          )}

          {/* Receive SMS Notifications */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              {...register("receive_sms_notifications")}
              className="w-4 h-4 accent-primary mt-0.5 flex-shrink-0 cursor-pointer"
            />
            <p className="text-[11px] sm:text-xs text-neutral-600 leading-tight">
              I agree to receive <span className="font-semibold">SMS</span> notifications about game assignments & camp updates. Reply STOP to opt out.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <CommonSubmitBtn
          disabled={signUpMutation.isPending}
          variant="primary"
          type="submit"
          className="w-full py-2.5 text-sm font-medium shadow-md mt-1"
        >
          {signUpMutation.isPending ? <LoaderV2 /> : "Sign Up"}
        </CommonSubmitBtn>
      </form>

      {/* Footer */}
      <p className="text-center text-xs text-neutral-600 mt-3">
        Already have an account?{" "}
        <a
          href="/auth/signin"
          className="text-primary font-semibold hover:underline"
        >
          Sign In
        </a>
      </p>

      {/* Custom styles for phone input */}
      <style>{`
        .phone-input-custom {
          width: 100%;
          padding: 0.375rem 0.625rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.8125rem;
          height: 2.375rem;
        }
        .phone-input-custom:focus {
          outline: none;
          border-color: #00AEEF;
          ring: 1px solid #00AEEF;
        }
        .phone-input-custom .PhoneInputCountry {
          margin-right: 0.375rem;
        }
        .country-select-custom {
          padding: 0.25rem;
          border-radius: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default SignUp;
