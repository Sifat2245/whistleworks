import { Link } from "react-router-dom";
import Loader from "@/components/common/Loader";
import { cn } from "@/lib/utils";

const CommonSubmitBtn = ({
  children,
  type = "submit",
  link = false,
  className,
  path = "",
  isLoading = false,
  onClick,
  variant = "primary", // new prop
}) => {
  // Variant styles
  const variantClasses = {
    primary:
      "bg-primary hover:bg-transparent border border-primary hover:border-1 text-white hover:text-primary transition px-4 py-3 rounded-lg",
    secondary:
      "bg-transparent hover:bg-primary text-primary hover:text-white border border-primary transition px-4 py-3 rounded-lg",
    danger:
      "bg-red-600 hover:bg-red-700 text-white transition px-4 py-2 rounded-lg",
    outline:
      "border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition",
  };

  const baseClasses =
    "inline-flex font-medium cursor-pointer text-center justify-center items-center";

  const combinedClasses = cn(baseClasses, variantClasses[variant], className);

  // Conditional render
  if (link) {
    return (
      <Link to={path} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={cn(
        combinedClasses,
        isLoading ? "opacity-70 cursor-not-allowed" : ""
      )}
    >
      {isLoading ? (
        <Loader size={28} color="white" speed={1} />
      ) : (
        children
      )}
    </button>
  );
};

export default CommonSubmitBtn;
