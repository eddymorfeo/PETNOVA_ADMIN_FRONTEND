"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { TimeOffItem } from "@/types/time-off/time-off.type";

type TimeOffRowActionsProps = {
  timeOffItem: TimeOffItem;
  onEdit: (timeOffItem: TimeOffItem) => void;
  onDelete: (timeOffItem: TimeOffItem) => void;
};

export function TimeOffRowActions({
  timeOffItem,
  onEdit,
  onDelete,
}: TimeOffRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="icon" className="rounded-full">
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Abrir acciones</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => onEdit(timeOffItem)}>
          <Pencil className="mr-2 size-4" />
          Editar bloqueo
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onDelete(timeOffItem)}
          variant="destructive"
        >
          <Trash2 className="mr-2 size-4" />
          Eliminar bloqueo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}