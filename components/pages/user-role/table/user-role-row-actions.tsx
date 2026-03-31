"use client";

import { MoreHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { UserRoleItem } from "@/types/user-role/user-role-type";

type UserRoleRowActionsProps = {
  userRole: UserRoleItem;
  onDelete: (userRole: UserRoleItem) => void;
};

export function UserRoleRowActions({
  userRole,
  onDelete,
}: UserRoleRowActionsProps) {
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

        <DropdownMenuItem
          onClick={() => onDelete(userRole)}
          variant="destructive"
        >
          <Trash2 className="mr-2 size-4" />
          Eliminar asignación
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}