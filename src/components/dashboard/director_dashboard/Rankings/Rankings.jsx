/* eslint-disable no-prototype-builtins */
import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { BsTrophy } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Avatar } from "antd";
import RefereeDetailsModal from "./RefereeDetailsModal";

const Rankings = ({ campId }) => {
  const axiosInstance = useAxiosSecure();

  const { data: rawEvaluations = [], isLoading } = useQuery({
    queryKey: ["rankings", campId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/referee/evaluation/camp/${campId}`);
      return res?.data?.data?.evaluations || [];
    },
  });

  const processedData = useMemo(() => {
    return rawEvaluations
      .map((item) => {
        const averages = item.averages || {};

        const levels = {
          "NCAA D1": 0,
          "NCAA D2": 0,
          NAIA: 0,
          JUCO: 0,
          HS: 0,
          "JH/ELEM": 0,
        };

        (item.recommended_levels || []).forEach((lvl) => {
          if (levels.hasOwnProperty(lvl.level)) {
            levels[lvl.level] = lvl.count;
          }
        });

        const overallAvg = Math.round(averages.overall || 0);
        const overallPercentage = overallAvg * 10;

        return {
          referee_id: item.referee_id,
          name: item.referee_name || "Unknown Referee",
          avatar: null,
          count: item.total_evaluations || 0,
          call_accuracy: Math.round(averages.call_accuracy || 0),
          communication_skills: Math.round(averages.communication_skills || 0),
          consistency_of_calls: Math.round(averages.consistency_of_calls || 0),
          court_position_mechanics: Math.round(
            averages.court_position_mechanics || 0
          ),
          fitness_mobility: Math.round(averages.fitness_mobility || 0),
          game_awareness: Math.round(averages.game_awareness || 0),
          overall_percentage: overallPercentage,
          overall_avg: overallAvg,
          levels,
          rank: 0,
        };
      })
      .sort((a, b) => b.overall_percentage - a.overall_percentage)
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));
  }, [rawEvaluations]);

  // Stats
  const stats = useMemo(() => {
    if (processedData.length === 0) return [];

    const avgOverall = Math.round(
      processedData.reduce((sum, r) => sum + r.overall_percentage, 0) /
        processedData.length
    );
    const topPerformer = processedData[0]?.name || "N/A";

    return [
      {
        value: avgOverall + "%",
        label: "Camp Average Score",
        color: "text-cyan-600",
      },
      { value: topPerformer, label: "Top Performer", color: "text-green-600" },
      {
        value: rawEvaluations.reduce(
          (sum, r) => sum + (r.total_evaluations || 0),
          0
        ),
        label: "Total Evaluations",
        color: "text-purple-600",
      },
      {
        value: processedData.length,
        label: "Referees Evaluated",
        color: "text-orange-600",
      },
    ];
  }, [processedData, rawEvaluations]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReferee, setSelectedReferee] = useState(null);

  const openModal = (referee) => {
    setSelectedReferee(referee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReferee(null);
  };

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
            <Avatar size={48}>
              {row.original.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </Avatar>
            <div>
              <button
                onClick={() => openModal(row.original)}
                className="font-semibold text-blue-600 hover:underline cursor-pointer focus:outline-none"
              >
                {row.original.name}
              </button>
              <div className="text-xs text-gray-500">
                {row.original.count} evaluation
                {row.original.count > 1 ? "s" : ""}
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
            <div className="font-bold text-xl text-gray-800">
              {row.original.overall_percentage}%
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
    []
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
            Based on{" "}
            {rawEvaluations.reduce(
              (sum, r) => sum + (r.total_evaluations || 0),
              0
            )}{" "}
            submitted evaluations
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

      {/* Referee Details Modal */}
      <RefereeDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        referee={selectedReferee}
      />
    </div>
  );
};

export default Rankings;
