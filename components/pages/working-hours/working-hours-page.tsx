"use client";

import { useMemo, useState } from "react";
import { CalendarClock, Shield } from "lucide-react";

import { useWorkingHours } from "@/hooks/working-hours/use-working-hours";
import { buildWorkingHourColumns } from "@/components/pages/working-hours/table/working-hour-columns";
import { WorkingHourDataTable } from "@/components/pages/working-hours/table/working-hour-data-table";
import type { WorkingHourItem } from "@/types/working-hours/working-hour.type";
import { WorkingHourFormDialog } from "@/components/pages/working-hours/dialog/working-hour-form-dialog";
import { WorkingHourDeleteDialog } from "@/components/pages/working-hours/dialog/working-hour-delete-dialog";

export function WorkingHoursPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingWorkingHour, setEditingWorkingHour] =
    useState<WorkingHourItem | null>(null);
  const [deletingWorkingHour, setDeletingWorkingHour] =
    useState<WorkingHourItem | null>(null);

  const {
    workingHours,
    veterinarians,
    isLoading,
    isMutating,
    totalSchedules,
    activeSchedules,
    handleCreateWorkingHours,
    handleUpdateWorkingHours,
    handleDeleteWorkingHour,
  } = useWorkingHours();

  const columns = useMemo(
    () =>
      buildWorkingHourColumns({
        onEdit: (workingHour) => setEditingWorkingHour(workingHour),
        onDelete: (workingHour) => setDeletingWorkingHour(workingHour),
      }),
    [],
  );

  return (
    <section className="space-y-6 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Asignar horarios
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Administra los bloques horarios disponibles para los veterinarios.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Horarios registrados</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {totalSchedules}
              </p>
            </div>

            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
              <CalendarClock className="size-5" />
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Horarios activos</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {activeSchedules}
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
          Cargando horarios...
        </div>
      ) : (
        <WorkingHourDataTable
          columns={columns}
          data={workingHours}
          onCreate={() => setIsCreateDialogOpen(true)}
        />
      )}

      <WorkingHourFormDialog
        mode="create"
        open={isCreateDialogOpen}
        veterinarians={veterinarians}
        isSubmitting={isMutating}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={async (values) => {
          await handleCreateWorkingHours(values);
        }}
        onUpdate={async () => undefined}
      />

      <WorkingHourFormDialog
        mode="edit"
        open={Boolean(editingWorkingHour)}
        workingHour={editingWorkingHour}
        veterinarians={veterinarians}
        isSubmitting={isMutating}
        onOpenChange={(open) => {
          if (!open) {
            setEditingWorkingHour(null);
          }
        }}
        onCreate={async () => undefined}
        onUpdate={async (currentWorkingHour, values) => {
          await handleUpdateWorkingHours(currentWorkingHour, values);
          setEditingWorkingHour(null);
        }}
      />

      <WorkingHourDeleteDialog
        open={Boolean(deletingWorkingHour)}
        workingHour={deletingWorkingHour}
        isSubmitting={isMutating}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingWorkingHour(null);
          }
        }}
        onConfirm={async (workingHour) => {
          await handleDeleteWorkingHour(workingHour);
          setDeletingWorkingHour(null);
        }}
      />
    </section>
  );
}