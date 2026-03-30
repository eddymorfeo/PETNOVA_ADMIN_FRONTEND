"use client";

import { Plus, Search } from "lucide-react";
import type { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { PetItem } from "@/types/pets/pet.type";

type PetsTableToolbarProps = {
  table: Table<PetItem>;
  onCreate: () => void;
};

export function PetsTableToolbar({ table, onCreate }: PetsTableToolbarProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Filtrar mascotas..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="h-11 rounded-xl border-slate-200 bg-white pl-10 shadow-none"
        />
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>

          <DropdownMenuContent align="end" className="w-48">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button type="button" onClick={onCreate} className="h-11 rounded-xl px-4">
          <Plus className="mr-2 size-4" />
          Nueva mascota
        </Button>
      </div>
    </div>
  );
}