import RankingReportTable from "@/page/dashboard/campDetailsPage/ranking-report/components/RankingReportTable";

export default function RankingReport({ camp_id, campName, sports_type_name }) {
  return (
    <section className="py-2 sm:py-4">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-2 sm:mb-4 text-slate-900">
        Ranking - {campName}
      </h2>
      <p className="text-sm sm:text-base text-[#666666] mb-4 sm:mb-5">
        Performance rankings based on evaluation scores
      </p>
      <RankingReportTable
        camp_id={camp_id}
        sports_type_name={sports_type_name}
      />
    </section>
  );
}