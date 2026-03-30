"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { AppointmentItem } from "@/types/appointments/appointment-type";

type AppointmentSelectorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointments: AppointmentItem[];
  onSelectAppointment: (appointment: AppointmentItem) => void;
};

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();
}

export function AppointmentSelectorDialog({
  open,
  onOpenChange,
  appointments,
  onSelectAppointment,
}: AppointmentSelectorDialogProps) {
  const [query, setQuery] = useState("");

  const filteredAppointments = useMemo(() => {
    const normalizedQuery = normalizeText(query);

    if (!normalizedQuery) {
      return appointments;
    }

    return appointments.filter((appointment) => {
      const clientName = normalizeText(appointment.client_name ?? "");
      const petName = normalizeText(appointment.pet_name ?? "");
      const veterinarianName = normalizeText(appointment.veterinarian_name ?? "");

      return (
        clientName.includes(normalizedQuery) ||
        petName.includes(normalizedQuery) ||
        veterinarianName.includes(normalizedQuery)
      );
    });
  }, [appointments, query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[980px]">
        <DialogHeader>
          <DialogTitle>Buscar cita</DialogTitle>
          <DialogDescription>
            Selecciona la cita asociada a la ficha clínica.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por cliente, mascota o veterinario..."
            className="pl-10"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="max-h-[420px] overflow-auto">
            <Table>
              <TableHeader className="bg-slate-50/70">
                <TableRow className="hover:bg-transparent">
                  <TableHead>Cliente</TableHead>
                  <TableHead>Mascota</TableHead>
                  <TableHead>Veterinario</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="w-[120px] text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-slate-500"
                    >
                      No hay citas para mostrar.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id} className="border-slate-200">
                      <TableCell className="font-medium text-slate-900">
                        {appointment.client_name ?? "-"}
                      </TableCell>
                      <TableCell>{appointment.pet_name ?? "-"}</TableCell>
                      <TableCell>{appointment.veterinarian_name ?? "-"}</TableCell>
                      <TableCell>{appointment.appointment_type_name ?? "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            onSelectAppointment(appointment);
                            onOpenChange(false);
                          }}
                        >
                          Seleccionar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}