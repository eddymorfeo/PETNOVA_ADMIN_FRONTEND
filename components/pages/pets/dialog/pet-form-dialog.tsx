"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  createPetSchema,
  updatePetSchema,
} from "@/schemas/pets/pet.schema";

import type {
  BreedOption,
  CreatePetPayload,
  PetClientOption,
  PetFormValues,
  PetItem,
  SpeciesOption,
  UpdatePetPayload,
} from "@/types/pets/pet.type";

import {
  buildClientLabel,
  mapCreatePetFormToPayload,
  mapPetToFormValues,
  mapUpdatePetFormToPayload,
} from "@/utils/pets/pet-mappers";
import { ClientSelectorDialog } from "./client-selector-dialog";

type PetFormDialogProps = {
  mode: "create" | "edit";
  open: boolean;
  pet?: PetItem | null;
  speciesOptions: SpeciesOption[];
  breedOptions: BreedOption[];
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSpeciesChange: (speciesId: string) => Promise<void> | void;
  onCreate: (values: CreatePetPayload) => Promise<void>;
  onUpdate: (petId: string, values: UpdatePetPayload) => Promise<void>;
};

const EMPTY_OPTION_VALUE = "__empty__";

const defaultValues: PetFormValues = {
  clientId: "",
  clientLabel: "",
  name: "",
  speciesId: "",
  breedId: "",
  sex: "",
  birthDate: "",
  color: "",
  microchip: "",
  isSterilized: false,
  allergies: "",
  notes: "",
  isActive: true,
};

function RequiredMark() {
  return <span className="text-red-500">*</span>;
}

