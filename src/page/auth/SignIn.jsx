import { useForm } from "react-hook-form";
import CommonText from "@/components/common/CommonText";
import CommonTitle from "@/components/common/CommonTitle";
import CommonInputWrapper from "@/components/common/CommonInputWrapper";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import LoaderV2 from "@/components/common/LoaderV2";
import { useAuth } from "@/hooks/useAuth";
import { useSignIn } from "@/hooks/api/useAuth";
import { getErrorMessage } from "@/utils/formErrors";

const SignIn = () => {
  const { handleLogin, userRefetch } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const getCampIdFromFromPath = () => {
    const from = location.state?.from || "";
    const match = from.match(/\/camp\/details\/(\d+)/);
    return match ? match[1] : null;
  };

  // Note: redirect function
  const redirectAfterLogin = (userRole, campId) => {
    const role = userRole?.toLowerCase();

    if (campId) {
      if (role === "evaluator") {
        navigate(`/evaluator-dashboard/camp/${campId}?tab=camp-details`);
        return;
      }
      if (role === "referee") {
        navigate(`/referee-dashboard/camp/${campId}?tab=camp-details`);
        return;
      }
      if (role === "director") {
        navigate(`/director-dashboard/camp-overview/${campId}`);
        return;
      }
    }

    if (!role) {
      navigate("/");
      return;
    }
    if (role === "director") {
      navigate("/director-dashboard");
    } else if (role === "evaluator") {
      navigate("/evaluator-dashboard");
    } else if (role === "referee") {
      navigate("/referee-dashboard");
    } else {
      navigate("/");
    }
  };

  // Note: sign in mutation
  const signInMutation = useSignIn({
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Sign in successful");
      handleLogin(res?.data?.data?.token);
      userRefetch();
      const campId = getCampIdFromFromPath();
      setTimeout(() => {
        redirectAfterLogin(res?.data?.data?.user?.role, campId);
      }, 1000);
    },
    onError: (err, variables) => {
      // ← second param = the data you sent (form values)
      const errorResponse = err?.response?.data;

      if (
        errorResponse?.code === 403 &&
        errorResponse?.data?.is_otp_verified === false
      ) {
        toast.error("Please verify your email first");

        // variables = the object you passed to mutate() → { email, password, rememberMe }
        const email = variables?.email;
        if (email) {
          sessionStorage.setItem("verify_email", email);
        }

        navigate("/auth/verify-otp");
        return;
      }

      const displayMessage = getErrorMessage(err, setError, "Sign in failed");
      toast.error(displayMessage);
    },
  });
  const onSubmit = (data) => {
    // console.log("Sign In Data:", data);
    clearErrors();
    signInMutation.mutate(data);
  };

  // Note: main ui component
  return (
    <div className="w-full">
      <div className="text-center space-y-1 mb-6">
        <CommonTitle
          text="Welcome Back"
          className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900"
        />
        <CommonText
          text="Sign in to access your Whistle Works dashboard"
          className="text-xs sm:text-sm text-gray-500"
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            onChange: () => {
              if (errors.email) clearErrors("email");
            },
          }}
        />

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
            onChange: () => {
              if (errors.password) clearErrors("password");
            },
          }}
        />

        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="w-4 h-4 accent-primary"
            />
            Remember me
          </label>

          <a
            href="/auth/forget-password"
            className="text-primary text-sm font-medium hover:underline"
          >
            Forgot Password?
          </a>
        </div>

        {/* path="/director-dashboard" */}
        <CommonSubmitBtn
          variant="primary"
          type="submit"
          className="w-full"
          disabled={signInMutation.isPending}
        >
          {signInMutation.isPending ? <LoaderV2 /> : "Sign In"}
        </CommonSubmitBtn>
      </form>

      {/* OR Separator */}
      {/* <div className="flex items-center gap-4 my-6">
        <div className="grow h-px bg-neutral-300"></div>
        <span className="text-neutral-500 text-sm font-medium">or</span>
        <div className="grow h-px bg-neutral-300"></div>
      </div>

      <SocialLogin /> */}

      <p className="text-center text-sm text-neutral-600 mt-6">
        Don’t have an account?{" "}
        <a
          href="/auth/signup"
          className="text-primary font-medium hover:underline"
        >
          Sign Up
        </a>
      </p>
    </div>
  );
};

export default SignIn;
