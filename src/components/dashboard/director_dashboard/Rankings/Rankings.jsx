/* eslint-disable no-prototype-builtins */
// Rankings.jsx
import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { BsTrophy } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Avatar } from "antd";

const Rankings = ({ campId }) => {
  const navigate = useNavigate();
  const axiosInstance = useAxiosSecure();

  const { data: evaluations = [], isLoading } = useQuery({
    queryKey: ["rankings", campId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/referee/evaluation/camp/${campId}`);
      return res?.data?.data?.evaluations || [];
    },
  });

  // Process data: Group by referee, calculate averages (rounded to whole numbers)
  const processedData = useMemo(() => {
    const refereeMap = {};

    evaluations.forEach((evalItem) => {
      const ref = evalItem.referee;
      const perf = evalItem.performance_criteria;
      const key = ref.id;

      if (!refereeMap[key]) {
        refereeMap[key] = {
          referee_id: ref.id,
          name: ref.name,
          avatar: ref.avatar,
          count: 0,
          totals: {
            call_accuracy: 0,
            communication_skills: 0,
            consistency_of_calls: 0,
            court_position_mechanics: 0,
            fitness_mobility: 0,
            game_awareness: 0,
          },
          levels: {
            "NCAA D1": 0,
            "NCAA D2": 0,
            NAIA: 0,
            JUCO: 0,
            HS: 0,
            "JH/ELEM": 0,
          },
        };
      }

      // Sum each criteria
      Object.keys(refereeMap[key].totals).forEach((criteria) => {
        refereeMap[key].totals[criteria] += perf[criteria] || 0;
      });

      refereeMap[key].count += 1;

      // Count recommended levels
      const level = evalItem.current_recommended_level;
      if (level && refereeMap[key].levels.hasOwnProperty(level)) {
        refereeMap[key].levels[level]++;
      }
    });

    // Convert to array and round averages to whole numbers
    return Object.values(refereeMap)
      .map((item) => {
        const avgCriteria = {};
        let totalSum = 0;

        Object.keys(item.totals).forEach((criteria) => {
          const avg = Math.round(item.totals[criteria] / item.count); // Rounded to nearest whole number
          avgCriteria[criteria] = avg;
          totalSum += avg;
        });

        const overallPercentage = Math.round((totalSum / 60) * 100);
        const overallAvg = Math.round(totalSum / 6);

        return {
          ...item,
          ...avgCriteria,
          overall_percentage: overallPercentage,
          overall_avg: overallAvg,
        };
      })
      .sort((a, b) => b.overall_percentage - a.overall_percentage)
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));
  }, [evaluations]);

  // Stats (also using whole numbers)
  const stats = useMemo(() => {
    if (processedData.length === 0) return [];

    const avgOverall = Math.round(
      processedData.reduce((sum, r) => sum + r.overall_percentage, 0) / processedData.length
    );
    const topPerformer = processedData[0]?.name || "N/A";

    return [
      { value: avgOverall + "%", label: "Camp Average Score", color: "text-cyan-600" },
      { value: topPerformer, label: "Top Performer", color: "text-green-600" },
      { value: evaluations.length, label: "Total Evaluations", color: "text-purple-600" },
      { value: processedData.length, label: "Referees Evaluated", color: "text-orange-600" },
    ];
  }, [processedData, evaluations.length]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "rank",
        header: "Rank",
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-2">
            {row.original.rank <= 3 && (
              <BsTrophy
                className={`w-6 h-6 ${
                  row.original.rank === 1
                    ? "text-yellow-500"
                    : row.original.rank === 2
                    ? "text-gray-400"
                    : "text-orange-600"
                }`}
              />
            )}
            <span className="font-bold text-xl">#{row.original.rank}</span>
          </div>
        ),
      },
      {
        accessorKey: "name",
        header: "Referee",
        cell: ({ row }) => (
          <div className="flex items-center gap-4 min-w-[200px]">
            <Avatar src={row.original.avatar} size={48}>
              {row.original.name.split(" ").map((n) => n[0]).join("")}
            </Avatar>
            <div>
              <div
                onClick={() =>
                  navigate(`/director-dashboard/referee/${row.original.referee_id}`)
                }
                className="font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                {row.original.name}
              </div>
              <div className="text-xs text-gray-500">
                {row.original.count} evaluation{row.original.count > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "overall_percentage",
        header: "Overall",
        cell: ({ row }) => (
          <div className="text-center">
            <div className="font-bold text-2xl text-gray-800">
              {row.original.overall_percentage}%
            </div>
            <div className="text-sm text-gray-500">
              avg {row.original.overall_avg}/10
            </div>
          </div>
        ),
      },
      {
        accessorKey: "call_accuracy",
        header: "Call Acc.",
        cell: ({ row }) => (
          <div className="text-center font-bold text-lg">
            {row.original.call_accuracy}
          </div>
        ),
      },
      {
        accessorKey: "communication_skills",
        header: "Comm.",
        cell: ({ row }) => (
          <div className="text-center font-bold text-lg">
            {row.original.communication_skills}
          </div>
        ),
      },
      {
        accessorKey: "consistency_of_calls",
        header: "Consist.",
        cell: ({ row }) => (
          <div className="text-center font-bold text-lg">
            {row.original.consistency_of_calls}
          </div>
        ),
      },
      {
        accessorKey: "court_position_mechanics",
        header: "Mechanics",
        cell: ({ row }) => (
          <div className="text-center font-bold text-lg">
            {row.original.court_position_mechanics}
          </div>
        ),
      },
      {
        accessorKey: "fitness_mobility",
        header: "Fit/Mob",
        cell: ({ row }) => (
          <div className="text-center font-bold text-lg">
            {row.original.fitness_mobility}
          </div>
        ),
      },
      {
        accessorKey: "game_awareness",
        header: "Game Aware",
        cell: ({ row }) => (
          <div className="text-center font-bold text-lg">
            {row.original.game_awareness}
          </div>
        ),
      },
      {
        accessorKey: "levels.NCAA D1",
        header: "D1",
        cell: ({ row }) => (
          <div className="text-center font-bold text-green-600 text-lg">
            {row.original.levels["NCAA D1"]}
          </div>
        ),
      },
      {
        accessorKey: "levels.NCAA D2",
        header: "D2",
        cell: ({ row }) => (
          <div className="text-center font-bold text-green-600 text-lg">
            {row.original.levels["NCAA D2"]}
          </div>
        ),
      },
      {
        accessorKey: "levels.NAIA",
        header: "NAIA",
        cell: ({ row }) => (
          <div className="text-center font-bold text-green-600 text-lg">
            {row.original.levels.NAIA}
          </div>
        ),
      },
      {
        accessorKey: "levels.JUCO",
        header: "JUCO",
        cell: ({ row }) => (
          <div className="text-center font-bold text-green-600 text-lg">
            {row.original.levels.JUCO}
          </div>
        ),
      },
      {
        accessorKey: "levels.HS",
        header: "HS",
        cell: ({ row }) => (
          <div className="text-center font-bold text-green-600 text-lg">
            {row.original.levels.HS}
          </div>
        ),
      },
      {
        accessorKey: "levels.JH/ELEM",
        header: "JH/ELEM",
        cell: ({ row }) => (
          <div className="text-center font-bold text-green-600 text-lg">
            {row.original.levels["JH/ELEM"]}
          </div>
        ),
      },
    ],
    [navigate]
  );

  const table = useReactTable({
    data: processedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        Loading rankings...
      </div>
    );
  }

  return (
    <div className="my-10">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border border-gray-200 p-8 hover:shadow-xl transition-all text-center"
          >
            <div className={`text-2xl font-bold ${stat.color} mb-3`}>
              {stat.value}
            </div>
            <div className="text-base font-medium text-gray-700">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
          <h2 className="text-2xl font-bold text-gray-900">Referee Rankings</h2>
          <p className="text-sm text-gray-600 mt-1">
            Based on {evaluations.length} submitted evaluations
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[1600px]">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className="bg-gray-50 border-b-2 border-gray-300"
                  >
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"
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
                {processedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-16 text-gray-500 text-lg"
                    >
                      No evaluations submitted yet for this camp.
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-gray-100 hover:bg-blue-50 transition-all"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-5 text-center">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rankings;