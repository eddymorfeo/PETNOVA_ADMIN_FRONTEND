"use client";

import { MoreHorizontal, Pencil, PawPrint } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { PetItem } from "@/types/pets/pet.type";

type PetsRowActionsProps = {
  pet: PetItem;
  onEdit: (pet: PetItem) => void;
  onDelete: (pet: PetItem) => void;
};

export function PetsRowActions({
  pet,
  onEdit,
  onDelete,
}: PetsRowActionsProps) {
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

        <DropdownMenuItem onClick={() => onEdit(pet)}>
          <Pencil className="mr-2 size-4" />
          Editar mascota
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onDelete(pet)}
          variant="destructive"
        >
          <PawPrint className="mr-2 size-4" />
          Desactivar mascota
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}