import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdClose,
  MdCheckCircle,
  MdDelete,
} from "react-icons/md";
import { IoCheckboxOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import Swal from "sweetalert2";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQueryClient } from "@tanstack/react-query";
import { BiOutline, BiPhone } from "react-icons/bi";

const RosterTable = ({ referees = [], campId }) => {
  const axiosInstance = useAxiosSecure();
  const queryClient = useQueryClient();

  // Check-in states
  const [checkingInId, setCheckingInId] = useState(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReferee, setSelectedReferee] = useState(null);

  // Jersey state
  const [editingJerseyId, setEditingJerseyId] = useState(null);
  const [jerseyInput, setJerseyInput] = useState("");

  //referee remove state
  const [removingId, setRemovingId] = useState(null);

  const queryData = queryClient.getQueryData(["referees", campId]) || referees;

  const data = useMemo(() => queryData, [queryData]);

  const CAMP_QUERY_KEY = ["camp-roster-details", campId];

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

    const previous = queryClient.getQueryData(CAMP_QUERY_KEY);

    // Optimistic update: modify referees array inside camp object
    queryClient.setQueryData(CAMP_QUERY_KEY, (old) => {
      if (!old?.referees) return old;
      return {
        ...old,
        referees: old.referees.map((ref) =>
          ref.id === refereeId ? { ...ref, status: "checked_in" } : ref,
        ),
      };
    });

    try {
      const res = await axiosInstance.put(
        `/v1/director/camp/${campId}/referee/${refereeId}/manual-checkin`,
      );

      queryClient.invalidateQueries({ queryKey: CAMP_QUERY_KEY });

      Swal.fire({
        title: "Success!",
        text: res?.data?.message || "Referee checked in successfully",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      queryClient.setQueryData(CAMP_QUERY_KEY, previous);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to check in referee.",
        icon: "error",
      });
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

    const previous = queryClient.getQueryData(CAMP_QUERY_KEY);

    // Optimistic remove
    queryClient.setQueryData(CAMP_QUERY_KEY, (old) => {
      if (!old?.referees) return old;
      return {
        ...old,
        referees: old.referees.filter((ref) => ref.id !== refereeId),
      };
    });

    try {
      await axiosInstance.delete(
        `/v1/director/camps/${campId}/referees/${refereeId}`,
      );

      queryClient.invalidateQueries({ queryKey: CAMP_QUERY_KEY });

      Swal.fire({
        title: "Removed!",
        text: `${refereeName} has been removed from the roster.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      queryClient.setQueryData(CAMP_QUERY_KEY, previous);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to remove referee.",
        icon: "error",
      });
    } finally {
      setRemovingId(null);
    }
  };

  const handleUpdateJersey = async (refereeId, jerseyNumber) => {
    const trimmed = jerseyNumber.trim();

    const previous = queryClient.getQueryData(CAMP_QUERY_KEY);

    // Optimistic update
    queryClient.setQueryData(CAMP_QUERY_KEY, (old) => {
      if (!old?.referees) return old;
      return {
        ...old,
        referees: old.referees.map((ref) =>
          ref.id === refereeId ? { ...ref, jourcy_number: trimmed } : ref,
        ),
      };
    });

    try {
      await axiosInstance.patch(
        `/v1/director/camp/${campId}/referee/${refereeId}/update-jourcy-number`,
        null,
        { params: { jourcy_number: trimmed } },
      );

      queryClient.invalidateQueries({ queryKey: CAMP_QUERY_KEY });

      Swal.fire({
        title: "Updated!",
        text: "Jersey number saved",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      queryClient.setQueryData(CAMP_QUERY_KEY, previous);
      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message || "Failed to update jersey number.",
        icon: "error",
      });
    } finally {
      setEditingJerseyId(null);
      setJerseyInput("");
    }
  };

  const formatPhone = (phone) => {
    if (!phone) return "N/A";

    let digits = phone.replace(/\D/g, "");

    if (digits.length <= 6) {
      return digits;
    }

    const formatted = digits.replace(/(\d{1,4})(?=\d)/g, "$1 ").trim();

    return formatted;
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
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
        cell: ({ row }) => (
          <div className="text-center font-medium text-gray-900">
            {row.original.assigned_games_count ?? "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
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
      campId,
      axiosInstance,
      queryClient,
      referees,
    ],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
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

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedReferee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 backdrop-blur-[6px] flex items-center justify-center bg-black/40 px-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.4,
              }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  Referee Details
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition"
                  aria-label="Close modal"
                >
                  <MdClose className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex flex-col items-center text-center">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    src={selectedReferee.avatar || "/default-avatar.png"}
                    alt={selectedReferee.name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 mb-4"
                    onError={(e) => (e.target.src = "/default-avatar.png")}
                  />
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedReferee.name || "Unnamed Referee"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Jersey ID: #{selectedReferee.jourcy_number}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <BiOutline className="text-gray-400 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Biography</p>
                      <p className="font-medium text-gray-900">
                        {selectedReferee.biography || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MdEmail className="text-gray-400 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">
                        {selectedReferee.email || "N/A"}
                      </p>
                    </div>
                  </div>

                  {selectedReferee.phone && (
                    <div className="flex items-center gap-3">
                      <MdPhone className="text-gray-400 text-xl" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium text-gray-900 tracking-wide">
                          {formatPhone(selectedReferee.phone)}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedReferee.address && (
                    <div className="flex items-center gap-3">
                      <MdLocationOn className="text-gray-400 text-xl" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium text-gray-900">
                          {selectedReferee.address}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <IoCheckboxOutline className="text-gray-400 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p
                        className={`font-medium ${
                          selectedReferee.status === "checked_in"
                            ? "text-[#008236]"
                            : "text-[#1E40AF]"
                        }`}
                      >
                        {selectedReferee.status === "checked_in"
                          ? "Checked In"
                          : "Registered"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">Games Assigned</p>
                    <p className="text-2xl font-bold text-[#00AEEF]">
                      {selectedReferee.assigned_games_count ?? 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RosterTable;
