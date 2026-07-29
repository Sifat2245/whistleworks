import { cn } from "@/lib/utils";


export default function RankingReportCard({ colorClass, title, value }) {
  return (
    <div className="border  border-border p-4 rounded-xl">
        <p className={cn("text-2xl font-normal mb-6", colorClass)}>{value}</p>
        <p className="text-[14px] text-[#45556C]">{title}</p>
    </div>
  )
}
