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
  LuDownload,
  LuSearch,
  LuX,
} from "react-icons/lu";
import { cn } from "@/lib/utils";
import RefereeDetailsModal from "./RefereeDetailsModal";
import { useExportReferees } from "@/hooks/api/director-hooks/useExport";
import {
  useCheckInReferee,
  useRemoveRefereeFromRoster,
  useUpdateJerseyNumber,
} from "@/hooks/api/director-hooks/useRosterForDirector";

// Avatar component with fallback initials
const RefereeAvatar = ({ src, name, className = "w-10 h-10 text-xs" }) => {
  const [hasError, setHasError] = useState(false);

  const initials = useMemo(() => {
    if (!name) return "RF";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [name]);

  if (!src || hasError) {
    return (
      <div
        className={cn(
          "rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-sky-100 border border-primary/30 text-primary font-bold flex items-center justify-center shrink-0 select-none shadow-xs",
          className
        )}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name || "Referee"}
      className={cn(
        "rounded-full object-cover border-2 border-primary/20 shrink-0 shadow-xs",
        className
      )}
      onError={() => setHasError(true)}
    />
  );
};

const RosterTable = ({
  referees = [],
  campId,
  searchQuery = "",
  setSearchQuery,
}) => {
  // Sorting state
  const [sorting, setSorting] = useState([]);

  // Check-in & Remove states
  const [checkingInId, setCheckingInId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReferee, setSelectedReferee] = useState(null);

  // Jersey state
  const [editingJerseyId, setEditingJerseyId] = useState(null);
  const [jerseyInput, setJerseyInput] = useState("");

  // Mutation hooks
  const checkInMutation = useCheckInReferee(campId);
  const removeMutation = useRemoveRefereeFromRoster(campId);
  const updateJerseyMutation = useUpdateJerseyNumber(campId);

  // Export CSV
  const { mutate: exportReferees, isPending: isExporting } =
    useExportReferees(campId);

  // Stats calculation
  const totalRefereesCount = referees.length;
  const checkedInCount = useMemo(
    () => referees.filter((ref) => ref.status === "checked_in").length,
    [referees]
  );
  const notCheckedInCount = totalRefereesCount - checkedInCount;
  const gamesAssignedCount = useMemo(
    () =>
      referees.reduce(
        (sum, ref) => sum + (ref.assigned_games_count || 0),
        0
      ),
    [referees]
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
      confirmButtonColor: "#10b981",
    });
    if (!result.isConfirmed) return;

    setCheckingInId(refereeId);

    try {
      await checkInMutation.mutateAsync(refereeId);
    } catch {
      // Error handled by hook
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
      confirmButtonColor: "#ef4444",
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
      // Error handled by hook
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
        text: `${refereeName}'s jersey number is now set to ${trimmed ? `#${trimmed}` : "—"}.`,
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
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      return digits.length === 0 ? "N/A" : digits;
    }
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
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shadow-2xs",
          isCheckedIn
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-sky-50 text-sky-700 border border-sky-200"
        )}
      >
        {isCheckedIn ? (
          <LuUserCheck className="w-3.5 h-3.5 text-emerald-600" />
        ) : (
          <LuClock className="w-3.5 h-3.5 text-sky-600" />
        )}
        {isCheckedIn ? "Checked In" : "Registered"}
      </span>
    );
  };

  const jerseyEditor = (referee) => {
    const jersey = referee.jourcy_number?.toString() || "";
    const isEditing = editingJerseyId === referee.id;

    if (isEditing) {
      return (
        <div
          className="flex items-center justify-center gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
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
            className="w-16 px-2 py-1 text-center border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono text-xs font-semibold bg-white shadow-xs"
            placeholder="23"
          />
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleUpdateJersey(referee.id, jerseyInput)}
            className="p-1.5 rounded-md bg-primary text-white hover:bg-primary/90 transition cursor-pointer shadow-xs"
            title="Save Jersey"
          >
            <LuCheck className="w-3.5 h-3.5" />
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setEditingJerseyId(null);
              setJerseyInput("");
            }}
            className="p-1.5 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 transition cursor-pointer"
            title="Cancel"
          >
            <LuX className="w-3.5 h-3.5" />
          </button>
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={() => {
          setEditingJerseyId(referee.id);
          setJerseyInput(jersey);
        }}
        className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 transition cursor-pointer group"
        title="Click to edit jersey number"
      >
        <span className="font-mono text-xs font-semibold text-gray-700 group-hover:text-primary transition-colors">
          {jersey ? `#${jersey}` : "—"}
        </span>
        <LuPencil className="w-3 h-3 text-gray-300 group-hover:text-primary transition-colors" />
      </button>
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
            <RefereeAvatar
              src={row.original.avatar}
              name={row.original.name}
              className="w-10 h-10 text-xs"
            />
            <div>
              <button
                onClick={() => openModal(row.original)}
                className="font-semibold text-gray-900 hover:text-primary hover:underline cursor-pointer focus:outline-none transition-colors text-left text-sm"
              >
                {row.original.name || "Unnamed Referee"}
              </button>
              {row.original.address && (
                <div className="text-xs text-gray-500 truncate max-w-[200px]">
                  {row.original.address}
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: "Contact",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-gray-700">
            <BiPhone className="text-gray-400 text-base shrink-0" />
            <span className="text-xs sm:text-sm font-medium tracking-wide">
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
        cell: ({ row }) => (
          <div className="text-center">{jerseyEditor(row.original)}</div>
        ),
      },
      {
        accessorKey: "assigned_games_count",
        header: "Games Assigned",
        enableSorting: true,
        sortingFn: "alphanumeric",
        cell: ({ row }) => (
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    isLoading
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                  }`}
                  title="Check In"
                >
                  <MdCheckCircle className="text-sm" />
                  <span>{isLoading ? "Checking..." : "Check In"}</span>
                </button>
              )}

              <button
                onClick={() => handleRemove(row.original.id)}
                disabled={removingId === row.original.id}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  removingId === row.original.id
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                }`}
                title="Remove from Roster"
              >
                <MdDelete className="text-sm" />
                <span>
                  {removingId === row.original.id ? "Removing..." : "Remove"}
                </span>
              </button>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checkingInId, removingId, editingJerseyId, jerseyInput]
  );

  const table = useReactTable({
    data: referees,
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
      value: totalRefereesCount,
      label: "Total Referees",
      icon: <LuUsers />,
    },
    {
      value: checkedInCount,
      label: "Checked In",
      icon: <LuUserCheck />,
    },
    {
      value: notCheckedInCount,
      label: "Not Checked In",
      icon: <LuClock />,
    },
    {
      value: gamesAssignedCount,
      label: "Games Assigned",
      icon: <LuTrophy />,
    },
  ];

  return (
    <div className="w-full">
      {/* Search Input Bar + Export CSV Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            placeholder="Search referees by name, email, phone, or ID..."
            className="w-full pl-11 pr-10 py-3 bg-white border border-border rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-sm sm:text-base text-gray-800 placeholder-gray-400 transition shadow-xs"
          />
          {searchQuery && setSearchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition cursor-pointer"
              aria-label="Clear search"
            >
              <LuX className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => exportReferees()}
          disabled={isExporting}
          className="inline-flex shrink-0 items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border bg-white text-gray-800 font-semibold text-sm whitespace-nowrap transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LuDownload className="text-base text-primary" />
          {isExporting ? "Exporting..." : "Export CSV"}
        </button>
      </div>

      {/* Stat Cards Display */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-border rounded-xl px-4 py-3.5 flex items-center gap-3 shadow-xs"
          >
            <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-lg shrink-0">
              {stat.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-base sm:text-lg font-bold leading-tight text-gray-900">
                {stat.value}
              </p>
              <p className="text-xs font-medium text-gray-500 truncate mt-0.5">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white border border-border rounded-xl overflow-hidden shadow-xs">
        <div className="max-h-[600px] overflow-y-auto hide-scrollbar">
          <table className="w-full min-w-[900px]">
            <thead className="sticky top-0 bg-[#FAFAFA] border-b border-border z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider"
                    >
                      {header.column.getCanSort() ? (
                        <button
                          className="flex items-center gap-1 hover:text-primary focus:outline-none transition cursor-pointer"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getIsSorted() ? (
                            header.column.getIsSorted() === "asc" ? (
                              <LuArrowUp className="w-3.5 h-3.5 text-primary" />
                            ) : (
                              <LuArrowDown className="w-3.5 h-3.5 text-primary" />
                            )
                          ) : (
                            <LuArrowUpDown className="w-3.5 h-3.5 opacity-30" />
                          )}
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
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
                    <LuInbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-gray-800 mb-1">
                      No Referees Found
                    </h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
                      {searchQuery
                        ? "No referees matched your current search."
                        : "No referees available in this camp roster."}
                    </p>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery && setSearchQuery("")}
                        className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white font-medium text-xs transition cursor-pointer"
                      >
                        Clear Search
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-5 py-3.5">
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

      {/* Mobile Responsive Cards */}
      <div className="md:hidden flex flex-col gap-3">
        {referees.length === 0 ? (
          <div className="bg-white border border-border rounded-xl py-12 px-4 text-center">
            <LuInbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              No Referees Found
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              {searchQuery
                ? "No referees match your search."
                : "No referees found."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery && setSearchQuery("")}
                className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white font-medium text-xs transition cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          referees.map((referee) => (
            <div
              key={referee.id}
              className="bg-white border border-border rounded-xl p-4 shadow-xs"
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <RefereeAvatar
                  src={referee.avatar}
                  name={referee.name}
                  className="w-11 h-11 text-sm shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => openModal(referee)}
                    className="font-semibold text-gray-900 hover:text-primary truncate block w-full text-left transition-colors text-sm"
                  >
                    {referee.name || "Unnamed Referee"}
                  </button>
                  <p className="text-xs text-gray-500 truncate">
                    {referee.address || "No location specified"}
                  </p>
                </div>
                {statusBadge(referee.status)}
              </div>

              {/* Details Grid */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 rounded-lg bg-[#FAFAFA] border border-border px-3 py-2">
                  <BiPhone className="text-primary text-base shrink-0" />
                  <span className="text-xs text-gray-700 truncate font-medium">
                    {formatPhone(referee.phone)}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-[#FAFAFA] border border-border px-3 py-2">
                  <LuTrophy className="text-primary text-base shrink-0" />
                  <span className="text-xs text-gray-700 font-medium">
                    {referee.assigned_games_count ?? 0} games
                  </span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between rounded-lg bg-[#FAFAFA] border border-border px-3 py-2">
                <span className="text-xs text-gray-500 font-medium">
                  Jersey Number:
                </span>
                {jerseyEditor(referee)}
              </div>

              {/* Actions Bar */}
              <div className="mt-3 flex gap-2">
                {referee.status !== "checked_in" && (
                  <button
                    onClick={() => handleCheckIn(referee.id)}
                    disabled={checkingInId === referee.id}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 disabled:opacity-60"
                  >
                    <LuCheck className="w-4 h-4" />
                    {checkingInId === referee.id ? "Checking..." : "Check In"}
                  </button>
                )}
                <button
                  onClick={() => handleRemove(referee.id)}
                  disabled={removingId === referee.id}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 disabled:opacity-60"
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
