import { FcGoogle } from "react-icons/fc";

const SocialLogin = ({ onGoogleLogin }) => {
  return (
    <div className="w-full">
      <button
        type="button"
        onClick={onGoogleLogin}
        className="w-full flex items-center justify-center gap-3 border border-neutral-300 rounded-xl py-3 bg-white hover:bg-neutral-50 transition-all duration-300 shadow-sm cursor-pointer"
      >
        <FcGoogle className="text-2xl" />
        <span className="text-neutral-700 font-medium">
          Continue with Google
        </span>
      </button>
    </div>
  );
};

export default SocialLogin;
