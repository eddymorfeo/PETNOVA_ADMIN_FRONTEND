"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Shield } from "lucide-react";

import { useAppointments } from "@/hooks/appointments/use-appointments";
import { buildAppointmentsColumns } from "@/components/pages/appointments/table/appointments-columns";
import { AppointmentsDataTable } from "@/components/pages/appointments/table/appointments-data-table";
import { AppointmentFormDialog } from "@/components/pages/appointments/dialog/appointments-form-dialog";
import type { AppointmentItem } from "@/types/appointments/appointment-type";

export function AppointmentsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<AppointmentItem | null>(null);

  const {
    appointments,
    veterinarianOptions,
    appointmentTypeOptions,
    clientOptions,
    petOptions,
    isLoading,
    isMutating,
    scheduledAppointmentsCount,
    handleCreateAppointment,
    handleUpdateAppointment,
    handleCancelAppointment,
  } = useAppointments();

  const columns = useMemo(
    () =>
      buildAppointmentsColumns({
        onEdit: (appointment) => setEditingAppointment(appointment),
        onCancel: (appointment) => void handleCancelAppointment(appointment),
      }),
    [handleCancelAppointment],
  );

  return (
    <section className="space-y-6 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Gestión de citas
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Administra citas, cambios de estado, cancelaciones y agenda general.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Citas registradas</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {appointments.length}
              </p>
            </div>

            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
              <CalendarDays className="size-5" />
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Citas agendadas</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {scheduledAppointmentsCount}
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
              <Shield className="size-5" />
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          Cargando citas...
        </div>
      ) : (
        <AppointmentsDataTable
          columns={columns}
          data={appointments}
          onCreate={() => setIsCreateDialogOpen(true)}
        />
      )}

      <AppointmentFormDialog
        mode="create"
        open={isCreateDialogOpen}
        veterinarianOptions={veterinarianOptions}
        appointmentTypeOptions={appointmentTypeOptions}
        clientOptions={clientOptions}
        petOptions={petOptions}
        isSubmitting={isMutating}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={async (values) => {
          await handleCreateAppointment(values);
        }}
        onUpdate={async () => undefined}
      />

      <AppointmentFormDialog
        mode="edit"
        open={Boolean(editingAppointment)}
        appointment={editingAppointment}
        veterinarianOptions={veterinarianOptions}
        appointmentTypeOptions={appointmentTypeOptions}
        clientOptions={clientOptions}
        petOptions={petOptions}
        isSubmitting={isMutating}
        onOpenChange={(open) => {
          if (!open) {
            setEditingAppointment(null);
          }
        }}
        onCreate={async () => undefined}
        onUpdate={async (appointmentId, values) => {
          await handleUpdateAppointment(appointmentId, values);
          setEditingAppointment(null);
        }}
      />
    </section>
  );
}