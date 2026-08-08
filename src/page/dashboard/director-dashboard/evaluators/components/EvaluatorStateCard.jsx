import { LuInbox, LuTriangleAlert, LuRefreshCw } from "react-icons/lu";
import { cn } from "@/lib/utils";

const EvaluatorStateCard = ({ type = "empty", icon: Icon, title, description }) => {
  const isError = type === "error";
  const IconComponent = isError ? LuTriangleAlert : Icon || LuInbox;

  return (
    <div
      className={cn(
        "rounded-2xl border py-14 px-6 text-center",
        isError ? "bg-red-50/60 border-red-200" : "bg-white border-dashed border-border",
      )}
    >
      <div
        className={cn(
          "w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4",
          isError ? "bg-red-100" : "bg-slate-50",
        )}
      >
        <IconComponent
          className={cn("w-8 h-8", isError ? "text-red-400" : "text-slate-300")}
        />
      </div>
      <h3 className="text-base font-semibold text-[#333]">{title}</h3>
      <p className="text-sm text-[#666] mt-1.5 max-w-xs mx-auto leading-relaxed">
        {description}
      </p>
      {isError && (
        <button
          onClick={() => window.location.reload()}
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          <LuRefreshCw className="w-4 h-4" /> Retry
        </button>
      )}
    </div>
  );
};

export default EvaluatorStateCard;
