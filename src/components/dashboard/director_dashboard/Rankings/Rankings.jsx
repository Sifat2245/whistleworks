import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { BsTrophy } from "react-icons/bs";

const Rankings = () => {
  const data = useMemo(
    () => [
      {
        rank: 1,
        referee: "Emily Chen",
        overall: 9.5,
        callAccuracy: 7.5,
        mech: 6.5,
        fitMob: 8.5,
        comm: 8.5,
        consistency: 8.5,
        gA: 8.5,
        d1: 4,
        d2: 4,
        naia: 7,
        jc: 7,
        hs: 5,
        elem: 2,
      },
      {
        rank: 2,
        referee: "Emily Chen",
        overall: 9.5,
        callAccuracy: 7.5,
        mech: 6.5,
        fitMob: 8.5,
        comm: 8.5,
        consistency: 8.5,
        gA: 8.5,
        d1: 4,
        d2: 4,
        naia: 7,
        jc: 7,
        hs: 5,
        elem: 2,
      },
      {
        rank: 3,
        referee: "Emily Chen",
        overall: 9.5,
        callAccuracy: 7.5,
        mech: 6.5,
        fitMob: 8.5,
        comm: 8.5,
        consistency: 8.5,
        gA: 8.5,
        d1: 4,
        d2: 4,
        naia: 7,
        jc: 7,
        hs: 5,
        elem: 2,
      },
      {
        rank: 4,
        referee: "Emily Chen",
        overall: 9.5,
        callAccuracy: 7.5,
        mech: 6.5,
        fitMob: 8.5,
        comm: 8.5,
        consistency: 8.5,
        gA: 8.5,
        d1: 4,
        d2: 4,
        naia: 7,
        jc: 7,
        hs: 5,
        elem: 2,
      },
      {
        rank: 5,
        referee: "Emily Chen",
        overall: 9.5,
        callAccuracy: 7.5,
        mech: 6.5,
        fitMob: 8.5,
        comm: 8.5,
        consistency: 8.5,
        gA: 8.5,
        d1: 4,
        d2: 4,
        naia: 7,
        jc: 7,
        hs: 5,
        elem: 2,
      },
    ],
    []
  );

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
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white text-sm font-semibold">
              EC
            </div>
            <span className="font-medium">{row.original.referee}</span>
          </div>
        ),
      },
      {
        accessorKey: "overall",
        header: "Overall",
        cell: ({ getValue }) => (
          <span className="font-semibold">{getValue()}</span>
        ),
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
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const stats = [
    { value: "8.8", label: "Avg Overall Score", color: "text-cyan-500" },
    { value: "Emily", label: "Top Performer", color: "text-green-500" },
    { value: "65", label: "Total Games", color: "text-purple-500" },
    { value: "2", label: "Improving", color: "text-orange-500" },
  ];

  return (
    <div className="mt-10">
      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-20">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Complete Rankings</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-gray-200 bg-gray-50"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
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
                      className="px-4 py-4 text-sm text-gray-700"
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
