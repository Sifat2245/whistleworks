import { Card, Avatar } from "antd";
import profile from "@/assets/dashboard/profile.png";

const EvaluatorCard = ({ evaluator }) => {
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
        />

        <div className="space-y-1">
          <h3 className="text-lg font-medium text-black">
            {evaluator?.name}
          </h3>

          <p className="text-sm text-gray-500">
            <span className="font-medium text-[#444]">Email:</span>{" "}
            {evaluator?.email || "N/A"}
          </p>

          <p className="text-sm text-gray-500">
            <span className="font-medium text-[#444]">Phone:</span>{" "}
            {evaluator?.phone || "N/A"}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default EvaluatorCard;
