import { Card, Avatar } from "antd";
import profile from "@/assets/dashboard/profile.png";

const EvaluatorCard = ({ evaluator }) => {
  const formatPhone = (phone) => {
    if (!phone) return "N/A";

    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, "");

    // If we don't have exactly 10 digits → return original digits or N/A
    if (digits.length !== 10) {
      return digits.length === 0 ? "N/A" : digits;
    }

    // Format as (xxx) xxx-xxxx
    const areaCode = digits.slice(0, 3);
    const part1 = digits.slice(3, 6);
    const part2 = digits.slice(6, 10);

    return `(${areaCode}) ${part1}-${part2}`;
  };

  return (
    <Card
      hoverable
      className="group relative overflow-hidden rounded-xl border border-black/10 shadow-sm transition-all duration-300"
    >
      {/* CENTER GRADIENT OVERLAY */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 
        bg-[radial-gradient(circle_at_center,rgba(0,175,239,0.35),rgba(0,175,239,0.10),transparent_70%)]"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-3">
        <Avatar
          size={80}
          src={evaluator?.avatar || profile}
          alt={evaluator?.name || "Evaluator"}
        />

        <div className="space-y-1">
          <h3 className="text-lg font-medium text-black">
            {evaluator?.name || "Unnamed Evaluator"}
          </h3>

          <p className="text-sm text-gray-500">
            <span className="font-medium text-[#444]">Email:</span>{" "}
            {evaluator?.email || "N/A"}
          </p>

          <p className="text-sm text-gray-500">
            <span className="font-medium text-[#444]">Phone:</span>{" "}
            <span className="tracking-wide font-medium">
              {(evaluator?.isPhoneShow ?? evaluator?.is_phone_show) !== false && evaluator?.phone ? formatPhone(evaluator?.phone) : "-"}
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
};

export default EvaluatorCard;
