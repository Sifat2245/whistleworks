import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { BsTrophy } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const Rankings = () => {
  const navigate = useNavigate();

  const handleRedirect = (referee) => {
    navigate(`/director-dashboard/ranking/${referee}`);
  };

  
  const { data = [] } = useQuery({
    queryKey: ["rankings"],
    queryFn: async () => {
      const res = await axios.get("/rankingData.json");
      return res.data;
    },
  });

  console.log(data);

  const columns = useMemo(
    () => [
      {
        accessorKey: "rank",
        header: "Rank",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <BsTrophy className="w-4 h-4 text-[#F0B100]" />
            <span className="font-medium">#{row.original.rank}</span>
          </div>
        ),
      },
      {
        accessorKey: "referee",
        header: "Referee",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="shrink-0 w-8 h-8 rounded-full bg-linear-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white text-sm font-semibold">
              {row.original.referee
                ?.split(" ")
                ?.map((n) => n[0])
                ?.join("")}
            </div>
            <span
              onClick={() => handleRedirect(row.original.referee)}
              className="font-medium hover:underline cursor-pointer"
            >
              {row.original.referee}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "overall",
        header: "Overall",
        cell: ({ getValue }) => <span className="font-semibold">{getValue()}</span>,
      },
      {
        accessorKey: "callAccuracy",
        header: "Call Accur.",
      },
      {
        accessorKey: "mech",
        header: "Mech",
      },
      {
        accessorKey: "fitMob",
        header: "Fit/Mob",
      },
      {
        accessorKey: "comm",
        header: "Comm",
      },
      {
        accessorKey: "consistency",
        header: "Consistency",
      },
      {
        accessorKey: "gA",
        header: "G/A",
      },
      {
        accessorKey: "d1",
        header: "D1",
      },
      {
        accessorKey: "d2",
        header: "D2",
      },
      {
        accessorKey: "naia",
        header: "NAIA",
      },
      {
        accessorKey: "jc",
        header: "JC",
      },
      {
        accessorKey: "hs",
        header: "HS",
      },
      {
        accessorKey: "elem",
        header: "ELEM",
      },
    ],
    [handleRedirect]
  );

    const stats = [
    { value: "8.8", label: "Avg Overall Score", color: "text-cyan-500" },
    { value: "Emily", label: "Top Performer", color: "text-green-500" },
    { value: "65", label: "Total Games", color: "text-purple-500" },
    { value: "2", label: "Improving", color: "text-orange-500" },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="my-10">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-20">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Complete Rankings</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-gray-200 bg-gray-50">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows?.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-200 hover:bg-blue-50 transition-colors text-center"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-4 text-sm text-gray-700">
                      {flexRender(cell?.column?.columnDef?.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className={`text-3xl font-bold ${stat.color} mb-2`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rankings;
