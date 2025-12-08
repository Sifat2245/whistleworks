import BackBtn from "@/components/common/BackBtn";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

const RankingReport = () => {
  const { referee } = useParams();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ["rankings"],
    queryFn: async () => {
      const res = await axios.get("/rankingData.json");
      return res.data;
    },
  });

  const refereeData = data?.filter((d) => d.referee === referee);

  // MATCH THE COLUMNS
  const columns = [
    { accessorKey: "date", header: "Date/Time" },
    { accessorKey: "callAccuracy", header: "Call Accuracy" },
    { accessorKey: "comm", header: "Comm Skiz" },
    { accessorKey: "consistency", header: "Consistency" },
    { accessorKey: "mech", header: "Court P/Mech" },
    { accessorKey: "fitMob", header: "Fit/Mob" },
    {accessorKey: "gameAwareness", header: "Game Awareness"},
    {
      accessorKey: "overall",
      header: "Overall",
      cell: ({ getValue }) => (
        <span className="px-3 py-1 bg-[#E6F7FD] text-[#00AEEF] rounded-full text-sm font-semibold">
          {getValue()}
        </span>
      ),
    },
    { accessorKey: "notes", header: "Notes for Director" },
    { accessorKey: "feedback", header: "Ref Feedback" },
    { accessorKey: "recommended", header: "Recommended Level" },
    { accessorKey: "evaluator", header: "Evaluator" },
  ];

  const table = useReactTable({
    data: refereeData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full p-6">
      <BackBtn />

      {/* Header */}
      <div className="flex items-center gap-4 mt-6">
        <div className="w-16 h-16 rounded-full bg-linear-to-br from-orange-400 to-pink-400 
        flex items-center justify-center text-white text-2xl font-bold">
          {referee?.split(" ")?.map((n) => n[0]).join("")}
        </div>
        <h1 className="text-2xl font-bold">{referee}</h1>
      </div>

      {isLoading && <div className="mt-6">Loading...</div>}
      {error && <div className="mt-6 text-red-500">Error loading data</div>}

      {!isLoading && !error && refereeData.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full text-center">
            <thead className="bg-gray-50 border-b border-gray-200">
              {table?.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && !error && refereeData.length === 0 && (
        <div className="mt-6 text-gray-500">No data found for this referee.</div>
      )}
    </div>
  );
};
export default RankingReport;