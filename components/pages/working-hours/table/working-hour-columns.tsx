"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { WorkingHourRowActions } from "@/components/pages/working-hours/table/working-hour-row-actions";
import { WorkingHourStatusBadge } from "@/components/pages/working-hours/table/working-hour-status-badge";
import type { WorkingHourItem } from "@/types/working-hours/working-hour.type";
import {
  formatWorkingHourDate,
  getWeekdayLabel,
  normalizeTimeValue,
} from "@/utils/working-hours/working-hour-mappers";

type BuildWorkingHourColumnsParams = {
  onEdit: (workingHour: WorkingHourItem) => void;
  onDelete: (workingHour: WorkingHourItem) => void;
};

export function buildWorkingHourColumns({
  onEdit,
  onDelete,
}: BuildWorkingHourColumnsParams): ColumnDef<WorkingHourItem>[] {
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
      accessorKey: "is_active",
      header: "Estado",
      cell: ({ row }) => (
        <WorkingHourStatusBadge isActive={row.original.is_active} />
      ),
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
          <p className="font-medium text-slate-900">
            {row.original.full_name || "Sin nombre"}
          </p>
          <p className="text-xs text-slate-500">
            @{row.original.username || "sin-usuario"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "weekday",
      header: "Día",
      cell: ({ row }) => getWeekdayLabel(row.original.weekday),
    },
    {
      accessorKey: "start_time",
      header: "Inicio",
      cell: ({ row }) => normalizeTimeValue(row.original.start_time),
    },
    {
      accessorKey: "end_time",
      header: "Término",
      cell: ({ row }) => normalizeTimeValue(row.original.end_time),
    },
    {
      accessorKey: "slot_minutes",
      header: "Bloque",
      cell: ({ row }) => `${row.original.slot_minutes} min`,
    },
    {
      accessorKey: "created_at",
      header: "Creado",
      cell: ({ row }) => formatWorkingHourDate(row.original.created_at),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <WorkingHourRowActions
            workingHour={row.original}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ),
    },
  ];
}