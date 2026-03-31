"use client";

import { Plus, Search } from "lucide-react";
import type { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { UserRoleItem } from "@/types/user-role/user-role-type";

type UserRoleTableToolbarProps = {
  table: Table<UserRoleItem>;
  onCreate: () => void;
};

export function UserRoleTableToolbar({
  table,
  onCreate,
}: UserRoleTableToolbarProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />

        <Input
          placeholder="Filtrar asignaciones..."
          value={(table.getColumn("full_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("full_name")?.setFilterValue(event.target.value)
          }
          className="h-11 rounded-xl border-slate-200 bg-white pl-10 shadow-none"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          onClick={onCreate}
          className="h-11 rounded-xl px-4"
        >
          <Plus className="mr-2 size-4" />
          Nueva asignación
        </Button>
      </div>
    </div>
  );
}