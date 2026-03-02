import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { BsTrophy, BsSortUp, BsSortDown } from "react-icons/bs";
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
    const mapped = rawEvaluations.map((item) => {
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
        if (lvl.level in levels) {
          levels[lvl.level] = lvl.count;
        }
      });

      const overall = averages.overall || 0;

      return {
        referee_id: item.referee_id,
        name: item.referee_name || "Unknown Referee",
        avatar: item.avatar || null,
        count: item.total_evaluations || 0,
        call_accuracy: averages.call_accuracy || 0,
        communication_skills: averages.communication_skills || 0,
        consistency_of_calls: averages.consistency_of_calls || 0,
        court_position_mechanics: averages.court_position_mechanics || 0,
        fitness_mobility: averages.fitness_mobility || 0,
        game_awareness: averages.game_awareness || 0,
        overall_percentage: overall,
        overall_avg: overall,
        levels,
      };
    });

    // Sort by overall percentage descending by default
    mapped.sort((a, b) => b.overall_percentage - a.overall_percentage);

    // Assign ranks after initial sort
    return mapped.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }, [rawEvaluations]);

  const stats = useMemo(() => {
    if (processedData.length === 0) return [];

    const avgOverall = (
      processedData.reduce((sum, r) => sum + r.overall_percentage, 0) /
      processedData.length
    ).toFixed(3);

    const topPerformer = processedData[0]?.name || "N/A";
    const totalEvals = rawEvaluations.reduce(
      (sum, r) => sum + (r.total_evaluations || 0),
      0,
    );

    return [
      {
        value: avgOverall,
        label: "Camp Average Score",
        color: "text-cyan-600",
        suffix: "%",
      },
      { value: topPerformer, label: "Top Performer", color: "text-green-600" },
      {
        value: totalEvals,
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
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-2">
            {row.original.rank <= 3 && (
              <BsTrophy
                className={`w-6 h-6 ${
                  row.original.rank === 1
                    ? "text-yellow-500"
                    : row.original.rank === 2
                      ? "text-gray-400"
                      : "text-amber-600"
                }`}
              />
            )}
            <span className="text-xl font-medium">#{row.original.rank}</span>
          </div>
        ),
      },
      {
        accessorKey: "name",
        header: "Referee",
        cell: ({ row }) => (
          <div className="flex items-center gap-4 min-w-[220px]">
            <Avatar
              size={48}
              src={row.original.avatar}
              alt={`${row.original.name} avatar`}
              className="bg-gray-200 border border-gray-300 shadow-sm"
            >
              {row.original.name
                .split(" ")
                .map((part) => part.charAt(0).toUpperCase())
                .slice(0, 2)
                .join("")}
            </Avatar>
            <div>
              <button
                onClick={() => openModal(row.original)}
                className="font-medium text-blue-600 hover:underline focus:outline-none"
              >
                {row.original.name}
              </button>
              <div className="text-xs text-gray-500 mt-0.5">
                {row.original.count} evaluation
                {row.original.count !== 1 ? "s" : ""}
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
            <div className="text-xl font-semibold">
              {row.original.overall_percentage.toFixed(3)}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "call_accuracy",
        header: "Call Acc.",
        cell: ({ row }) => (
          <div className="text-center text-lg">
            {row.original.call_accuracy.toFixed(3)}
          </div>
        ),
      },
      {
        accessorKey: "communication_skills",
        header: "Comm.",
        cell: ({ row }) => (
          <div className="text-center text-lg">
            {row.original.communication_skills.toFixed(3)}
          </div>
        ),
      },
      {
        accessorKey: "consistency_of_calls",
        header: "Consist.",
        cell: ({ row }) => (
          <div className="text-center text-lg">
            {row.original.consistency_of_calls.toFixed(3)}
          </div>
        ),
      },
      {
        accessorKey: "court_position_mechanics",
        header: "Mechanics",
        cell: ({ row }) => (
          <div className="text-center text-lg">
            {row.original.court_position_mechanics.toFixed(3)}
          </div>
        ),
      },
      {
        accessorKey: "fitness_mobility",
        header: "Fit/Mob",
        cell: ({ row }) => (
          <div className="text-center text-lg">
            {row.original.fitness_mobility.toFixed(3)}
          </div>
        ),
      },
      {
        accessorKey: "game_awareness",
        header: "Game Aware",
        cell: ({ row }) => (
          <div className="text-center text-lg">
            {row.original.game_awareness.toFixed(3)}
          </div>
        ),
      },
      {
        accessorKey: "count",
        header: "Evals",
        cell: ({ row }) => (
          <div className="text-center text-lg font-medium">
            {row.original.count}
          </div>
        ),
      },
      ...["NCAA D1", "NCAA D2", "NAIA", "JUCO", "HS", "JH/ELEM"].map(
        (level) => ({
          accessorKey: `levels.${level}`,
          header: level === "JH/ELEM" ? "JH/Elem" : level,
          cell: ({ row }) => (
            <div className="text-center text-lg">
              {row.original.levels[level] || "–"}
            </div>
          ),
        }),
      ),
    ],
    [],
  );

  const table = useReactTable({
    data: processedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow"
          >
            <div className={`text-3xl font-bold ${stat.color} mb-2`}>
              {stat.value}
              {stat.suffix && (
                <span className="text-xl ml-1">{stat.suffix}</span>
              )}
            </div>
            <div className="text-sm font-medium text-gray-600">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-8 py-6 border-b bg-linear-to-r from-blue-50 to-cyan-50">
          <h2 className="text-2xl font-bold text-gray-900">Referee Rankings</h2>
          <p className="text-sm text-gray-600 mt-1">
            Based on{" "}
            {rawEvaluations.reduce(
              (sum, r) => sum + (r.total_evaluations || 0),
              0,
            )}{" "}
            submitted evaluations
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1400px]">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="bg-gray-50 border-b-2 border-gray-200"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"
                    >
                      {header.column.getCanSort() ? (
                        <button
                          className="flex items-center gap-1.5 hover:text-blue-700 focus:outline-none"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getIsSorted() ? (
                            header.column.getIsSorted() === "asc" ? (
                              <BsSortUp className="w-4 h-4 text-blue-600" />
                            ) : (
                              <BsSortDown className="w-4 h-4 text-blue-600" />
                            )
                          ) : (
                            <BsSortUp className="w-4 h-4 opacity-30" />
                          )}
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
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
                    className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-5">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
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

      <RefereeDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        referee={selectedReferee}
        campId={campId}
      />
    </div>
  );
};

export default Rankings;
