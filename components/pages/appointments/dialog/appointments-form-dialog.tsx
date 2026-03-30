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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  createAppointmentSchema,
  updateAppointmentSchema,
} from "@/schemas/appointments/appointment.schema";
import {
  mapAppointmentToFormValues,
  mapCreateAppointmentFormToPayload,
  mapUpdateAppointmentFormToPayload,
} from "@/utils/appointments/appointment-mappers";

import type { ClientItem } from "@/types/clients/client.type";
import type {
  AppointmentFormValues,
  AppointmentItem,
  AppointmentTypeOption,
  AvailableTimeOption,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
  VeterinarianOption,
} from "@/types/appointments/appointment-type";
import type { PetItem } from "@/types/pets/pet.type";

import { ClientSelectorDialog } from "@/components/pages/appointments/dialog/client-selector-dialog";
import { PetSelectorDialog } from "@/components/pages/appointments/dialog/pet-selector-dialog";
import { AppointmentDatePicker } from "@/components/pages/appointments/dialog/appointment-date-picker";
import { fetchAvailableAppointmentTimes } from "@/api/appointments/appointments.api";
import { toast } from "sonner";

type AppointmentFormDialogProps = {
  mode: "create" | "edit";
  open: boolean;
  appointment?: AppointmentItem | null;
  veterinarianOptions: VeterinarianOption[];
  appointmentTypeOptions: AppointmentTypeOption[];
  clientOptions: ClientItem[];
  petOptions: PetItem[];
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (values: CreateAppointmentPayload) => Promise<void>;
  onUpdate: (
    appointmentId: string,
    values: UpdateAppointmentPayload,
  ) => Promise<void>;
};

const EMPTY_OPTION_VALUE = "__empty__";

const defaultValues: AppointmentFormValues = {
  veterinarianId: "",
  appointmentTypeId: "",
  clientId: "",
  clientLabel: "",
  petId: "",
  petLabel: "",
  appointmentDate: "",
  appointmentTime: "",
  status: "SCHEDULED",
  reason: "",
  bookedSource: "ADMIN",
  cancelReason: "",
};

function RequiredMark() {
  return <span className="text-red-500">*</span>;
}

