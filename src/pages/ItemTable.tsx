import { type InventoryItem } from "@/lib/types";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  type CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { useState } from "react";
import {} from "@tanstack/react-table";

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
import { LoaderCircle } from "lucide-react";

type Props = {
  data: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
  deleteLoading: boolean;
};

const ItemTable = ({ data, onEdit, onDelete, deleteLoading }: Props) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const uniqueCategories = [...new Set(data.map((item) => item.category))];
  const ActionsCell = ({ row }: CellContext<InventoryItem, unknown>) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-[#303030] border-[#292c33] text-white"
        >
          <DropdownMenuLabel className="text-gray-400">
            Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-[#292c33]" />
          <DropdownMenuItem
            onClick={() => onEdit(row.original)}
            className="hover:bg-[#3a3a3a] cursor-pointer"
          >
            Edit item
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-500 hover:bg-[#3a3a3a] cursor-pointer"
            onSelect={(e) => {
              e.preventDefault();
              onDelete(row.original.id);
            }}
          >
            {deleteLoading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Delete Item"
            )}
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

  const PriceCell = ({ row }: CellContext<InventoryItem, unknown>) => {
    return <span>₦{row.original.price.toLocaleString("en-US")}</span>;
  };
  PriceCell.displayName = "PriceCell";

  const QuantityCell = ({ row }: CellContext<InventoryItem, unknown>) => {
    return <span>{row.original.quantity.toLocaleString("en-US")}</span>;
  };
  QuantityCell.displayName = "QuantityCell";

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
      cell: QuantityCell,
    }),
    columnHelper.accessor("price", {
      header: "Price",
      cell: PriceCell,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: StatusCell,
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  return (
    <>
      <div className="flex gap-3 mb-4">
        <Select
          onValueChange={(value) => {
            setColumnFilters((prev) => {
              const others = prev.filter((f) => f.id !== "category");
              return value !== "all"
                ? [...others, { id: "category", value }]
                : others;
            });
          }}
        >
          <SelectTrigger className="bg-[#303030] text-white border-[#292c33] w-40">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent className="bg-[#303030] text-white border-[#292c33]">
            <SelectItem value="all">All categories</SelectItem>
            {uniqueCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => {
            setColumnFilters((prev) => {
              const others = prev.filter((f) => f.id !== "status");
              return value !== "all"
                ? [...others, { id: "status", value }]
                : others;
            });
          }}
        >
          <SelectTrigger className="bg-[#303030] text-white border-[#292c33] w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent className="bg-[#303030] text-white border-[#292c33]">
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="In stock">In stock</SelectItem>
            <SelectItem value="Low stock">Low stock</SelectItem>
            <SelectItem value="Out of stock">Out of stock</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-lg overflow-hidden border border-[#404040] overflow-x-auto ">
        <Table className="bg-[#303030] text-white">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-white border-x-2 border-[#404040]"
                  >
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
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-gray-400 py-10"
                >
                  No items found
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="border-x-2 border-[#404040]"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default ItemTable;
