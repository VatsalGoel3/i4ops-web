import {
    flexRender,
    getCoreRowModel,
    useReactTable,
  } from "@tanstack/react-table";
  import type { ColumnDef } from "@tanstack/react-table";
  
  export default function DataTable<T>({
    data,
    columns,
  }: {
    data: T[];
    columns: ColumnDef<T, any>[];
  }) {
    const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });
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
          {table.getRowModel().rows.map((r, idx) => (
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
          ))}
        </tbody>
      </table>
    );
  }  