export function AppointmentFormDialog({
  mode,
  open,
  appointment,
  veterinarianOptions,
  appointmentTypeOptions,
  clientOptions,
  petOptions,
  isSubmitting,
  onOpenChange,
  onCreate,
  onUpdate,
}: AppointmentFormDialogProps) {
  const [isClientSelectorOpen, setIsClientSelectorOpen] = useState(false);
  const [isPetSelectorOpen, setIsPetSelectorOpen] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<AvailableTimeOption[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);

  const form = useForm<AppointmentFormValues>({
    defaultValues,
    resolver: zodResolver(
      mode === "create" ? createAppointmentSchema : updateAppointmentSchema,
    ) as never,
  });

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && appointment) {
      form.reset(mapAppointmentToFormValues(appointment));
      return;
    }

    form.reset(defaultValues);
  }, [appointment, form, mode, open]);

  const selectedClientId = form.watch("clientId");
  const selectedVeterinarianId = form.watch("veterinarianId");
  const selectedAppointmentDate = form.watch("appointmentDate");

  useEffect(() => {
    async function loadAvailableTimes() {
      if (!selectedVeterinarianId || !selectedAppointmentDate) {
        setAvailableTimes([]);
        form.setValue("appointmentTime", "", {
          shouldDirty: true,
          shouldTouch: true,
        });
        return;
      }

      try {
        setIsLoadingTimes(true);

        const response = await fetchAvailableAppointmentTimes({
          veterinarianId: selectedVeterinarianId,
          appointmentDate: selectedAppointmentDate,
        });

        setAvailableTimes(response);

        const selectedTime = form.getValues("appointmentTime");
        const exists = response.some((item) => item.value === selectedTime);

        if (!exists) {
          form.setValue("appointmentTime", "", {
            shouldDirty: true,
            shouldTouch: true,
          });
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "No fue posible cargar los horarios disponibles.";

        setAvailableTimes([]);
        form.setValue("appointmentTime", "", {
          shouldDirty: true,
          shouldTouch: true,
        });

        toast.error("No se pudieron cargar los horarios", {
          description: message,
        });
      } finally {
        setIsLoadingTimes(false);
      }
    }

    void loadAvailableTimes();
  }, [form, selectedAppointmentDate, selectedVeterinarianId]);

  const selectedPets = useMemo(() => {
    if (!selectedClientId) {
      return petOptions;
    }

    return petOptions.filter((pet) => pet.client_id === selectedClientId);
  }, [petOptions, selectedClientId]);

  const handleSubmit = form.handleSubmit(async (values: AppointmentFormValues) => {
    if (mode === "create") {
      await onCreate(
        mapCreateAppointmentFormToPayload(values, appointmentTypeOptions),
      );
      onOpenChange(false);
      return;
    }

    if (!appointment) return;

    await onUpdate(
      appointment.id,
      mapUpdateAppointmentFormToPayload(values, appointmentTypeOptions),
    );
    onOpenChange(false);
  });

  const errors = form.formState.errors;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Crear cita" : "Editar cita"}
            </DialogTitle>
            <DialogDescription>
              {mode === "create"
                ? "Completa los datos para registrar una nueva cita."
                : "Actualiza la información de la cita seleccionada."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <span>Veterinario</span>
                  <RequiredMark />
                </Label>

                <Select
                  value={form.watch("veterinarianId") || EMPTY_OPTION_VALUE}
                  onValueChange={(value) => {
                    const normalizedValue =
                      value === EMPTY_OPTION_VALUE ? "" : value;

                    form.setValue("veterinarianId", normalizedValue, {
                      shouldDirty: true,
                      shouldTouch: true,
                    });

                    form.setValue("appointmentDate", "", {
                      shouldDirty: true,
                      shouldTouch: true,
                    });

                    form.setValue("appointmentTime", "", {
                      shouldDirty: true,
                      shouldTouch: true,
                    });

                    setAvailableTimes([]);
                  }}
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Seleccionar una opción" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value={EMPTY_OPTION_VALUE}>
                      Seleccionar una opción
                    </SelectItem>

                    {veterinarianOptions.map((veterinarian) => (
                      <SelectItem key={veterinarian.id} value={veterinarian.id}>
                        {veterinarian.full_name ?? veterinarian.id}
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
                <Label>Tipo de cita</Label>

                <Select
                  value={form.watch("appointmentTypeId") || EMPTY_OPTION_VALUE}
                  onValueChange={(value) => {
                    form.setValue(
                      "appointmentTypeId",
                      value === EMPTY_OPTION_VALUE ? "" : value,
                      { shouldDirty: true, shouldTouch: true },
                    );
                  }}
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Seleccionar una opción" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value={EMPTY_OPTION_VALUE}>
                      Seleccionar una opción
                    </SelectItem>

                    {appointmentTypeOptions.map((appointmentType) => (
                      <SelectItem key={appointmentType.id} value={appointmentType.id}>
                        {appointmentType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cliente</Label>
                <div className="flex gap-2">
                  <Input
                    value={form.watch("clientLabel")}
                    readOnly
                    placeholder="Selecciona un cliente"
                    className="h-11 flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11"
                    onClick={() => setIsClientSelectorOpen(true)}
                  >
                    Buscar cliente
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mascota</Label>
                <div className="flex gap-2">
                  <Input
                    value={form.watch("petLabel")}
                    readOnly
                    placeholder="Selecciona una mascota"
                    className="h-11 flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11"
                    onClick={() => setIsPetSelectorOpen(true)}
                    disabled={!selectedClientId}
                  >
                    Buscar mascota
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <span>Fecha</span>
                  <RequiredMark />
                </Label>

                <AppointmentDatePicker
                  value={form.watch("appointmentDate")}
                  disabled={!selectedVeterinarianId}
                  onChange={(value) => {
                    form.setValue("appointmentDate", value, {
                      shouldDirty: true,
                      shouldTouch: true,
                    });

                    form.setValue("appointmentTime", "", {
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  }}
                />

                {errors.appointmentDate && (
                  <p className="text-sm text-red-500">
                    {errors.appointmentDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <span>Horario disponible</span>
                  <RequiredMark />
                </Label>

                <Select
                  value={form.watch("appointmentTime") || EMPTY_OPTION_VALUE}
                  onValueChange={(value) => {
                    form.setValue(
                      "appointmentTime",
                      value === EMPTY_OPTION_VALUE ? "" : value,
                      { shouldDirty: true, shouldTouch: true },
                    );
                  }}
                  disabled={
                    !selectedVeterinarianId ||
                    !selectedAppointmentDate ||
                    isLoadingTimes ||
                    availableTimes.length === 0
                  }
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue
                      placeholder={
                        isLoadingTimes
                          ? "Cargando horarios..."
                          : "Seleccionar una opción"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value={EMPTY_OPTION_VALUE}>
                      Seleccionar una opción
                    </SelectItem>

                    {availableTimes.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.appointmentTime && (
                  <p className="text-sm text-red-500">
                    {errors.appointmentTime.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Estado</Label>

                <Select
                  value={form.watch("status") || EMPTY_OPTION_VALUE}
                  onValueChange={(value) => {
                    form.setValue(
                      "status",
                      value === EMPTY_OPTION_VALUE ? "" : value,
                      { shouldDirty: true, shouldTouch: true },
                    );
                  }}
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Seleccionar una opción" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value={EMPTY_OPTION_VALUE}>
                      Seleccionar una opción
                    </SelectItem>
                    <SelectItem value="SCHEDULED">Agendada</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmada</SelectItem>
                    <SelectItem value="CHECKED_IN">Recepcionada</SelectItem>
                    <SelectItem value="IN_PROGRESS">En curso</SelectItem>
                    <SelectItem value="COMPLETED">Terminada</SelectItem>
                    <SelectItem value="NO_SHOW">No asistió</SelectItem>
                    <SelectItem value="CANCELLED">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Origen reserva</Label>

                <Select
                  value={form.watch("bookedSource") || EMPTY_OPTION_VALUE}
                  onValueChange={(value) => {
                    form.setValue(
                      "bookedSource",
                      value === EMPTY_OPTION_VALUE ? "" : value,
                      { shouldDirty: true, shouldTouch: true },
                    );
                  }}
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Seleccionar una opción" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value={EMPTY_OPTION_VALUE}>
                      Seleccionar una opción
                    </SelectItem>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                    <SelectItem value="CLIENT_PORTAL">CLIENT_PORTAL</SelectItem>
                    <SelectItem value="PUBLIC">PUBLIC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="reason">Motivo</Label>
                <Textarea id="reason" {...form.register("reason")} />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="cancelReason">Motivo de cancelación</Label>
                <Textarea id="cancelReason" {...form.register("cancelReason")} />
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
                    ? "Crear cita"
                    : "Guardar cambios"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ClientSelectorDialog
        open={isClientSelectorOpen}
        onOpenChange={setIsClientSelectorOpen}
        clients={clientOptions}
        onSelectClient={(client) => {
          form.setValue("clientId", client.id, {
            shouldDirty: true,
            shouldTouch: true,
          });
          form.setValue(
            "clientLabel",
            `${client.full_name} - ${client.document_id ?? "Sin documento"}`,
            {
              shouldDirty: true,
              shouldTouch: true,
            },
          );
          form.setValue("petId", "", {
            shouldDirty: true,
            shouldTouch: true,
          });
          form.setValue("petLabel", "", {
            shouldDirty: true,
            shouldTouch: true,
          });
        }}
      />

      <PetSelectorDialog
        open={isPetSelectorOpen}
        onOpenChange={setIsPetSelectorOpen}
        pets={selectedPets}
        selectedClientId={selectedClientId}
        onSelectPet={(pet) => {
          form.setValue("petId", pet.id, {
            shouldDirty: true,
            shouldTouch: true,
          });
          form.setValue("petLabel", pet.name, {
            shouldDirty: true,
            shouldTouch: true,
          });
        }}
      />
    </>
  );
}