import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { MdEmail, MdPhone, MdContentCopy } from 'react-icons/md';
import { IoCheckboxOutline, IoTrashOutline } from 'react-icons/io5';

const RosterTable = () => {
  

  const data = useMemo(
    () => [
      {
        id: 1,
        name: 'Emily Chen',
        location: 'Los Angeles, USA',
        email: 'sarah.j@email.com',
        phone: 'sarah.j@email.com',
        jerseyNumber: '#8578546',
        gamesAssigned: 5,
        status: 'Checked in',
      },
      {
        id: 2,
        name: 'Emily Chen',
        location: 'Los Angeles, USA',
        email: 'sarah.j@email.com',
        phone: 'sarah.j@email.com',
        jerseyNumber: '#8578546',
        gamesAssigned: 5,
        status: 'Checked in',
      },
      {
        id: 3,
        name: 'Emily Chen',
        location: 'Los Angeles, USA',
        email: 'sarah.j@email.com',
        phone: 'sarah.j@email.com',
        jerseyNumber: '#8578546',
        gamesAssigned: 5,
        status: 'Checked in',
      },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white text-sm font-semibold shrink-0">
              EC
            </div>
            <div>
              <div className="font-semibold text-gray-900 hover:underline cursor-pointer">{row.original.name}</div>
              <div className="text-sm text-gray-500">{row.original.location}</div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'contact',
        header: 'Contact',
        cell: ({ row }) => (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-700">
              <MdEmail className="text-gray-400" />
              <span className="text-sm">{row.original.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <MdPhone className="text-gray-400" />
              <span className="text-sm">{row.original.phone}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'jerseyNumber',
        header: 'Jersey Number (Optional)',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <MdContentCopy className="text-gray-400 cursor-pointer hover:text-gray-600" />
            <span className="text-sm text-gray-700">{row.original.jerseyNumber}</span>
            <button className="text-red-500 hover:text-red-600 ml-24">
              <IoTrashOutline className="w-4 h-4" />
            </button>
          </div>
        ),
      },
      {
        accessorKey: 'gamesAssigned',
        header: 'Games Assigned',
        cell: ({ getValue }) => (
          <div className="text-center font-medium text-gray-900">{getValue()}</div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => (
          <div className="flex justify-center items-center text-center py-1 gap-2 bg-[#DCFCE7] w-[70%]">
            <IoCheckboxOutline className="text-[#008236]" />
            <span className="text-[#008236] font-medium text-sm">{getValue()}</span>
          </div>
        ),
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
    { value: '5', label: 'Total Referees', color: 'text-cyan-500' },
    { value: '4', label: 'Checked in', color: 'text-green-500' },
  ];

  return (
    <div>
      {/* Table Container */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-gray-200 bg-gray-50">
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
            <tbody className="bg-white">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className={`text-4xl font-medium ${stat.color} mb-2`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RosterTable;