export function PetFormDialog({
  mode,
  open,
  pet,
  speciesOptions,
  breedOptions,
  isSubmitting,
  onOpenChange,
  onSpeciesChange,
  onCreate,
  onUpdate,
}: PetFormDialogProps) {
  const [isClientSelectorOpen, setIsClientSelectorOpen] = useState(false);

  const form = useForm<PetFormValues>({
    defaultValues,
    resolver: zodResolver(
      mode === "create" ? createPetSchema : updatePetSchema,
    ) as never,
  });

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && pet) {
      form.reset(mapPetToFormValues(pet));
      return;
    }

    form.reset(defaultValues);
  }, [form, mode, open, pet]);

  const selectedSpeciesId = form.watch("speciesId");

  useEffect(() => {
    if (!selectedSpeciesId) {
      form.setValue("breedId", "", {
        shouldDirty: true,
        shouldTouch: true,
      });
      return;
    }

    void onSpeciesChange(selectedSpeciesId);
  }, [form, onSpeciesChange, selectedSpeciesId]);

  const filteredBreedOptions = useMemo(() => {
    if (!selectedSpeciesId) {
      return [];
    }

    return breedOptions.filter((breed) => breed.species_id === selectedSpeciesId);
  }, [breedOptions, selectedSpeciesId]);

  const handleSelectClient = (client: PetClientOption) => {
    form.setValue("clientId", client.id, {
      shouldDirty: true,
      shouldTouch: true,
    });

    form.setValue("clientLabel", buildClientLabel(client), {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleSubmit = form.handleSubmit(async (values: PetFormValues) => {
    if (mode === "create") {
      await onCreate(mapCreatePetFormToPayload(values));
      onOpenChange(false);
      return;
    }

    if (!pet) return;

    await onUpdate(pet.id, mapUpdatePetFormToPayload(values));
    onOpenChange(false);
  });

  const errors = form.formState.errors;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[860px]">
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Crear mascota" : "Editar mascota"}
            </DialogTitle>
            <DialogDescription>
              {mode === "create"
                ? "Completa los datos para registrar una nueva mascota."
                : "Actualiza la información de la mascota seleccionada."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="clientLabel" className="flex items-center gap-1">
                  <span>Cliente</span>
                  <RequiredMark />
                </Label>

                <div className="flex gap-2">
                  <Input
                    id="clientLabel"
                    value={form.watch("clientLabel")}
                    readOnly
                    placeholder="Selecciona un cliente"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsClientSelectorOpen(true)}
                  >
                    Buscar cliente
                  </Button>
                </div>

                {errors.clientLabel && (
                  <p className="text-sm text-red-500">
                    {errors.clientLabel.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-1">
                  <span>Nombre de la mascota</span>
                  <RequiredMark />
                </Label>
                <Input id="name" {...form.register("name")} className="w-full" />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <span>Especie</span>
                  <RequiredMark />
                </Label>
                <Select
                  value={form.watch("speciesId") || EMPTY_OPTION_VALUE}
                  onValueChange={(value) => {
                    const normalizedValue =
                      value === EMPTY_OPTION_VALUE ? "" : value;

                    form.setValue("speciesId", normalizedValue, {
                      shouldDirty: true,
                      shouldTouch: true,
                    });

                    form.setValue("breedId", "", {
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar una opción" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value={EMPTY_OPTION_VALUE}>
                      Seleccionar una opción
                    </SelectItem>

                    {speciesOptions.map((species) => (
                      <SelectItem key={species.id} value={species.id}>
                        {species.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.speciesId && (
                  <p className="text-sm text-red-500">{errors.speciesId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Raza</Label>
                <Select
                  value={form.watch("breedId") || EMPTY_OPTION_VALUE}
                  onValueChange={(value) => {
                    const normalizedValue =
                      value === EMPTY_OPTION_VALUE ? "" : value;

                    form.setValue("breedId", normalizedValue, {
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  }}
                  disabled={!selectedSpeciesId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        selectedSpeciesId
                          ? "Seleccionar una opción"
                          : "Selecciona primero una especie"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value={EMPTY_OPTION_VALUE}>
                      Seleccionar una opción
                    </SelectItem>

                    {filteredBreedOptions.map((breed) => (
                      <SelectItem key={breed.id} value={breed.id}>
                        {breed.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <span>Sexo</span>
                  <RequiredMark />
                </Label>
                <Select
                  value={form.watch("sex") || EMPTY_OPTION_VALUE}
                  onValueChange={(value) => {
                    const normalizedValue =
                      value === EMPTY_OPTION_VALUE ? "" : value;

                    form.setValue("sex", normalizedValue, {
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar una opción" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value={EMPTY_OPTION_VALUE}>
                      Seleccionar una opción
                    </SelectItem>
                    <SelectItem value="MACHO">Macho</SelectItem>
                    <SelectItem value="HEMBRA">Hembra</SelectItem>
                  </SelectContent>
                </Select>

                {errors.sex && (
                  <p className="text-sm text-red-500">{errors.sex.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate" className="flex items-center gap-1">
                  <span>Fecha de nacimiento</span>
                  <RequiredMark />
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  {...form.register("birthDate")}
                  className="w-full"
                />
                {errors.birthDate && (
                  <p className="text-sm text-red-500">
                    {errors.birthDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input id="color" {...form.register("color")} className="w-full" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="microchip">Microchip</Label>
                <Input
                  id="microchip"
                  {...form.register("microchip")}
                  className="w-full"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="allergies">Alergias</Label>
                <Textarea id="allergies" {...form.register("allergies")} />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea id="notes" {...form.register("notes")} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">Esterilizada</p>
                  <p className="text-xs text-slate-500">
                    Indica si la mascota está esterilizada.
                  </p>
                </div>

                <Switch
                  checked={Boolean(form.watch("isSterilized"))}
                  onCheckedChange={(checked) => {
                    form.setValue("isSterilized", checked, {
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  }}
                />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">Estado activo</p>
                  <p className="text-xs text-slate-500">
                    Define si la mascota se mantiene activa en el sistema.
                  </p>
                </div>

                <Switch
                  checked={Boolean(form.watch("isActive"))}
                  onCheckedChange={(checked) => {
                    form.setValue("isActive", checked, {
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  }}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Guardando..."
                  : mode === "create"
                    ? "Crear mascota"
                    : "Guardar cambios"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ClientSelectorDialog
        open={isClientSelectorOpen}
        onOpenChange={setIsClientSelectorOpen}
        onSelectClient={handleSelectClient}
      />
    </>
  );
}