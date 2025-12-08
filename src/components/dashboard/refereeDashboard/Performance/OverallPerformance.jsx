import Icon from "@/components/common/Icon";
import carveArrow from "@/assets/svg/creve-arrow.svg";

export default function OverallPerformance() {
  return (
    <div className="bg-primary p-5 rounded-[10px]">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium text-white">Overall Performance</h3>
        <Icon src={carveArrow} className="size-7 text-white" />
      </div>
      <p className="text-[30px] font-medium text-white mt-4 mb-2">
        9.5<span className="text-xl">/10</span>
      </p>
      <p className="text-white">Above average • Top 15%</p>
    </div>
  );
}
