"use client";

import { useMemo, useState } from "react";
import { Shield, Stethoscope } from "lucide-react";

import { useVeterinarian } from "@/hooks/veterinarian/use-veterinarian";
import { buildVeterinarianColumns } from "@/components/pages/veterinarian/table/veterinarian-columns";
import { VeterinarianDataTable } from "@/components/pages/veterinarian/table/veterinarian-data-table";
import type { VeterinarianItem } from "@/types/veterinarian/veterinarian.type";
import { VeterinarianFormDialog } from "@/components/pages/veterinarian/dialog/veterinarian-form-dialog";
import { VeterinarianDeleteDialog } from "@/components/pages/veterinarian/dialog/veterinarian-delete-dialog";

export function VeterinarianPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingVeterinarian, setEditingVeterinarian] =
    useState<VeterinarianItem | null>(null);
  const [deletingVeterinarian, setDeletingVeterinarian] =
    useState<VeterinarianItem | null>(null);

  const {
    veterinarians,
    users,
    specialties,
    isLoading,
    isMutating,
    totalVeterinarians,
    activeVeterinarians,
    handleCreateVeterinarian,
    handleUpdateVeterinarian,
    handleDeleteVeterinarian,
  } = useVeterinarian();

  const columns = useMemo(
    () =>
      buildVeterinarianColumns({
        onEdit: (veterinarian) => setEditingVeterinarian(veterinarian),
        onDelete: (veterinarian) => setDeletingVeterinarian(veterinarian),
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
            Asignar veterinarios
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Administra la asociación entre usuarios del sistema y el módulo de veterinarios.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Veterinarios registrados</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {totalVeterinarians}
              </p>
            </div>

            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
              <Stethoscope className="size-5" />
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Veterinarios activos</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {activeVeterinarians}
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
          Cargando veterinarios...
        </div>
      ) : (
        <VeterinarianDataTable
          columns={columns}
          data={veterinarians}
          onCreate={() => setIsCreateDialogOpen(true)}
        />
      )}

      <VeterinarianFormDialog
        mode="create"
        open={isCreateDialogOpen}
        users={users}
        specialties={specialties}
        isSubmitting={isMutating}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={async (values) => {
          await handleCreateVeterinarian(values);
        }}
        onUpdate={async () => undefined}
      />

      <VeterinarianFormDialog
        mode="edit"
        open={Boolean(editingVeterinarian)}
        veterinarian={editingVeterinarian}
        users={users}
        specialties={specialties}
        isSubmitting={isMutating}
        onOpenChange={(open) => {
          if (!open) {
            setEditingVeterinarian(null);
          }
        }}
        onCreate={async () => undefined}
        onUpdate={async (veterinarianId, values) => {
          await handleUpdateVeterinarian(veterinarianId, values);
          setEditingVeterinarian(null);
        }}
      />

      <VeterinarianDeleteDialog
        open={Boolean(deletingVeterinarian)}
        veterinarian={deletingVeterinarian}
        isSubmitting={isMutating}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingVeterinarian(null);
          }
        }}
        onConfirm={async (veterinarian) => {
          await handleDeleteVeterinarian(veterinarian);
          setDeletingVeterinarian(null);
        }}
      />
    </section>
  );
}