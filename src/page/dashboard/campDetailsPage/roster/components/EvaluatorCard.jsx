import { LuMail, LuPhone, LuUserCheck } from "react-icons/lu";

const formatPhone = (phone) => {
  if (!phone) return "N/A";
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 10) {
    return digits.length === 0 ? "N/A" : digits;
  }
  const areaCode = digits.slice(0, 3);
  const part1 = digits.slice(3, 6);
  const part2 = digits.slice(6, 10);
  return `(${areaCode}) ${part1}-${part2}`;
};

const EvaluatorCard = ({ evaluator, onCardClick }) => {
  const isPhoneVisible =
    (evaluator?.isPhoneShow ?? evaluator?.is_phone_show) !== false &&
    (evaluator?.phone || evaluator?.evaluatorNumber);

  const phoneText = isPhoneVisible
    ? formatPhone(evaluator?.phone || evaluator?.evaluatorNumber)
    : "—";

  return (
    <div
      onClick={() => onCardClick?.(evaluator)}
      className="group bg-white rounded-xl border border-[#E8E8E8] shadow-xs hover:shadow-md hover:border-[#00AEEF]/50 p-5 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden cursor-pointer"
    >
      {/* Radial Cyan Glow Hover Effect */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,rgba(0,175,239,0.25),rgba(0,175,239,0.08),transparent_70%)] z-0" />

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Avatar Box */}
        <div className="relative mb-3.5 mt-1">
          <img
            src={evaluator?.avatar || evaluator?.image || "/default-avatar.png"}
            alt={evaluator?.name || "Evaluator"}
            className="w-20 h-20 rounded-full object-cover border-2 border-slate-100 shadow-sm group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = "/default-avatar.png";
            }}
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#00AEEF] text-white rounded-full flex items-center justify-center text-xs shadow-xs border-2 border-white">
            <LuUserCheck />
          </div>
        </div>

        {/* Name & Badge */}
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 group-hover:text-[#00AEEF] transition-colors leading-snug line-clamp-1 mb-1">
          {evaluator?.name || "Unnamed Evaluator"}
        </h3>

        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#00AEEF] border border-blue-100 mb-4">
          Evaluator Staff
        </span>

        {/* Contact Details */}
        <div className="w-full pt-3 border-t border-[#E8E8E8] space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center justify-center gap-2 truncate">
            <LuMail className="text-slate-400 text-sm shrink-0" />
            <span className="truncate">{evaluator?.email || evaluator?.evaluatorMail || "N/A"}</span>
          </div>

          <div className="flex items-center justify-center gap-2 truncate">
            <LuPhone className="text-slate-400 text-sm shrink-0" />
            <span className="tracking-wide font-medium">{phoneText}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluatorCard;
