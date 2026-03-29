"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { UsersRowActions } from "@/components/pages/users/table/users-row-actions";
import { UsersStatusBadge } from "@/components/pages/users/table/users-status-badge";
import type { UserItem } from "@/types/users/user.type";

function formatDate(date: string | null) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

type BuildUsersColumnsParams = {
  onEdit: (user: UserItem) => void;
  onDelete: (user: UserItem) => void;
};

export function buildUsersColumns({
  onEdit,
  onDelete,
}: BuildUsersColumnsParams): ColumnDef<UserItem>[] {
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
      cell: ({ row }) => <UsersStatusBadge isActive={row.original.is_active} />,
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
          Nombre
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
      accessorKey: "created_at",
      header: "Creado",
      cell: ({ row }) => formatDate(row.original.created_at),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <UsersRowActions
            user={row.original}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ),
    },
  ];
}