import RankingReportTable from "@/components/dashboard/evaluatorDashboard/rankingReport/RankingReportTable";

export default function RankingReport({ camp_id }) {
  return (
    <section>
      <h2 className="text-3xl font-medium mb-4">
        Ranking - Elite Officials Summer Camp 2024
      </h2>
      <p className="text-[#666666] mb-5">
        Performance rankings based on evaluation scores
      </p>
      <RankingReportTable camp_id={camp_id} />
    </section>
  );
}