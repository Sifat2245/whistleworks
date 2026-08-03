import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  LuTrophy,
  LuTrendingUp,
  LuUsers,
  LuClipboardCheck,
  LuInbox,
  LuTriangleAlert,
  LuArrowUp,
  LuArrowDown,
  LuArrowUpDown,
} from "react-icons/lu";
import { Avatar } from "antd";
import RefereeDetailsModal from "./RefereeDetailsModal";
import RankingsSkeleton from "./RankingsSkeleton";
import { useRefereeEvaluations } from "@/hooks/api/useRankings";

const LEVELS = ["NCAA D1", "NCAA D2", "NAIA", "JUCO", "HS", "JH/ELEM"];

const trophyColor = (rank) => {
  if (rank === 1) return "text-amber-400";
  if (rank === 2) return "text-slate-400";
  if (rank === 3) return "text-amber-600";
  return "";
};

const scoreTone = (value) => {
  if (value >= 8) return "text-green-600";
  if (value >= 6) return "text-amber-600";
  return "text-red-500";
};

const CRITERIA = [
  { key: "call_accuracy", label: "Call Accuracy" },
  { key: "communication_skills", label: "Communication" },
  { key: "consistency_of_calls", label: "Consistency" },
  { key: "court_position_mechanics", label: "Mechanics" },
  { key: "fitness_mobility", label: "Fitness/Mobility" },
  { key: "game_awareness", label: "Game Awareness" },
];

const rankBadgeClass = (rank) => {
  if (rank === 1) return "bg-amber-400";
  if (rank === 2) return "bg-slate-400";
  if (rank === 3) return "bg-amber-600";
  return "bg-[#333]";
};

