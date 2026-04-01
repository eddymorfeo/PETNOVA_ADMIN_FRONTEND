"use client";

import { useMemo, useState } from "react";
import { PawPrint, Shield } from "lucide-react";

import { usePets } from "@/hooks/pets/use-pets";
import { buildPetsColumns } from "@/components/pages/pets/table/pets-columns";
import { PetsDataTable } from "@/components/pages/pets/table/pets-data-table";
import { PetFormDialog } from "@/components/pages/pets/dialog/pet-form-dialog";
import type { PetItem } from "@/types/pets/pet.type";

export function PetsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<PetItem | null>(null);

  const {
    pets,
    speciesOptions,
    breedOptions,
    isLoading,
    isMutating,
    activePetsCount,
    loadBreeds,
    handleCreatePet,
    handleUpdatePet,
    handleDeletePet,
  } = usePets();

  const columns = useMemo(
    () =>
      buildPetsColumns({
        onEdit: (pet) => setEditingPet(pet),
        onDelete: (pet) => void handleDeletePet(pet),
      }),
    [handleDeletePet],
  );

  return (
    <section className="space-y-6 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Gestión de mascotas
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Administra mascotas, su relación con clientes y sus datos generales.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Mascotas registradas</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {pets.length}
              </p>
            </div>

            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
              <PawPrint className="size-5" />
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Mascotas activas</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {activePetsCount}
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
          Cargando mascotas...
        </div>
      ) : (
        <PetsDataTable
          columns={columns}
          data={pets}
          onCreate={() => setIsCreateDialogOpen(true)}
        />
      )}

      <PetFormDialog
        mode="create"
        open={isCreateDialogOpen}
        speciesOptions={speciesOptions}
        breedOptions={breedOptions}
        isSubmitting={isMutating}
        onOpenChange={setIsCreateDialogOpen}
        onSpeciesChange={async (speciesId) => {
          await loadBreeds(speciesId);
        }}
        onCreate={async (values) => {
          await handleCreatePet(values);
        }}
        onUpdate={async () => undefined}
      />

      <PetFormDialog
        mode="edit"
        open={Boolean(editingPet)}
        pet={editingPet}
        speciesOptions={speciesOptions}
        breedOptions={breedOptions}
        isSubmitting={isMutating}
        onOpenChange={(open) => {
          if (!open) {
            setEditingPet(null);
          }
        }}
        onSpeciesChange={async (speciesId) => {
          await loadBreeds(speciesId);
        }}
        onCreate={async () => undefined}
        onUpdate={async (petId, values) => {
          await handleUpdatePet(petId, values);
          setEditingPet(null);
        }}
      />
    </section>
  );
}