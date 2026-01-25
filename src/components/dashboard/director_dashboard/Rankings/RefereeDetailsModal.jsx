import { AnimatePresence, motion } from "framer-motion";
import { BsTrophy } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { Avatar, Tooltip } from "antd"; // ← Add Tooltip here
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useMemo, useRef, useCallback } from "react";

const RefereeDetailsModal = ({ isOpen, onClose, referee, campId }) => {
  const axiosInstance = useAxiosSecure();
  const refereeId = referee?.referee_id;

  const {
    data: historyPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["referee-history", campId, refereeId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosInstance.get(
        `/camp/${campId}/referee/${refereeId}/history?page=${pageParam}`
      );
      return res?.data?.data;
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.pagination;
      if (!pagination || pagination.current_page >= pagination.last_page) {
        return undefined;
      }
      return pagination.current_page + 1;
    },
    enabled: !!campId && !!refereeId && isOpen,
  });

  const evaluations = useMemo(() => {
    return historyPages?.pages?.flatMap((page) => page.evaluations || []) || [];
  }, [historyPages]);

  const observerRef = useRef();

  const lastEvaluationRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "submitted_at",
        header: "Date/Time",
        cell: ({ row }) => {
          const date = new Date(row.original.submitted_at);
          return (
            <div className="text-sm text-gray-700">
              {date.toLocaleDateString()} <br />
              <span className="text-gray-500">
                {date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "scores.call_accuracy",
        header: "Call/No Call Accuracy",
        cell: ({ row }) => (
          <div className="text-center font-medium">
            {row.original.scores.call_accuracy}
          </div>
        ),
      },
      {
        accessorKey: "scores.communication_skills",
        header: "Communication Skills",
        cell: ({ row }) => (
          <div className="text-center font-medium">
            {row.original.scores.communication_skills}
          </div>
        ),
      },
      {
        accessorKey: "scores.consistency_of_calls",
        header: "Consistency of Calls",
        cell: ({ row }) => (
          <div className="text-center font-medium">
            {row.original.scores.consistency_of_calls}
          </div>
        ),
      },
      {
        accessorKey: "scores.court_position_mechanics",
        header: "Court Position/Mechanics",
        cell: ({ row }) => (
          <div className="text-center font-medium">
            {row.original.scores.court_position_mechanics}
          </div>
        ),
      },
      {
        accessorKey: "scores.fitness_mobility",
        header: "Fitness/Mobility",
        cell: ({ row }) => (
          <div className="text-center font-medium">
            {row.original.scores.fitness_mobility}
          </div>
        ),
      },
      {
        accessorKey: "scores.game_awareness",
        header: "Game Awareness",
        cell: ({ row }) => (
          <div className="text-center font-medium">
            {row.original.scores.game_awareness}
          </div>
        ),
      },
      {
        accessorKey: "average_score",
        header: "Overall",
        cell: ({ row }) => (
          <div className="text-center">
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 font-bold rounded-full text-sm">
              {Number(row.original.average_score).toFixed(3)}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "private_comments",
        header: "Notes for Director",
        cell: ({ row }) => {
          const comment = row.original.private_comments || "-";
          return (
            <Tooltip title={comment} placement="topLeft" mouseEnterDelay={0.3}>
              <div className="text-xs text-gray-600 max-w-[150px] truncate cursor-help">
                {comment}
              </div>
            </Tooltip>
          );
        },
      },
      {
        accessorKey: "referee_feedback",
        header: "Referee Feedback",
        cell: ({ row }) => {
          const feedback = row.original.referee_feedback || "-";
          return (
            <Tooltip title={feedback} placement="topLeft" mouseEnterDelay={0.3}>
              <div className="text-xs text-gray-700 max-w-[180px] line-clamp-3 cursor-help">
                {feedback}
              </div>
            </Tooltip>
          );
        },
      },
      {
        accessorKey: "recommended_level",
        header: "Recommended Highest Level of Officiating",
        cell: ({ row }) => (
          <div className="text-center font-medium text-green-700">
            {row.original.recommended_level || "-"}
          </div>
        ),
      },
      {
        accessorKey: "evaluator.name",
        header: "Evaluator",
        cell: ({ row }) => (
          <div className="text-sm font-medium text-gray-800">
            {row.original.evaluator.name}
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: evaluations,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!referee) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-2xl shadow-2xl max-w-8xl w-full my-8 max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
              <h2 className="text-2xl font-bold text-gray-900">
                Referee Performance Details
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <MdClose className="w-6 h-6" />
              </button>
            </div>

            {/* Summary Section */}
            <div className="p-4 bg-gray-50">
              <div className="flex flex-col items-center text-center">
                <Avatar size={70} className="mb-4 text-3xl">
                  {referee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </Avatar>
                <h3 className="text-xl font-bold text-gray-900">{referee.name}</h3>
                <div className="flex items-center gap-3 mt-3">
                  <BsTrophy className="w-6 h-6 text-yellow-500" />
                  <span className="text-xl font-bold text-gray-800">
                    Rank #{referee.rank}
                  </span>
                </div>
                <p className="text-lg text-gray-600 mt-3">
                  Overall Score:{" "}
                  <span className="font-bold text-lg text-cyan-600">
                    {referee.overall_percentage.toFixed(3)}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Based on {referee.count} evaluation{referee.count > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Evaluations Table */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Evaluation History ({evaluations?.length})
              </h3>

              {isLoading ? (
                <div className="text-center py-12 text-gray-500">
                  Loading evaluations...
                </div>
              ) : evaluations?.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No evaluations found.
                </div>
              ) : (
                <div className="max-h-[40vh] overflow-y-auto border border-gray-200 rounded-xl">
                  <table className="w-full min-w-[1400px]">
                    <thead className="bg-gray-100 border-b border-gray-300 sticky top-0">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <th
                              key={header.id}
                              className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
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
                    <tbody className="divide-y divide-gray-200">
                      {table.getRowModel().rows.map((row, index) => (
                        <tr
                          key={row.id}
                          ref={index === evaluations.length - 5 ? lastEvaluationRef : null}
                          className="hover:bg-blue-50 transition-colors"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="px-4 py-4 text-sm">
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

                  {isFetchingNextPage && (
                    <div className="py-4 text-center text-gray-500 text-sm">
                      Loading more evaluations...
                    </div>
                  )}

                  {!hasNextPage && evaluations.length > 0 && (
                    <div className="py-4 text-center text-gray-400 text-sm">
                      End of evaluation history
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RefereeDetailsModal;