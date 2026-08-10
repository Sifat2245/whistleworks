import RankingReportTable from "@/page/dashboard/campDetailsPage/ranking-report/components/RankingReportTable";

export default function RankingReport({ camp_id, campName, sports_type_name }) {
  return (
    <section>
      <h2 className="text-3xl font-medium mb-4">
        Ranking - {campName}
      </h2>
      <p className="text-[#666666] mb-5">
        Performance rankings based on evaluation scores
      </p>
      <RankingReportTable
        camp_id={camp_id}
        sports_type_name={sports_type_name}
      />
    </section>
  );
}