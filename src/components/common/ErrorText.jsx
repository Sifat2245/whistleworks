import { cn } from "@/lib/utils";

const ErrorText = ({ error = "", className = "" }) => {
    return (
        <p className={cn("text-sm text-red-500", className)}>{error}</p>
    );
};
export default ErrorText;