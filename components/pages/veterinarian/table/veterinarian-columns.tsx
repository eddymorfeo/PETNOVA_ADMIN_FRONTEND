"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { VeterinarianRowActions } from "@/components/pages/veterinarian/table/veterinarian-row-actions";
import { VeterinarianStatusBadge } from "@/components/pages/veterinarian/table/veterinarian-status-badge";
import type { VeterinarianItem } from "@/types/veterinarian/veterinarian.type";
import { formatVeterinarianDate } from "@/utils/veterinarian/veterinarian-mappers";

type BuildVeterinarianColumnsParams = {
  onEdit: (veterinarian: VeterinarianItem) => void;
  onDelete: (veterinarian: VeterinarianItem) => void;
};

export function buildVeterinarianColumns({
  onEdit,
  onDelete,
}: BuildVeterinarianColumnsParams): ColumnDef<VeterinarianItem>[] {
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
        <VeterinarianStatusBadge isActive={row.original.is_active} />
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
          <p className="font-medium text-slate-900">{row.original.full_name}</p>
          <p className="text-xs text-slate-500">@{row.original.username}</p>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-slate-700">{row.original.email}</span>
      ),
    },
    {
      accessorKey: "phone",
      header: "Teléfono",
      cell: ({ row }) => row.original.phone || "-",
    },
    {
      accessorKey: "license_number",
      header: "Licencia",
      cell: ({ row }) => row.original.license_number || "-",
    },
    {
      accessorKey: "specialty_name",
      header: "Especialidad",
      cell: ({ row }) => row.original.specialty_name || "Sin especialidad",
    },
    {
      accessorKey: "created_at",
      header: "Creado",
      cell: ({ row }) => formatVeterinarianDate(row.original.created_at),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <VeterinarianRowActions
            veterinarian={row.original}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ),
    },
  ];
}