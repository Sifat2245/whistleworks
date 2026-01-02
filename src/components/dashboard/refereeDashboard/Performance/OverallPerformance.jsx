// components/dashboard/refereeDashboard/Performance/OverallPerformance.jsx
import { Spin } from "antd";
import Icon from "@/components/common/Icon";
import carveArrow from "@/assets/svg/creve-arrow.svg";

export default function OverallPerformance({ evaluations = [], isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-primary p-5 rounded-[10px] flex justify-center items-center">
        <Spin />
      </div>
    );
  }

  if (evaluations.length === 0) {
    return (
      <div className="bg-primary p-5 rounded-[10px]">
        <h3 className="text-xl font-medium text-white">Overall Performance</h3>
        <p className="text-white mt-4">No evaluations yet</p>
      </div>
    );
  }

  const overallAvg =
    evaluations.reduce((sum, ev) => sum + ev.average_score, 0) / evaluations.length;

  const percentage = ((overallAvg / 10) * 100).toFixed(0);

  return (
    <div className="bg-primary p-5 rounded-[10px]">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium text-white">Overall Performance</h3>
        <Icon src={carveArrow} className="size-7 text-white" />
      </div>
      <p className="text-[30px] font-medium text-white mt-4 mb-2">
        {overallAvg.toFixed(1)}<span className="text-xl">/10</span>
      </p>
      <p className="text-white">
        {percentage >= 80 ? "Excellent" : percentage >= 60 ? "Good" : "Needs Improvement"} • Top{" "}
        {100 - Math.round(percentage)}%
      </p>
    </div>
  );
}