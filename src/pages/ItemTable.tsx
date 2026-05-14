import { type InventoryItem } from "@/lib/types";

import {
  type CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { MoreHorizontal, TableOfContents } from "lucide-react";

type Props = {
  data: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
};

const ItemTable = ({ data, onEdit, onDelete }: Props) => {
  const ActionsCell = ({ row }: CellContext<InventoryItem, unknown>) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onEdit(row.original)}>
            Edit item
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(row.original.id)}
            className="text-red-500"
          >
            Delete item
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  ActionsCell.displayName = "ActionsCell";

  const StatusCell = ({ row }: CellContext<InventoryItem, unknown>) => {
    const status = row.original.status;

    const statusStyles = {
      "In stock": "bg-green-100 text-green-800",
      "Low stock": "bg-yellow-100 text-yellow-800",
      "Out of stock": "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[status]}`}
      >
        {status}
      </span>
    );
  };

  StatusCell.displayName = "StatusCell";
  const columnHelper = createColumnHelper<InventoryItem>();

  const columns = [
    columnHelper.display({
      id: "actions",
      header: () => <TableOfContents />,
      cell: ActionsCell,
    }),
    columnHelper.accessor("name", {
      header: "Product name",
    }),
    columnHelper.accessor("category", {
      header: "Category",
    }),
    columnHelper.accessor("quantity", {
      header: "Quantity",
    }),
    columnHelper.accessor("price", {
      header: "Price",
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: StatusCell,
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="rounded-lg overflow-hidden border border-border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ItemTable;
