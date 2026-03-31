"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { UserRoleRowActions } from "@/components/pages/user-role/table/user-role-row-actions";
import type { UserRoleItem } from "@/types/user-role/user-role-type";
import { formatUserRoleDate } from "@/utils/user-role/user-role-mappers";

type BuildUserRoleColumnsParams = {
  onDelete: (userRole: UserRoleItem) => void;
};

export function buildUserRoleColumns({
  onDelete,
}: BuildUserRoleColumnsParams): ColumnDef<UserRoleItem>[] {
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
          Usuario
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
      accessorKey: "role_name",
      header: "Rol",
      cell: ({ row }) => (
        <div className="min-w-40">
          <p className="font-medium text-slate-900">{row.original.role_name}</p>
          <p className="text-xs text-slate-500">{row.original.role_code}</p>
        </div>
      ),
    },
    {
      accessorKey: "role_description",
      header: "Descripción",
      cell: ({ row }) => row.original.role_description || "-",
    },
    {
      accessorKey: "created_at",
      header: "Asignado",
      cell: ({ row }) => formatUserRoleDate(row.original.created_at),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <UserRoleRowActions userRole={row.original} onDelete={onDelete} />
        </div>
      ),
    },
  ];
}