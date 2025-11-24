import Icon from "@/components/common/Icon";
import setting from "@/assets/svg/setting.svg";
import RankingReportTable from "@/components/dashboard/evaluatorDashboard/rankingReport/RankingReportTable";

export default function RankingReport() {
  return (
    <section>
      <div className="flex justify-end">
        <button className="bg-primary p-2.5 w-fit rounded-full cursor-pointer">
          <Icon src={setting} className="size-5 text-white" />
        </button>
      </div>
      <h2 className="text-3xl font-medium mb-4">
        Ranking - Elite Officials Summer Camp 2024
      </h2>
      <p className="text-[#666666] mb-5">
        Performance rankings based on evaluation scores
      </p>
      <RankingReportTable />
    </section>
  );
}
