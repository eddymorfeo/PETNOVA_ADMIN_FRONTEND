"use client";

import { MoreHorizontal, Pencil, UserX } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { VeterinarianItem } from "@/types/veterinarian/veterinarian.type";

type VeterinarianRowActionsProps = {
  veterinarian: VeterinarianItem;
  onEdit: (veterinarian: VeterinarianItem) => void;
  onDelete: (veterinarian: VeterinarianItem) => void;
};

export function VeterinarianRowActions({
  veterinarian,
  onEdit,
  onDelete,
}: VeterinarianRowActionsProps) {
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

        <DropdownMenuItem onClick={() => onEdit(veterinarian)}>
          <Pencil className="mr-2 size-4" />
          Editar veterinario
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onDelete(veterinarian)}
          variant="destructive"
        >
          <UserX className="mr-2 size-4" />
          Desactivar veterinario
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}