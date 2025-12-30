import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { MdEmail } from "react-icons/md";
import { IoCheckboxOutline } from "react-icons/io5";

const RosterTable = ({ referees = [] }) => {
  const data = useMemo(() => referees, [referees]);

  // Calculate stats
  const totalReferees = referees.length;
  const checkedInCount = referees.filter((ref) => ref.status === "checked_in").length;

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
              <div className="font-semibold text-gray-900 hover:underline cursor-pointer">
                {row.original.name || "Unnamed Referee"}
              </div>
              <div className="text-sm text-gray-500">Referee</div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "Contact",
        cell: ({ row }) => (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-700">
              <MdEmail className="text-gray-400 text-lg" />
              <span className="text-sm truncate max-w-[200px]">
                {row.original.email || "N/A"}
              </span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "id",
        header: "Referee ID",
        cell: ({ getValue }) => (
          <div className="font-mono text-sm text-gray-700">
            #{getValue()}
          </div>
        ),
      },
      {
        accessorKey: "gamesAssigned",
        header: "Games Assigned",
        cell: () => (
          <div className="text-center font-medium text-gray-900">
            —
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
    ],
    []
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
            <div className="text-base text-gray-600 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Scrollable Table with Fixed Height */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto"> {/* ← Fixed height + vertical scroll */}
          <table className="w-full min-w-[800px]">
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
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-500">
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
  );
};

export default RosterTable;