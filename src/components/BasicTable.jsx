import React from 'react'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
}
    from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import mzgbImage from '../assets/mzgb.jpeg'

export default function BasicTable({ response, date, refetch }) {

    const columns = useMemo(() => [
        { 
            header: 'Team', 
            accessorKey: 'team',
            className: 'w-10 sm:w-auto', // Smaller width on mobile
            cell: ({ getValue }) => {
                const teamName = getValue();
                return teamName === 'Первые встречные' 
                    ? `${teamName} 👑` 
                    : teamName;
            }
        },
        { 
            header: 'Games', 
            accessorKey: 'games',
            className: 'w-10' // Fixed width for games
        },
        { 
            header: 'Wins', 
            accessorKey: 'wins',
            className: 'hidden sm:table-cell' // Hide on mobile
        },
        { 
            header: 'Points', 
            accessorKey: 'points',
            className: 'w-10' // Fixed width for points
        },
        { 
            header: 'Season Games', 
            accessorKey: 'season_games',
            className: 'hidden lg:table-cell' // Hide on mobile and tablet
        },
        { 
            header: 'Season Wins', 
            accessorKey: 'season_wins',
            className: 'hidden lg:table-cell' // Hide on mobile and tablet
        },
        { 
            header: 'Season Points', 
            accessorKey: 'season_points',
            className: 'hidden lg:table-cell' // Hide on mobile and tablet
        },
    ], []);

    const data = useMemo(() => response, []);

    const [sorting, setSorting] = useState([]);
    const [filtering, setFiltering] = useState('');

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting: sorting,
            globalFilter: filtering,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering,
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 sm:p-6">
            {/* Header with Logo and Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-center">
                <img className='w-11 h-11' src={mzgbImage} alt="city" />
                <div className="hidden sm:flex relative w-72">
                    <input
                        type="text"
                        placeholder="Search teams..."
                        value={filtering}
                        onChange={(e) => setFiltering(e.target.value)}
                        className="w-full px-4 py-2 pr-10 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-200 transition-all duration-200"
                    />
                    <svg 
                        className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Table wrapper */}
            <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                onClick={header.column.getToggleSortingHandler()}
                                                className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${header.column.columnDef.className || ''}`}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {header.column.getIsSorted() && (
                                                        <span className="text-blue-500">
                                                            {header.column.getIsSorted() === 'asc' ? '↑' : '↓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                                {table.getRowModel().rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className={`transition-colors duration-150 ${
                                            row.original.team === 'Первые встречные' 
                                                ? 'bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30' 
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                key={cell.id}
                                                className={`px-6 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap ${cell.column.columnDef.className || ''}`}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Controls wrapper */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                {/* Status and Refresh */}
                <div className="flex items-center gap-3 order-2 sm:order-1">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Last sync: {date}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                        <svg 
                            className="w-4 h-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                </div>

                {/* Pagination */}
                <div className="flex flex-wrap gap-2 order-1 sm:order-2">
                    <button
                        type="button"
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => table.firstPage()}
                    >
                        First
                    </button>
                    <button
                        type="button"
                        className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </button>
                    <button
                        type="button"
                        className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </button>
                    <button
                        type="button"
                        className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => table.lastPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Last
                    </button>
                </div>
            </div>
        </div>
    );
}
