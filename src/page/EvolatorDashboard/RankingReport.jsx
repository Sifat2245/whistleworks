import RankingReportTable from "@/components/dashboard/evaluatorDashboard/rankingReport/RankingReportTable";

export default function RankingReport({ camp_id, campName }) {
  return (
    <section>
      <h2 className="text-3xl font-medium mb-4">
        Ranking - {campName}
      </h2>
      <p className="text-[#666666] mb-5">
        Performance rankings based on evaluation scores
      </p>
      <RankingReportTable camp_id={camp_id} />
    </section>
  );
}