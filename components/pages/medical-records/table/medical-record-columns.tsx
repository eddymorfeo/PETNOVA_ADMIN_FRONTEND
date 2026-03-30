"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { MedicalRecordsRowActions } from "@/components/pages/medical-records/table/medical-record-row-actions";
import { MedicalRecordsStatusBadge } from "@/components/pages/medical-records/table/medical-record-status-badge";
import type { ConsultationItem } from "@/types/medical-records/medical-record.type";

function formatDate(value: string | null): string {
  if (!value) return "-";

  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

type BuildMedicalRecordsColumnsParams = {
  onEdit: (consultation: ConsultationItem) => void;
  onDelete: (consultation: ConsultationItem) => void;
};

export function buildMedicalRecordsColumns({
  onEdit,
  onDelete,
}: BuildMedicalRecordsColumnsParams): ColumnDef<ConsultationItem>[] {
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
      id: "record_status",
      header: "Estado",
      cell: () => <MedicalRecordsStatusBadge />,
    },
    {
      accessorKey: "pet_name",
      header: ({ column }) => (
        <Button
          type="button"
          variant="ghost"
          className="px-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mascota
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="min-w-44">
          <p className="font-medium text-slate-900">
            {row.original.pet_name ?? "-"}
          </p>
          <p className="text-xs text-slate-500">
            {row.original.client_name ?? "Sin cliente"}
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
      accessorKey: "diagnosis",
      header: "Diagnóstico",
      cell: ({ row }) => row.original.diagnosis ?? "-",
    },
    {
      accessorKey: "summary",
      header: "Resumen",
      cell: ({ row }) => (
        <span className="line-clamp-2 max-w-[280px] text-slate-700">
          {row.original.summary ?? "-"}
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Creado",
      cell: ({ row }) => formatDate(row.original.created_at),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <MedicalRecordsRowActions
            consultation={row.original}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ),
    },
  ];
}