"use client";

import { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  createVeterinarianSchema,
  updateVeterinarianSchema,
} from "@/schemas/veterinarian/veterinarian.schema";
import type {
  CreateVeterinarianPayload,
  UpdateVeterinarianPayload,
  VeterinarianFormValues,
  VeterinarianItem,
  VeterinarianSpecialtyOption,
  VeterinarianUserOption,
} from "@/types/veterinarian/veterinarian.type";
import {
  mapCreateVeterinarianFormToPayload,
  mapUpdateVeterinarianFormToPayload,
  mapVeterinarianToFormValues,
} from "@/utils/veterinarian/veterinarian-mappers";

type VeterinarianFormDialogProps = {
  mode: "create" | "edit";
  open: boolean;
  veterinarian?: VeterinarianItem | null;
  users: VeterinarianUserOption[];
  specialties: VeterinarianSpecialtyOption[];
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (values: CreateVeterinarianPayload) => Promise<void>;
  onUpdate: (veterinarianId: string, values: UpdateVeterinarianPayload) => Promise<void>;
};

const defaultValues: VeterinarianFormValues = {
  userId: "",
  licenseNumber: "",
  specialtyId: "",
  isActive: true,
};

export function VeterinarianFormDialog({
  mode,
  open,
  veterinarian,
  users,
  specialties,
  isSubmitting,
  onOpenChange,
  onCreate,
  onUpdate,
}: VeterinarianFormDialogProps) {
  const form = useForm<VeterinarianFormValues>({
    defaultValues,
    resolver: zodResolver(
      mode === "create" ? createVeterinarianSchema : updateVeterinarianSchema,
    ) as never,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === "edit" && veterinarian) {
      form.reset(mapVeterinarianToFormValues(veterinarian));
      return;
    }

    form.reset(defaultValues);
  }, [form, mode, open, veterinarian]);

  const handleSubmit = form.handleSubmit(async (values: VeterinarianFormValues) => {
    if (mode === "create") {
      await onCreate(mapCreateVeterinarianFormToPayload(values));
      onOpenChange(false);
      return;
    }

    if (!veterinarian) {
      return;
    }

    await onUpdate(veterinarian.id, mapUpdateVeterinarianFormToPayload(values));
    onOpenChange(false);
  });

  const errors = form.formState.errors;
  const selectedUserId = form.watch("userId");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Asignar veterinario" : "Editar veterinario"}
          </DialogTitle>

          <DialogDescription>
            {mode === "create"
              ? "Completa los datos para asociar un usuario como veterinario."
              : "Actualiza la información del veterinario seleccionado."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="userId">
                Usuario<span className="text-red-500">*</span>
              </Label>

              <Select
                value={form.watch("userId")}
                onValueChange={(value) =>
                  form.setValue("userId", value, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
                disabled={mode === "edit"}
              >
                <SelectTrigger id="userId">
                  <SelectValue placeholder="Seleccionar usuario" />
                </SelectTrigger>

                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name} · {user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.userId && (
                <p className="text-sm text-red-500">{errors.userId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseNumber">Número de licencia</Label>
              <Input id="licenseNumber" {...form.register("licenseNumber")} />
              {errors.licenseNumber && (
                <p className="text-sm text-red-500">
                  {errors.licenseNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialtyId">Especialidad</Label>

              <Select
                value={form.watch("specialtyId")}
                onValueChange={(value) =>
                  form.setValue("specialtyId", value === "__none__" ? "" : value, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id="specialtyId">
                  <SelectValue placeholder="Seleccionar especialidad" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="__none__">Sin especialidad</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty.id} value={specialty.id}>
                      {specialty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.specialtyId && (
                <p className="text-sm text-red-500">
                  {errors.specialtyId.message}
                </p>
              )}
            </div>
          </div>

          {selectedUserId ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm font-medium text-slate-900">
                Usuario seleccionado
              </p>
              <p className="text-xs text-slate-500">
                {users.find((item) => item.id === selectedUserId)?.full_name} ·{" "}
                {users.find((item) => item.id === selectedUserId)?.email}
              </p>
            </div>
          ) : null}

          {mode === "edit" ? (
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Estado del veterinario
                </p>
                <p className="text-xs text-slate-500">
                  Define si el veterinario se mantiene activo en el sistema.
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
          ) : null}

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
                  ? "Crear veterinario"
                  : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}