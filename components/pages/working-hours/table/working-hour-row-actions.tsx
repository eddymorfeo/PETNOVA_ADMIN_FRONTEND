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

import type { WorkingHourItem } from "@/types/working-hours/working-hour.type";

type WorkingHourRowActionsProps = {
  workingHour: WorkingHourItem;
  onEdit: (workingHour: WorkingHourItem) => void;
  onDelete: (workingHour: WorkingHourItem) => void;
};

export function WorkingHourRowActions({
  workingHour,
  onEdit,
  onDelete,
}: WorkingHourRowActionsProps) {
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

        <DropdownMenuItem onClick={() => onEdit(workingHour)}>
          <Pencil className="mr-2 size-4" />
          Editar horario
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onDelete(workingHour)}
          variant="destructive"
        >
          <Trash2 className="mr-2 size-4" />
          Eliminar horario
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}