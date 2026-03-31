"use client";

import { useMemo, useState } from "react";
import { CalendarX2, ShieldBan } from "lucide-react";

import { useTimeOff } from "@/hooks/time-off/use-time-off";
import { buildTimeOffColumns } from "@/components/pages/time-off/table/time-off-columns";
import { TimeOffDataTable } from "@/components/pages/time-off/table/time-off-data-table";
import type { TimeOffItem } from "@/types/time-off/time-off.type";
import { TimeOffFormDialog } from "@/components/pages/time-off/dialog/time-off-form-dialog";
import { TimeOffDeleteDialog } from "@/components/pages/time-off/dialog/time-off-delete-dialog";

export function TimeOffPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTimeOff, setEditingTimeOff] = useState<TimeOffItem | null>(null);
  const [deletingTimeOff, setDeletingTimeOff] = useState<TimeOffItem | null>(null);

  const {
    timeOffBlocks,
    veterinarians,
    isLoading,
    isMutating,
    totalBlocks,
    totalVeterinariansWithBlocks,
    handleCreateTimeOff,
    handleUpdateTimeOff,
    handleDeleteTimeOff,
  } = useTimeOff();

  const columns = useMemo(
    () =>
      buildTimeOffColumns({
        onEdit: (timeOffItem) => setEditingTimeOff(timeOffItem),
        onDelete: (timeOffItem) => setDeletingTimeOff(timeOffItem),
      }),
    [],
  );

  return (
    <section className="space-y-6 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
            Configuración
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Asignar días libres
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Administra bloqueos de agenda y periodos no disponibles para los veterinarios.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Bloqueos registrados</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {totalBlocks}
              </p>
            </div>

            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
              <CalendarX2 className="size-5" />
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Veterinarios con bloqueos</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {totalVeterinariansWithBlocks}
              </p>
            </div>

            <div className="rounded-2xl bg-rose-50 p-3 text-rose-600">
              <ShieldBan className="size-5" />
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          Cargando días libres...
        </div>
      ) : (
        <TimeOffDataTable
          columns={columns}
          data={timeOffBlocks}
          onCreate={() => setIsCreateDialogOpen(true)}
        />
      )}

      <TimeOffFormDialog
        mode="create"
        open={isCreateDialogOpen}
        veterinarians={veterinarians}
        isSubmitting={isMutating}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={async (values) => {
          await handleCreateTimeOff(values);
        }}
        onUpdate={async () => undefined}
      />

      <TimeOffFormDialog
        mode="edit"
        open={Boolean(editingTimeOff)}
        timeOffItem={editingTimeOff}
        veterinarians={veterinarians}
        isSubmitting={isMutating}
        onOpenChange={(open) => {
          if (!open) {
            setEditingTimeOff(null);
          }
        }}
        onCreate={async () => undefined}
        onUpdate={async (timeOffId, values) => {
          await handleUpdateTimeOff(timeOffId, values);
          setEditingTimeOff(null);
        }}
      />

      <TimeOffDeleteDialog
        open={Boolean(deletingTimeOff)}
        timeOffItem={deletingTimeOff}
        isSubmitting={isMutating}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingTimeOff(null);
          }
        }}
        onConfirm={async (timeOffItem) => {
          await handleDeleteTimeOff(timeOffItem);
          setDeletingTimeOff(null);
        }}
      />
    </section>
  );
}