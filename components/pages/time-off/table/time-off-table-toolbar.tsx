"use client";

import { Plus, Search } from "lucide-react";
import type { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { TimeOffItem } from "@/types/time-off/time-off.type";

type TimeOffTableToolbarProps = {
  table: Table<TimeOffItem>;
  onCreate: () => void;
};

export function TimeOffTableToolbar({
  table,
  onCreate,
}: TimeOffTableToolbarProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />

        <Input
          placeholder="Filtrar bloqueos..."
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
          Nuevo bloqueo
        </Button>
      </div>
    </div>
  );
}