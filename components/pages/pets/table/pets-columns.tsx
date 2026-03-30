"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { PetsRowActions } from "@/components/pages/pets/table/pets-row-actions";
import { PetsStatusBadge } from "@/components/pages/pets/table/pets-status-badge";
import type { PetItem } from "@/types/pets/pet.type";

function formatDate(date: string | null) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
  }).format(new Date(date));
}

type BuildPetsColumnsParams = {
  onEdit: (pet: PetItem) => void;
  onDelete: (pet: PetItem) => void;
};

export function buildPetsColumns({
  onEdit,
  onDelete,
}: BuildPetsColumnsParams): ColumnDef<PetItem>[] {
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
      accessorKey: "is_active",
      header: "Estado",
      cell: ({ row }) => <PetsStatusBadge isActive={row.original.is_active} />,
    },
    {
      accessorKey: "name",
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
        <div className="min-w-52">
          <p className="font-medium text-slate-900">{row.original.name}</p>
          <p className="text-xs text-slate-500">
            {row.original.species?.name ?? "Sin especie"}
          </p>
        </div>
      ),
    },
    {
      id: "client",
      header: "Cliente",
      cell: ({ row }) => (
        <div className="min-w-52">
          <p className="font-medium text-slate-900">
            {row.original.client?.full_name ?? "-"}
          </p>
          <p className="text-xs text-slate-500">
            {row.original.client?.document_id ?? "Sin documento"}
          </p>
        </div>
      ),
    },
    {
      id: "breed",
      header: "Raza",
      cell: ({ row }) => row.original.breed?.name ?? "-",
    },
    {
      accessorKey: "sex",
      header: "Sexo",
      cell: ({ row }) => row.original.sex ?? "-",
    },
    {
      accessorKey: "birth_date",
      header: "Nacimiento",
      cell: ({ row }) => formatDate(row.original.birth_date),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <PetsRowActions
            pet={row.original}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ),
    },
  ];
}