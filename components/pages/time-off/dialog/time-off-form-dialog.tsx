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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  createTimeOffSchema,
  updateTimeOffSchema,
} from "@/schemas/time-off/time-off.schema";
import type {
  CreateTimeOffPayload,
  TimeOffFormValues,
  TimeOffItem,
  UpdateTimeOffPayload,
  VeterinarianOption,
} from "@/types/time-off/time-off.type";
import {
  mapCreateTimeOffFormToPayload,
  mapTimeOffToFormValues,
  mapUpdateTimeOffFormToPayload,
} from "@/utils/time-off/time-off-mappers";

type TimeOffFormDialogProps = {
  mode: "create" | "edit";
  open: boolean;
  timeOffItem?: TimeOffItem | null;
  veterinarians: VeterinarianOption[];
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (values: CreateTimeOffPayload) => Promise<void>;
  onUpdate: (timeOffId: string, values: UpdateTimeOffPayload) => Promise<void>;
};

const defaultValues: TimeOffFormValues = {
  veterinarianId: "",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  reason: "",
};

export function TimeOffFormDialog({
  mode,
  open,
  timeOffItem,
  veterinarians,
  isSubmitting,
  onOpenChange,
  onCreate,
  onUpdate,
}: TimeOffFormDialogProps) {
  const form = useForm<TimeOffFormValues>({
    defaultValues,
    resolver: zodResolver(
      mode === "create" ? createTimeOffSchema : updateTimeOffSchema,
    ) as never,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === "edit" && timeOffItem) {
      form.reset(mapTimeOffToFormValues(timeOffItem));
      return;
    }

    form.reset(defaultValues);
  }, [form, mode, open, timeOffItem]);

  const handleSubmit = form.handleSubmit(async (values: TimeOffFormValues) => {
    if (mode === "create") {
      await onCreate(mapCreateTimeOffFormToPayload(values));
      onOpenChange(false);
      return;
    }

    if (!timeOffItem) {
      return;
    }

    await onUpdate(timeOffItem.id, mapUpdateTimeOffFormToPayload(values));
    onOpenChange(false);
  });

  const errors = form.formState.errors;
  const selectedVeterinarianId = form.watch("veterinarianId");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[760px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Asignar día libre" : "Editar día libre"}
          </DialogTitle>

          <DialogDescription>
            {mode === "create"
              ? "Completa los datos para registrar un bloqueo de agenda para un veterinario."
              : "Actualiza la información del bloqueo seleccionado."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="veterinarianId">
                Veterinario<span className="text-red-500">*</span>
              </Label>

              <Select
                value={form.watch("veterinarianId")}
                onValueChange={(value) =>
                  form.setValue("veterinarianId", value, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
                disabled={mode === "edit"}
              >
                <SelectTrigger id="veterinarianId" className="w-full">
                  <SelectValue placeholder="Seleccionar veterinario" />
                </SelectTrigger>

                <SelectContent>
                  {veterinarians.map((veterinarian) => (
                    <SelectItem key={veterinarian.id} value={veterinarian.id}>
                      {veterinarian.full_name} ·{" "}
                      {veterinarian.specialty_name || "Sin especialidad"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.veterinarianId && (
                <p className="text-sm text-red-500">
                  {errors.veterinarianId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">
                Fecha de inicio<span className="text-red-500">*</span>
              </Label>
              <Input id="startDate" type="date" {...form.register("startDate")} />
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">
                Hora de inicio<span className="text-red-500">*</span>
              </Label>
              <Input id="startTime" type="time" {...form.register("startTime")} />
              {errors.startTime && (
                <p className="text-sm text-red-500">{errors.startTime.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">
                Fecha de término<span className="text-red-500">*</span>
              </Label>
              <Input id="endDate" type="date" {...form.register("endDate")} />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">
                Hora de término<span className="text-red-500">*</span>
              </Label>
              <Input id="endTime" type="time" {...form.register("endTime")} />
              {errors.endTime && (
                <p className="text-sm text-red-500">{errors.endTime.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="reason">Motivo</Label>
              <Input
                id="reason"
                placeholder="Ej: Vacaciones, capacitación, permiso médico"
                {...form.register("reason")}
              />
              {errors.reason && (
                <p className="text-sm text-red-500">{errors.reason.message}</p>
              )}
            </div>
          </div>

          {selectedVeterinarianId ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm font-medium text-slate-900">
                Veterinario seleccionado
              </p>
              <p className="text-xs text-slate-500">
                {
                  veterinarians.find((item) => item.id === selectedVeterinarianId)
                    ?.full_name
                }{" "}
                ·{" "}
                {
                  veterinarians.find((item) => item.id === selectedVeterinarianId)
                    ?.email
                }
              </p>
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
                  ? "Crear bloqueo"
                  : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}