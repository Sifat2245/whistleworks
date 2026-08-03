import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { MdCheckCircle, MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { BiPhone } from "react-icons/bi";
import {
  LuUsers,
  LuUserCheck,
  LuClock,
  LuTrophy,
  LuArrowUp,
  LuArrowDown,
  LuArrowUpDown,
  LuInbox,
  LuCheck,
  LuPencil,
  LuSave,
} from "react-icons/lu";
import { cn } from "@/lib/utils";
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
  const gamesAssigned = referees.reduce(
    (sum, ref) => sum + (ref.assigned_games_count || 0),
    0,
  );

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
    const refereeName =
      referees.find((r) => r.id === refereeId)?.name || "Referee";

    try {
      await updateJerseyMutation.mutateAsync({
        refereeId,
        jourcyNumber: trimmed,
      });
      Swal.fire({
        title: "Jersey Number Saved",
        text: `${refereeName}'s jersey number is now set to ${trimmed || "—"}.`,
        icon: "success",
        confirmButtonColor: "#00AEEF",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      const raw = error?.response?.data;
      const message =
        (typeof raw?.message === "string" && raw.message) ||
        (typeof raw?.data === "string" && raw.data) ||
        "Something went wrong while saving the jersey number.";

      Swal.fire({
        icon: "error",
        title: "Failed to Update Jersey",
        text: message,
        confirmButtonColor: "#ef4444",
      });
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

  const statusBadge = (status) => {
    const isCheckedIn = status === "checked_in";
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap",
          isCheckedIn
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-blue-50 text-blue-700 border border-blue-200",
        )}
      >
        {isCheckedIn ? <LuUserCheck className="w-3.5 h-3.5" /> : <LuClock className="w-3.5 h-3.5" />}
        {isCheckedIn ? "Checked In" : "Registered"}
      </span>
    );
  };

  const jerseyEditor = (referee) => {
    const jersey = referee.jourcy_number?.toString() || "";
    const isEditing = editingJerseyId === referee.id;

    if (isEditing) {
      return (
        <div className="flex items-center justify-center gap-1.5">
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
            className="w-20 px-2 py-1.5 text-center border-2 border-primary rounded-lg focus:outline-none focus:ring-4 focus:ring-primary/20 font-mono text-sm transition-all"
            placeholder="23"
          />
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleUpdateJersey(referee.id, jerseyInput)}
            className="p-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-white transition cursor-pointer"
            title="Save"
          >
            <LuSave className="w-4 h-4" />
          </button>
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
        title="Click to edit"
      >
        <span className="font-mono text-sm text-[#333] group-hover:text-primary transition-colors">
          {jersey || "-"}
        </span>
        <LuPencil className="w-3 h-3 text-gray-300 group-hover:text-primary inline-block ml-1.5" />
      </div>
    );
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
              className="w-10 h-10 rounded-full object-cover border-2 border-primary/20 shrink-0"
              onError={(e) => (e.target.src = "/default-avatar.png")}
            />
            <div>
              <button
                onClick={() => openModal(row.original)}
                className="font-medium text-[#333] hover:text-primary hover:underline cursor-pointer focus:outline-none transition-colors"
              >
                {row.original.name || "Unnamed Referee"}
              </button>
              <div className="text-xs text-[#666]">{row.original.address}</div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: "Contact",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-[#444]">
            <BiPhone className="text-[#999] text-lg" />
            <span className="text-sm font-medium tracking-wide">
              {formatPhone(row.original.phone)}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "jourcy_number",
        header: "Jersey ID",
        enableSorting: true,
        sortingFn: "alphanumeric",
        cell: ({ row }) => jerseyEditor(row.original),
      },
      {
        accessorKey: "assigned_games_count",
        header: "Games Assigned",
        enableSorting: true,
        sortingFn: "alphanumeric",
        cell: ({ row }) => (
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 min-w-7 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <LuTrophy className="w-3.5 h-3.5" />
              {row.original.assigned_games_count ?? 0}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        enableSorting: true,
        cell: ({ getValue }) => (
          <div className="flex justify-center">{statusBadge(getValue())}</div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
          const isCheckedIn = row.original.status === "checked_in";
          const isLoading = checkingInId === row.original.id;

          return (
            <div className="flex items-center justify-center gap-2">
              {!isCheckedIn && (
                <button
                  onClick={() => handleCheckIn(row.original.id)}
                  disabled={isLoading}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                    isLoading
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "bg-green-50 hover:bg-green-100 text-green-700 border border-green-200"
                  }`}
                  title="Check In"
                >
                  <MdCheckCircle className="text-base" />
                  <span className="hidden sm:inline">
                    {isLoading ? "Checking..." : "Check In"}
                  </span>
                </button>
              )}

              <button
                onClick={() => handleRemove(row.original.id)}
                disabled={removingId === row.original.id}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                  removingId === row.original.id
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                }`}
                title="Remove from Roster"
              >
                <MdDelete className="text-base" />
                <span className="hidden sm:inline">
                  {removingId === row.original.id ? "Removing..." : "Remove"}
                </span>
              </button>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checkingInId, removingId, editingJerseyId, jerseyInput],
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
    {
      value: totalReferees,
      label: "Total Referees",
      icon: <LuUsers />,
    },
    {
      value: checkedInCount,
      label: "Checked In",
      icon: <LuUserCheck />,
    },
    {
      value: totalReferees - checkedInCount,
      label: "Not Checked In",
      icon: <LuClock />,
    },
    {
      value: gamesAssigned,
      label: "Games Assigned",
      icon: <LuTrophy />,
    },
  ];

  return (
    <div className="w-full">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-border rounded-[10px] px-4 py-3.5 flex items-center gap-3 hover:shadow-sm transition-shadow"
          >
            <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-lg shrink-0">
              {stat.icon}
            </span>
            <div className="min-w-0">
              <p className="text-lg font-medium text-[#333]">{stat.value}</p>
              <p className="text-xs text-[#666]">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white border border-border rounded-[10px] overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto hide-scrollbar">
          <table className="w-full min-w-[900px]">
            <thead className="sticky top-0 bg-[#FAFAFA] border-b border-border z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-5 py-3.5 text-left text-xs font-semibold text-[#666] uppercase tracking-wider"
                    >
                      {header.column.getCanSort() ? (
                        <button
                          className="flex items-center gap-1 hover:text-primary focus:outline-none transition cursor-pointer"
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
            <tbody className="divide-y divide-border">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 px-6">
                    <LuInbox className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-[#333] mb-2">
                      No Referees Found
                    </h3>
                    <p className="text-sm text-[#666]">
                      Try adjusting your search or check back later.
                    </p>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-primary/[0.03] transition-colors"
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
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-3">
        {referees.length === 0 ? (
          <div className="bg-white border border-border rounded-[10px] py-16 text-center">
            <LuInbox className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#333] mb-2">
              No Referees Found
            </h3>
            <p className="text-sm text-[#666]">
              Try adjusting your search or check back later.
            </p>
          </div>
        ) : (
          referees.map((referee) => (
            <div
              key={referee.id}
              className="bg-white border border-border rounded-[10px] p-4"
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <img
                  src={referee.avatar || "/default-avatar.png"}
                  alt={referee.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/20 shrink-0"
                  onError={(e) => (e.target.src = "/default-avatar.png")}
                />
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => openModal(referee)}
                    className="font-medium text-[#333] hover:text-primary truncate block w-full text-left transition-colors"
                  >
                    {referee.name || "Unnamed Referee"}
                  </button>
                  <p className="text-xs text-[#666] truncate">
                    {referee.address}
                  </p>
                </div>
                {statusBadge(referee.status)}
              </div>

              {/* Details */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 rounded-lg bg-[#FAFAFA] border border-border px-3 py-2">
                  <BiPhone className="text-primary shrink-0" />
                  <span className="text-xs text-[#555] truncate">
                    {formatPhone(referee.phone)}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-[#FAFAFA] border border-border px-3 py-2">
                  <LuTrophy className="text-primary shrink-0" />
                  <span className="text-xs text-[#555]">
                    {referee.assigned_games_count ?? 0} games
                  </span>
                </div>
                <div className="rounded-lg bg-[#FAFAFA] border border-border px-3 py-2">
                  {jerseyEditor(referee)}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-3 flex gap-2">
                {referee.status !== "checked_in" && (
                  <button
                    onClick={() => handleCheckIn(referee.id)}
                    disabled={checkingInId === referee.id}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-medium transition cursor-pointer bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 disabled:opacity-60"
                  >
                    <LuCheck className="w-4 h-4" />
                    {checkingInId === referee.id ? "Checking..." : "Check In"}
                  </button>
                )}
                <button
                  onClick={() => handleRemove(referee.id)}
                  disabled={removingId === referee.id}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-medium transition cursor-pointer bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 disabled:opacity-60"
                >
                  <MdDelete className="w-4 h-4" />
                  {removingId === referee.id ? "Removing..." : "Remove"}
                </button>
              </div>
            </div>
          ))
        )}
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
