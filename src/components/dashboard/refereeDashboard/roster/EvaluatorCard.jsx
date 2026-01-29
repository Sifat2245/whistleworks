import { Card, Avatar } from "antd";
import profile from "@/assets/dashboard/profile.png";

const EvaluatorCard = ({ evaluator }) => {
  const formatPhone = (phone) => {
    if (!phone) return "N/A";

    // Remove all non-digits
    let digits = phone.replace(/\D/g, "");

    // Convert international (+880...) or 88... to local style with leading 0
    if (digits.startsWith("880")) {
      digits = "0" + digits.slice(3);
    } else if (digits.startsWith("88")) {
      digits = "0" + digits.slice(2);
    }

    if (digits.length === 11 && digits.startsWith("0")) {
      return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
    }

    if (digits.length === 10) {
      return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`;
    }

    let formatted = "";
    let i = digits.length;
    while (i > 0) {
      const chunk = Math.min(4, i);
      formatted =
        digits.slice(i - chunk, i) + (formatted ? " " + formatted : "");
      i -= chunk;
    }

    return formatted.trim() || "N/A";
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
              {formatPhone(evaluator?.phone)}
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
};

export default EvaluatorCard;