const Rankings = ({ campId }) => {
  const {
    evaluations: rawEvaluations,
    isLoading,
    isError,
    error,
  } = useRefereeEvaluations(campId);

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
        avatar: item.referee_avatar || null,
        address: item.referee_address || "Unknown Address",
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

  const totalEvals = useMemo(
    () =>
      rawEvaluations.reduce((sum, r) => sum + (r.total_evaluations || 0), 0),
    [rawEvaluations],
  );

  const stats = useMemo(() => {
    if (processedData.length === 0) return [];

    const avgOverall = (
      processedData.reduce((sum, r) => sum + r.overall_percentage, 0) /
      processedData.length
    ).toFixed(3);

    return [
      {
        value: `${avgOverall}%`,
        label: "Camp Average Score",
        icon: <LuTrendingUp />,
      },
      {
        value: processedData[0]?.name || "N/A",
        label: "Top Performer",
        icon: <LuTrophy />,
      },
      {
        value: totalEvals,
        label: "Total Evaluations",
        icon: <LuClipboardCheck />,
      },
      {
        value: processedData.length,
        label: "Referees Evaluated",
        icon: <LuUsers />,
      },
    ];
  }, [processedData, totalEvals]);

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
              <LuTrophy className={`w-5 h-5 ${trophyColor(row.original.rank)}`} />
            )}
            <span className="text-lg font-semibold text-[#333]">
              #{row.original.rank}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "name",
        header: "Referee",
        cell: ({ row }) => (
          <div className="flex items-center gap-3.5 min-w-[220px] max-w-[300px]">
            <Avatar
              size={46}
              src={row.original.avatar}
              alt={`${row.original.name} avatar`}
              className="bg-primary/10 text-primary border border-primary/20 shadow-sm shrink-0"
            >
              {row.original.name
                .split(" ")
                .map((part) => part.charAt(0).toUpperCase())
                .slice(0, 2)
                .join("")}
            </Avatar>
            <div className="min-w-0 flex-1">
              <button
                onClick={() => openModal(row.original)}
                className="font-medium text-[#333] hover:text-primary hover:underline focus:outline-none truncate block w-full text-left transition-colors"
              >
                {row.original.name}
              </button>
              <div
                className="text-xs text-[#666] mt-0.5 truncate"
                title={row.original.address}
              >
                {row.original.address}
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
            <span
              className={`inline-block text-sm font-semibold ${scoreTone(
                row.original.overall_percentage,
              )}`}
            >
              {row.original.overall_percentage.toFixed(3)}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "call_accuracy",
        header: "Call Acc.",
        cell: ({ row }) => (
          <div className="text-center text-sm text-[#444]">
            {row.original.call_accuracy.toFixed(3)}
          </div>
        ),
      },
      {
        accessorKey: "communication_skills",
        header: "Comm.",
        cell: ({ row }) => (
          <div className="text-center text-sm text-[#444]">
            {row.original.communication_skills.toFixed(3)}
          </div>
        ),
      },
      {
        accessorKey: "consistency_of_calls",
        header: "Consist.",
        cell: ({ row }) => (
          <div className="text-center text-sm text-[#444]">
            {row.original.consistency_of_calls.toFixed(3)}
          </div>
        ),
      },
      {
        accessorKey: "court_position_mechanics",
        header: "Mechanics",
        cell: ({ row }) => (
          <div className="text-center text-sm text-[#444]">
            {row.original.court_position_mechanics.toFixed(3)}
          </div>
        ),
      },
      {
        accessorKey: "fitness_mobility",
        header: "Fit/Mob",
        cell: ({ row }) => (
          <div className="text-center text-sm text-[#444]">
            {row.original.fitness_mobility.toFixed(3)}
          </div>
        ),
      },
      {
        accessorKey: "game_awareness",
        header: "Game Aware",
        cell: ({ row }) => (
          <div className="text-center text-sm text-[#444]">
            {row.original.game_awareness.toFixed(3)}
          </div>
        ),
      },
      {
        accessorKey: "count",
        header: "Evals",
        cell: ({ row }) => (
          <div className="text-center">
            <span className="inline-block min-w-7 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              {row.original.count}
            </span>
          </div>
        ),
      },
      ...LEVELS.map((level) => ({
        accessorKey: `levels.${level}`,
        header: level === "JH/ELEM" ? "JH/Elem" : level,
        cell: ({ row }) => (
          <div className="text-center text-sm text-[#444]">
            {row.original.levels[level] || "–"}
          </div>
        ),
      })),
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
    return <RankingsSkeleton />;
  }

  if (isError) {
    console.error("Rankings fetch error:", error);
    return (
      <div className="mt-6 mx-auto max-w-md bg-red-50 border border-red-200 rounded-[10px] p-8 text-center">
        <LuTriangleAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-red-800 mb-3">
          Failed to Load Rankings
        </h2>
        <p className="text-red-600 mb-4">
          {error?.message || "Unknown error occurred"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="my-10">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white border border-border rounded-[10px] px-4 py-4 flex items-center gap-3 hover:shadow-sm transition-shadow"
          >
            <span className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">
              {stat.icon}
            </span>
            <div className="min-w-0">
              <p className="text-[#333] font-semibold text-lg truncate">
                {stat.value}
              </p>
              <p className="text-xs text-[#666] mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-[10px] overflow-hidden">
        <div className="px-5 sm:px-7 py-5 border-b border-border bg-gradient-to-r from-primary/5 via-transparent to-transparent">
          <h2 className="text-lg font-semibold text-[#333]">
            Referee Rankings
          </h2>
          <p className="text-sm text-[#666] mt-0.5">
            Based on {totalEvals} submitted evaluation
            {totalEvals !== 1 ? "s" : ""} — click a referee name to view
            their full evaluation history
          </p>
        </div>

        {/* Desktop table (md+) */}
        <div className="hidden md:block overflow-x-auto hide-scrollbar">
          <table className="w-full min-w-[1400px]">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="bg-[#FAFAFA] border-b border-border"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-5 py-3.5 text-left text-xs font-semibold text-[#666] uppercase tracking-wider whitespace-nowrap"
                    >
                      {header.column.getCanSort() ? (
                        <button
                          className="flex items-center gap-1.5 hover:text-primary focus:outline-none transition-colors cursor-pointer"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getIsSorted() ? (
                            header.column.getIsSorted() === "asc" ? (
                              <LuArrowUp className="w-4 h-4 text-primary" />
                            ) : (
                              <LuArrowDown className="w-4 h-4 text-primary" />
                            )
                          ) : (
                            <LuArrowUpDown className="w-4 h-4 opacity-25" />
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
                    className="text-center py-16 px-6"
                  >
                    <LuInbox className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-[#333] mb-2">
                      No Rankings Yet
                    </h3>
                    <p className="text-[#666] max-w-sm mx-auto">
                      Rankings will appear here once evaluations are submitted
                      for this camp.
                    </p>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border last:border-b-0 hover:bg-primary/[0.03] transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-5 py-4">
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

        {processedData.length > 0 && (
          <p className="hidden md:block lg:hidden text-center text-xs text-gray-500 py-3 border-t border-border">
            ← Swipe left/right to see all columns →
          </p>
        )}

        {/* Mobile cards (below md) */}
        <div className="md:hidden">
          {processedData.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <LuInbox className="w-14 h-14 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#333] mb-2">
                No Rankings Yet
              </h3>
              <p className="text-sm text-[#666]">
                Rankings will appear here once evaluations are submitted for
                this camp.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 p-4">
              {processedData.map((referee) => {
                const activeLevels = LEVELS.filter(
                  (lvl) => (referee.levels[lvl] || 0) > 0,
                );
                return (
                  <div
                    key={referee.referee_id}
                    className="bg-white border border-border rounded-[10px] p-4 shadow-sm"
                  >
                    {/* Header: avatar + rank + name + overall */}
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <Avatar
                          size={48}
                          src={referee.avatar}
                          alt={`${referee.name} avatar`}
                          className="bg-primary/10 text-primary border border-primary/20"
                        >
                          {referee.name
                            .split(" ")
                            .map((part) => part.charAt(0).toUpperCase())
                            .slice(0, 2)
                            .join("")}
                        </Avatar>
                        <span
                          className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white text-white text-[11px] font-bold flex items-center justify-center ${rankBadgeClass(referee.rank)}`}
                        >
                          {referee.rank}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => openModal(referee)}
                          className="font-medium text-[#333] hover:text-primary truncate block w-full text-left transition-colors"
                        >
                          {referee.name}
                        </button>
                        <p className="text-xs text-[#666] truncate">
                          {referee.address}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        {referee.rank <= 3 && (
                          <LuTrophy
                            className={`w-4 h-4 ${trophyColor(referee.rank)} mx-auto mb-1`}
                          />
                        )}
                        <span
                          className={`text-sm font-bold ${scoreTone(referee.overall_percentage)}`}
                        >
                          {referee.overall_percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Criteria grid */}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {CRITERIA.map((c) => (
                        <div
                          key={c.key}
                          className="flex items-center justify-between gap-2 rounded-lg bg-[#FAFAFA] border border-border px-3 py-2"
                        >
                          <span className="text-xs text-[#666] truncate">
                            {c.label}
                          </span>
                          <span
                            className={`text-sm font-semibold ${scoreTone(referee[c.key])}`}
                          >
                            {referee[c.key].toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer: evals + recommended levels */}
                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between gap-2 flex-wrap">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        {referee.count} eval{referee.count !== 1 ? "s" : ""}
                      </span>
                      {activeLevels.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 justify-end">
                          {activeLevels.map((lvl) => (
                            <span
                              key={lvl}
                              className="px-2 py-0.5 rounded-full bg-gray-100 border border-border text-[11px] text-[#555]"
                            >
                              {lvl}: {referee.levels[lvl]}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-gray-400">
                          No recommended levels yet
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
