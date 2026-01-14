import { useForm } from "react-hook-form";
import CommonText from "@/components/common/CommonText";
import CommonTitle from "@/components/common/CommonTitle";
import CommonInputWrapper from "@/components/common/CommonInputWrapper";
import SocialLogin from "./SocialLogin";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import { useMutation } from "@tanstack/react-query";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import LoaderV2 from "@/components/common/LoaderV2";
import { useAuth } from "@/hooks/useAuth";

const SignIn = () => {
  const { handleLogin, userRefetch } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
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
  const signInMutation = useMutation({
    mutationKey: ["sign-in"],
    mutationFn: async (data) => {
      const response = await axiosPublic.post(`/login`, data);
      return response?.data;
    },
    onSuccess: (res) => {
      toast.success(res?.message || "Sign in successful");

      handleLogin(res?.data?.token);
      userRefetch();
      const campId = getCampIdFromFromPath();

      setTimeout(() => {
        redirectAfterLogin(res?.data?.user?.role, campId);
      }, 1000);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Sign in failed");
    },
  });

  const onSubmit = (data) => {
    console.log("Sign In Data:", data);
    signInMutation.mutate(data);
  };

  // Note: main ui component
  return (
    <div className="w-full max-w-2xl">
      <div className="text-center space-y-3 mb-8">
        <CommonTitle text="Welcome Back" />
        <CommonText text="Sign in to access your dashboard" />
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
