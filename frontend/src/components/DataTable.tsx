import {
    flexRender,
    getCoreRowModel,
    useReactTable,
  } from "@tanstack/react-table";
  import type { ColumnDef } from "@tanstack/react-table";
  import Skeleton from "./ui/Skeleton";
  import EmptyState from "./ui/EmptyState";
  
  export default function DataTable<T>({
    data,
    columns,
    isLoading = false,
    emptyMessage = "No data available",
  }: {
    data: T[];
    columns: ColumnDef<T, any>[];
    isLoading?: boolean;
    emptyMessage?: string;
  }) {
    const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });
  
    const colSpan = columns.length;
  
    return (
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th key={h.id} className="px-3 py-2 text-left font-medium">
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={`skeleton-${rowIndex}`}>
                {Array.from({ length: colSpan }).map((_, colIndex) => (
                  <td key={`skeleton-${rowIndex}-${colIndex}`} className="px-3 py-2">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))
          ) : (
            table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="text-center py-8">
                  <EmptyState msg={emptyMessage} icon={undefined} title={undefined} action={undefined} />
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((r, idx) => (
                <tr
                  key={r.id}
                  className={idx % 2 ? "bg-white/60 dark:bg-gray-800/50" : ""}
                >
                  {r.getVisibleCells().map((c) => (
                    <td key={c.id} className="px-3 py-2">
                      {flexRender(c.column.columnDef.cell, c.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )
          )}
        </tbody>
      </table>
    );
  }  