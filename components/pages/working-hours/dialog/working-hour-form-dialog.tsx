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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  createWorkingHourSchema,
  updateWorkingHourSchema,
} from "@/schemas/working-hours/working-hour.schema";
import type {
  UpsertWorkingHoursPayload,
  VeterinarianOption,
  WorkingHourFormValues,
  WorkingHourItem,
} from "@/types/working-hours/working-hour.type";
import {
  HOUR_OPTIONS,
  WEEKDAY_OPTIONS,
  mapWorkingHourFormToUpsertPayload,
  mapWorkingHourToFormValues,
} from "@/utils/working-hours/working-hour-mappers";

type WorkingHourFormDialogProps = {
  mode: "create" | "edit";
  open: boolean;
  workingHour?: WorkingHourItem | null;
  veterinarians: VeterinarianOption[];
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (values: UpsertWorkingHoursPayload) => Promise<void>;
  onUpdate: (
    currentWorkingHour: WorkingHourItem,
    values: UpsertWorkingHoursPayload,
  ) => Promise<void>;
};

const defaultValues: WorkingHourFormValues = {
  veterinarianId: "",
  weekdays: [],
  startTime: "",
  endTime: "",
  slotMinutes: "30",
  isActive: true,
};

export function WorkingHourFormDialog({
  mode,
  open,
  workingHour,
  veterinarians,
  isSubmitting,
  onOpenChange,
  onCreate,
  onUpdate,
}: WorkingHourFormDialogProps) {
  const form = useForm<WorkingHourFormValues>({
    defaultValues,
    resolver: zodResolver(
      mode === "create" ? createWorkingHourSchema : updateWorkingHourSchema,
    ) as never,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === "edit" && workingHour) {
      form.reset(mapWorkingHourToFormValues(workingHour));
      return;
    }

    form.reset(defaultValues);
  }, [form, mode, open, workingHour]);

  const handleSubmit = form.handleSubmit(async (values: WorkingHourFormValues) => {
    const payload = mapWorkingHourFormToUpsertPayload(values);

    if (mode === "create") {
      await onCreate(payload);
      onOpenChange(false);
      return;
    }

    if (!workingHour) {
      return;
    }

    await onUpdate(workingHour, payload);
    onOpenChange(false);
  });

  const errors = form.formState.errors;
  const selectedVeterinarianId = form.watch("veterinarianId");
  const selectedWeekdays = form.watch("weekdays");

  const toggleWeekday = (weekday: string, checked: boolean) => {
    const currentValue = form.getValues("weekdays");

    if (checked) {
      form.setValue("weekdays", [...currentValue, weekday], {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      return;
    }

    form.setValue(
      "weekdays",
      currentValue.filter((item) => item !== weekday),
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[760px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Asignar horario" : "Editar horario"}
          </DialogTitle>

          <DialogDescription>
            {mode === "create"
              ? "Completa los datos para asignar un horario a un veterinario."
              : "Actualiza la configuración del horario seleccionado. También puedes agregar más días con la misma configuración."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
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
              <Label htmlFor="slotMinutes">
                Duración del bloque<span className="text-red-500">*</span>
              </Label>
              <Input
                id="slotMinutes"
                type="number"
                min="5"
                step="5"
                {...form.register("slotMinutes")}
              />
              {errors.slotMinutes && (
                <p className="text-sm text-red-500">
                  {errors.slotMinutes.message}
                </p>
              )}
            </div>

            <div className="space-y-3 md:col-span-2">
              <Label>
                Días<span className="text-red-500">*</span>
              </Label>

              <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-4">
                {WEEKDAY_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2"
                  >
                    <Checkbox
                      checked={selectedWeekdays.includes(option.value)}
                      onCheckedChange={(checked) =>
                        toggleWeekday(option.value, Boolean(checked))
                      }
                    />
                    <span className="text-sm text-slate-700">{option.label}</span>
                  </label>
                ))}
              </div>

              {errors.weekdays && (
                <p className="text-sm text-red-500">
                  {errors.weekdays.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">
                Hora de inicio<span className="text-red-500">*</span>
              </Label>

              <Select
                value={form.watch("startTime")}
                onValueChange={(value) =>
                  form.setValue("startTime", value, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id="startTime" className="w-full">
                  <SelectValue placeholder="Seleccionar hora" />
                </SelectTrigger>

                <SelectContent>
                  {HOUR_OPTIONS.slice(0, -1).map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.startTime && (
                <p className="text-sm text-red-500">{errors.startTime.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">
                Hora de término<span className="text-red-500">*</span>
              </Label>

              <Select
                value={form.watch("endTime")}
                onValueChange={(value) =>
                  form.setValue("endTime", value, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id="endTime" className="w-full">
                  <SelectValue placeholder="Seleccionar hora" />
                </SelectTrigger>

                <SelectContent>
                  {HOUR_OPTIONS.slice(1).map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.endTime && (
                <p className="text-sm text-red-500">{errors.endTime.message}</p>
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

          {mode === "edit" ? (
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Estado del horario
                </p>
                <p className="text-xs text-slate-500">
                  Define si este bloque horario se mantiene activo.
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
                  ? "Crear horario"
                  : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}