import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  MdCheckCircle,
  MdDelete,
  MdArrowUpward,
  MdArrowDownward,
} from "react-icons/md";
import { IoCheckboxOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import { BiPhone } from "react-icons/bi";
import RefereeDetailsModal from "./RefereeDetailsModal";
import {
  useCheckInReferee,
  useRemoveRefereeFromRoster,
  useUpdateJerseyNumber,
} from "@/hooks/api/director-hooks/useRosterForDirector";

const RosterTable = ({ referees = [], campId }) => {
  // Sorting state
  const [sorting, setSorting] = useState([]);

  // Check-in states
  const [checkingInId, setCheckingInId] = useState(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReferee, setSelectedReferee] = useState(null);

  // Jersey state
  const [editingJerseyId, setEditingJerseyId] = useState(null);
  const [jerseyInput, setJerseyInput] = useState("");

  // Remove tracking state
  const [removingId, setRemovingId] = useState(null);

  // Mutation hooks
  const checkInMutation = useCheckInReferee(campId);
  const removeMutation = useRemoveRefereeFromRoster(campId);
  const updateJerseyMutation = useUpdateJerseyNumber(campId);

  const data = useMemo(() => referees, [referees]);

  // Calculate stats
  const totalReferees = referees.length;
  const checkedInCount = referees.filter(
    (ref) => ref.status === "checked_in",
  ).length;

  const openModal = (referee) => {
    setSelectedReferee(referee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReferee(null);
  };

  const handleCheckIn = async (refereeId) => {
    const result = await Swal.fire({
      title: "Check In Referee?",
      text: "This will mark the referee as checked in for the camp.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Check In",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;

    setCheckingInId(refereeId);

    try {
      await checkInMutation.mutateAsync(refereeId);
    } catch {
      // Error toast is handled inside the hook
    } finally {
      setCheckingInId(null);
    }
  };

  const handleRemove = async (refereeId) => {
    const referee = referees.find((r) => r.id === refereeId);
    const refereeName = referee?.name || "this referee";

    const confirmed = await Swal.fire({
      title: "Remove Referee from Roster?",
      text: `Are you sure you want to remove ${refereeName}? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Remove",
    });

    if (!confirmed.isConfirmed) return;

    setRemovingId(refereeId);

    try {
      await removeMutation.mutateAsync(refereeId);
      Swal.fire({
        title: "Removed!",
        text: `${refereeName} has been removed from the roster.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch {
      // Error toast is handled inside the hook
    } finally {
      setRemovingId(null);
    }
  };

  const handleUpdateJersey = async (refereeId, jerseyNumber) => {
    const trimmed = jerseyNumber.trim();

    try {
      await updateJerseyMutation.mutateAsync({
        refereeId,
        jourcyNumber: trimmed,
      });
      Swal.fire({
        title: "Updated!",
        text: "Jersey number saved",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch {
      // Error toast is handled inside the hook
    } finally {
      setEditingJerseyId(null);
      setJerseyInput("");
    }
  };

  const formatPhone = (phone) => {
    if (!phone) return "N/A";

    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, "");

    // If we don't have exactly 10 digits → return original digits or N/A
    if (digits.length !== 10) {
      return digits.length === 0 ? "N/A" : digits;
    }

    // Format as (xxx) xxx-xxxx
    const areaCode = digits.slice(0, 3);
    const part1 = digits.slice(3, 6);
    const part2 = digits.slice(6, 10);

    return `(${areaCode}) ${part1}-${part2}`;
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <img
              src={row.original.avatar || "/default-avatar.png"}
              alt={row.original.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 shrink-0"
              onError={(e) => (e.target.src = "/default-avatar.png")}
            />
            <div>
              <button
                onClick={() => openModal(row.original)}
                className="font-semibold text-gray-900 hover:underline cursor-pointer focus:outline-none"
              >
                {row.original.name || "Unnamed Referee"}
              </button>
              <div className="text-sm text-gray-500">
                {row.original.address}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: "Contact",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-700">
              <BiPhone className="text-gray-400 text-lg" />
              <span className="text-sm font-medium tracking-wide">
                {formatPhone(row.original.phone)}
              </span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "jourcy_number",
        header: "Jersey ID",
        enableSorting: true,
        sortingFn: "alphanumeric",
        cell: ({ row }) => {
          const referee = row.original;
          const jersey = referee.jourcy_number?.toString() || "";
          const isEditing = editingJerseyId === referee.id;

          if (isEditing) {
            return (
              <div className="flex justify-center">
                <input
                  type="text"
                  autoFocus
                  value={jerseyInput}
                  onChange={(e) => setJerseyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleUpdateJersey(referee.id, jerseyInput);
                    } else if (e.key === "Escape") {
                      setEditingJerseyId(null);
                      setJerseyInput("");
                    }
                  }}
                  onBlur={() => {
                    setEditingJerseyId(null);
                    setJerseyInput("");
                  }}
                  className="w-24 px-3 py-1.5 text-center border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-200 font-mono text-sm transition-all"
                  placeholder="23"
                />
              </div>
            );
          }

          return (
            <div
              onClick={() => {
                setEditingJerseyId(referee.id);
                setJerseyInput(jersey);
              }}
              className="text-center cursor-pointer group"
            >
              <span className="font-mono text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                {jersey || "-"}
              </span>
              <p className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to edit
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: "assigned_games_count",
        header: "Games Assigned",
        enableSorting: true,
        sortingFn: "alphanumeric",
        cell: ({ row }) => (
          <div className="text-center font-medium text-gray-900">
            {row.original.assigned_games_count ?? "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        enableSorting: true,
        cell: ({ getValue }) => {
          const status = getValue();
          const isCheckedIn = status === "checked_in";

          return (
            <div
              className={`flex justify-center items-center py-2 px-4 rounded-full text-sm font-medium w-fit mx-auto ${
                isCheckedIn
                  ? "bg-[#DCFCE7] text-[#008236]"
                  : "bg-[#DBEAFE] text-[#1E40AF]"
              }`}
            >
              <IoCheckboxOutline className="mr-2" />
              {isCheckedIn ? "Checked In" : "Registered"}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
          const isCheckedIn = row.original.status === "checked_in";
          const isLoading = checkingInId === row.original.id;

          return (
            <div className="flex flex-col items-center justify-center gap-3">
              {!isCheckedIn && (
                <button
                  onClick={() => handleCheckIn(row.original.id)}
                  disabled={isLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                    isLoading
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "bg-green-100 hover:bg-green-200 text-green-700"
                  }`}
                  title="Check In"
                >
                  <MdCheckCircle className="text-lg" />
                  <span className="hidden sm:inline">
                    {isLoading ? "Checking..." : "Check In"}
                  </span>
                </button>
              )}

              <button
                onClick={() => handleRemove(row.original.id)}
                disabled={removingId === row.original.id}
                className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition ${
                  removingId === row.original.id
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "bg-red-100 hover:bg-red-200 text-red-700"
                }`}
                title="Remove from Roster"
              >
                <MdDelete className="text-lg" />
                <span className="hidden sm:inline">
                  {removingId === row.original.id ? "Removing..." : "Remove"}
                </span>
              </button>
            </div>
          );
        },
      },
    ],
    [
      checkingInId,
      removingId,
      editingJerseyId,
      jerseyInput,
    ],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const stats = [
    { value: totalReferees, label: "Total Referees", color: "text-[#00AEEF]" },
    { value: checkedInCount, label: "Checked In", color: "text-green-600" },
  ];

  return (
    <div className="w-full">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className={`text-4xl font-bold ${stat.color} mb-2`}>
              {stat.value}
            </div>
            <div className="text-base text-gray-600 font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full min-w-[900px]">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-200 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      {header.column.getCanSort() ? (
                        <button
                          className="flex items-center gap-1 hover:text-gray-900 focus:outline-none transition"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getIsSorted() ? (
                            header.column.getIsSorted() === "asc" ? (
                              <MdArrowUpward className="text-blue-600" />
                            ) : (
                              <MdArrowDownward className="text-blue-600" />
                            )
                          ) : (
                            <span className="opacity-30">↕</span>
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
            <tbody className="divide-y divide-gray-100">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-500">
                    No referees found.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition-colors"
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

      {/* Referee Details Modal */}
      <RefereeDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        referee={selectedReferee}
      />
    </div>
  );
};

export default RosterTable;
