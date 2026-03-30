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

import type { ConsultationItem } from "@/types/medical-records/medical-record.type";

type MedicalRecordsRowActionsProps = {
  consultation: ConsultationItem;
  onEdit: (consultation: ConsultationItem) => void;
  onDelete: (consultation: ConsultationItem) => void;
};

export function MedicalRecordsRowActions({
  consultation,
  onEdit,
  onDelete,
}: MedicalRecordsRowActionsProps) {
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

        <DropdownMenuItem onClick={() => onEdit(consultation)}>
          <Pencil className="mr-2 size-4" />
          Editar ficha
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onDelete(consultation)}
          variant="destructive"
        >
          <Trash2 className="mr-2 size-4" />
          Eliminar ficha
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}