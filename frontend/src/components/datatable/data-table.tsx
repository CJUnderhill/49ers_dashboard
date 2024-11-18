"use client"
import * as React from "react"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  globalFilter: string;
  onRowClick: (row: TData) => void;
  selectedWeek: number | null;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  globalFilter,
  onRowClick,
  selectedWeek
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [selectedRow, setSelectedRow] = React.useState<string | null>(null);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: (filter) => {
      console.log(filter)
    },
    getFilteredRowModel: getFilteredRowModel(),
    columnResizeMode: "onChange",
  })

  const handleRowClick = (rowId: string, rowData: TData) => {
    if (selectedRow === rowId) {
      setSelectedRow(null); // Deselect if already selected
      onRowClick(rowData);
    } else {
      setSelectedRow(rowId); // Select the clicked row
      onRowClick(rowData);
    }
  };

  return (
    <div className="">
      <Table>
        <TableHeader className="p-0 bg-black bg-opacity-50 h-[40px] [&_tr]:border-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-0">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="border-0">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
          <TableRow className="h-3"></TableRow>
        </TableHeader>
        <TableBody className="bg-white">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={`transition-colors hover:bg-[#AA00001A] ${selectedRow === row.id
                    ? "bg-[#AA00001A] border border-2 border-red-500"
                    : ""
                  }`}
                onClick={() => handleRowClick(row.id, row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}