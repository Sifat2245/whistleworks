import { Image } from "antd";
import location from "@/assets/svg/location.svg";
import email from "@/assets/svg/email.svg";
import phone from "@/assets/svg/phone.svg";
import Icon from "@/components/common/Icon";
import profile from "@/assets/dashboard/profile.png";

const EvaluatorCard = ({ evaluator }) => {
  return (
    <div className="border border-border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition">
      {/* Avatar + Name */}
      <div className="flex items-center gap-4 mb-4 shrink-0">
        <Image
          src={evaluator?.avatar || profile}
          alt={evaluator?.name}
          width={56}
          height={56}
          preview={false}
          className="rounded-full object-cover shrink-0"
        />
        <div>
          <h3 className="text-base font-semibold leading-tight">
            {evaluator?.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            Evaluator
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2 text-sm text-[#666666]">
        <p className="flex items-start gap-2">
          <Icon src={location} className="size-4 shrink-0 mt-0.5" />
          <span>{evaluator?.address || "N/A"}</span>
        </p>

        <p className="flex items-start gap-2">
          <Icon src={email} className="size-4 shrink-0 mt-0.5" />
          <span className="break-all">{evaluator?.email}</span>
        </p>

        <p className="flex items-start gap-2">
          <Icon src={phone} className="size-4 shrink-0 mt-0.5" />
          <span>{evaluator?.phone}</span>
        </p>
      </div>
    </div>
  );
}
export default EvaluatorCard;