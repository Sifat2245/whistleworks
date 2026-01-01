import Icon from "@/components/common/Icon";
import setting from "@/assets/svg/setting.svg";
import RankingReportTable from "@/components/dashboard/evaluatorDashboard/rankingReport/RankingReportTable";

export default function RankingReport({ camp_id }) {
  return (
    <section>
      <div className="flex justify-end">
        {/* <button className="bg-primary p-2.5 w-fit rounded-full cursor-pointer">
          <Icon src={setting} className="size-5 text-white" />
        </button> */}
      </div>
      <h2 className="text-3xl font-medium mb-4">
        Ranking - Elite Officials Summer Camp 2024
      </h2>
      <p className="text-[#666666] mb-5">
        Performance rankings based on evaluation scores
      </p>
      <RankingReportTable camp_id={camp_id} />
      {/* <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RankingReportCard
          colorClass="text-primary"
          title="Avg Overall Score"
          value="8.8"
        />
        <RankingReportCard
          colorClass="text-[#00A63E]"
          title="Top Performer"
          value="Emily"
        />
        <RankingReportCard
          colorClass="text-[#9810FA]"
          title="Total Games"
          value="65"
        />
        <RankingReportCard
          colorClass="text-[#F54900]"
          title="Improving"
          value="2"
        />
      </div> */}
    </section>
  );
}