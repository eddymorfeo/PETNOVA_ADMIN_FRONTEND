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

import type { ClientItem } from "@/types/clients/client.type";

type ClientsRowActionsProps = {
  client: ClientItem;
  onEdit: (client: ClientItem) => void;
  onDelete: (client: ClientItem) => void;
};

export function ClientsRowActions({
  client,
  onEdit,
  onDelete,
}: ClientsRowActionsProps) {
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

        <DropdownMenuItem onClick={() => onEdit(client)}>
          <Pencil className="mr-2 size-4" />
          Editar cliente
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onDelete(client)}
          variant="destructive"
        >
          <UserX className="mr-2 size-4" />
          Desactivar cliente
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}