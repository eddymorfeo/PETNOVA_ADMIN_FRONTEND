"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { TimeOffRowActions } from "@/components/pages/time-off/table/time-off-row-actions";
import type { TimeOffItem } from "@/types/time-off/time-off.type";
import { formatTimeOffDate } from "@/utils/time-off/time-off-mappers";

type BuildTimeOffColumnsParams = {
  onEdit: (timeOffItem: TimeOffItem) => void;
  onDelete: (timeOffItem: TimeOffItem) => void;
};

export function buildTimeOffColumns({
  onEdit,
  onDelete,
}: BuildTimeOffColumnsParams): ColumnDef<TimeOffItem>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(Boolean(value))
          }
          aria-label="Seleccionar todas las filas"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
          aria-label="Seleccionar fila"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "full_name",
      header: ({ column }) => (
        <Button
          type="button"
          variant="ghost"
          className="px-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Veterinario
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="min-w-52">
          <p className="font-medium text-slate-900">{row.original.full_name}</p>
          <p className="text-xs text-slate-500">@{row.original.username}</p>
        </div>
      ),
    },
    {
      accessorKey: "starts_at",
      header: "Inicio",
      cell: ({ row }) => formatTimeOffDate(row.original.starts_at),
    },
    {
      accessorKey: "ends_at",
      header: "Término",
      cell: ({ row }) => formatTimeOffDate(row.original.ends_at),
    },
    {
      accessorKey: "reason",
      header: "Motivo",
      cell: ({ row }) => row.original.reason || "-",
    },
    {
      accessorKey: "created_at",
      header: "Creado",
      cell: ({ row }) => formatTimeOffDate(row.original.created_at),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <TimeOffRowActions
            timeOffItem={row.original}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ),
    },
  ];
}