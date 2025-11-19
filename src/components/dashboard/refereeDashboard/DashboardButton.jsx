import Icon from "@/components/common/Icon";
import { Link } from "react-router-dom";

export default function DashboardButton({label, iconSrc, path}) {
  return (
    <Link to={path} className="flex items-center gap-1.5 border border-border p-5 rounded-[10px] cursor-pointer hover:bg-primary ease-in-out duration-300 group">
      <div className="bg-primary p-2.5 rounded-full group-hover:bg-white">
        <Icon src={iconSrc} className="size-6 text-white group-hover:text-primary" />
      </div>
      <p className="text-lg font-medium group-hover:text-white">{label}</p>
    </Link>
  );
}
