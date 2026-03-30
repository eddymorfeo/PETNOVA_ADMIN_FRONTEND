"use client";

import { MoreHorizontal, Pencil, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { AppointmentItem } from "@/types/appointments/appointment-type";

type AppointmentsRowActionsProps = {
  appointment: AppointmentItem;
  onEdit: (appointment: AppointmentItem) => void;
  onCancel: (appointment: AppointmentItem) => void;
};

export function AppointmentsRowActions({
  appointment,
  onEdit,
  onCancel,
}: AppointmentsRowActionsProps) {
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

        <DropdownMenuItem onClick={() => onEdit(appointment)}>
          <Pencil className="mr-2 size-4" />
          Editar cita
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onCancel(appointment)}
          variant="destructive"
        >
          <XCircle className="mr-2 size-4" />
          Cancelar cita
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}