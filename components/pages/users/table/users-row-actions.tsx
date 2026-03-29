"use client";

import { MoreHorizontal, Pencil, ShieldX } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { UserItem } from "@/types/users/user.type";

type UsersRowActionsProps = {
  user: UserItem;
  onEdit: (user: UserItem) => void;
  onDelete: (user: UserItem) => void;
};

export function UsersRowActions({
  user,
  onEdit,
  onDelete,
}: UsersRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="rounded-full"
        >
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Abrir acciones</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => onEdit(user)}>
          <Pencil className="mr-2 size-4" />
          Editar usuario
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onDelete(user)}
          className="text-red-600 focus:text-red-700"
        >
          <ShieldX className="mr-2 size-4" />
          Desactivar usuario
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}