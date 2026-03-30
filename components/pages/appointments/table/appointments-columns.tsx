"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { AppointmentsRowActions } from "@/components/pages/appointments/table/appointments-row-actions";
import { AppointmentsStatusBadge } from "@/components/pages/appointments/table/appointments-status-badge";
import type { AppointmentItem } from "@/types/appointments/appointment-type";

function formatDateTime(value: string | null): string {
  if (!value) return "-";

  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

type BuildAppointmentsColumnsParams = {
  onEdit: (appointment: AppointmentItem) => void;
  onCancel: (appointment: AppointmentItem) => void;
};

export function buildAppointmentsColumns({
  onEdit,
  onCancel,
}: BuildAppointmentsColumnsParams): ColumnDef<AppointmentItem>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(Boolean(value))}
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
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => (
        <AppointmentsStatusBadge status={row.original.status} />
      ),
    },
    {
      accessorKey: "client_name",
      header: ({ column }) => (
        <Button
          type="button"
          variant="ghost"
          className="px-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cliente
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="min-w-44">
          <p className="font-medium text-slate-900">
            {row.original.client_name ?? "-"}
          </p>
          <p className="text-xs text-slate-500">
            {row.original.pet_name ?? "Sin mascota"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "veterinarian_name",
      header: "Veterinario",
      cell: ({ row }) => row.original.veterinarian_name ?? "-",
    },
    {
      accessorKey: "appointment_type_name",
      header: "Tipo de cita",
      cell: ({ row }) => row.original.appointment_type_name ?? "-",
    },
    {
      accessorKey: "starts_at",
      header: "Inicio",
      cell: ({ row }) => formatDateTime(row.original.starts_at),
    },
    {
      accessorKey: "ends_at",
      header: "Término",
      cell: ({ row }) => formatDateTime(row.original.ends_at),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <AppointmentsRowActions
            appointment={row.original}
            onEdit={onEdit}
            onCancel={onCancel}
          />
        </div>
      ),
    },
  ];
}