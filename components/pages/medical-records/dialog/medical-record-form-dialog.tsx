"use client";

import { useEffect, useState } from "react";
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
  createMedicalRecordSchema,
  updateMedicalRecordSchema,
} from "@/schemas/medical-records/medical-record.schema";
import {
  mapConsultationToFormValues,
  mapCreateMedicalRecordFormToPayload,
  mapUpdateMedicalRecordFormToPayload,
} from "@/utils/medical-records/medical-record.mappers";

import type {
  AppointmentItem,
  VeterinarianOption,
} from "@/types/appointments/appointment-type";
import type { ClientItem } from "@/types/clients/client.type";
import type {
  ConsultationItem,
  CreateConsultationPayload,
  MedicalRecordFormValues,
  UpdateConsultationPayload,
} from "@/types/medical-records/medical-record.type";
import type { PetItem } from "@/types/pets/pet.type";

import { AppointmentSelectorDialog } from "@/components/pages/medical-records/dialog/appointment-selector-dialog";

type MedicalRecordFormDialogProps = {
  mode: "create" | "edit";
  open: boolean;
  consultation?: ConsultationItem | null;
  appointments: AppointmentItem[];
  clients: ClientItem[];
  pets: PetItem[];
  veterinarians: VeterinarianOption[];
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (values: CreateConsultationPayload) => Promise<void>;
  onUpdate: (
    consultationId: string,
    values: UpdateConsultationPayload,
  ) => Promise<void>;
};

const defaultValues: MedicalRecordFormValues = {
  appointmentId: "",
  appointmentLabel: "",
  petId: "",
  petLabel: "",
  clientId: "",
  clientLabel: "",
  veterinarianId: "",
  chiefComplaint: "",
  anamnesis: "",
  physicalExam: "",
  assessment: "",
  plan: "",
  weightKg: "",
  temperatureC: "",
  diagnosis: "",
  summary: "",
};

function RequiredMark() {
  return <span className="text-red-500">*</span>;
}

export function MedicalRecordFormDialog({
  mode,
  open,
  consultation,
  appointments,
  veterinarians,
  isSubmitting,
  onOpenChange,
  onCreate,
  onUpdate,
}: MedicalRecordFormDialogProps) {
  const [isAppointmentSelectorOpen, setIsAppointmentSelectorOpen] =
    useState(false);

  const form = useForm<MedicalRecordFormValues>({
    defaultValues,
    resolver: zodResolver(
      mode === "create"
        ? createMedicalRecordSchema
        : updateMedicalRecordSchema,
    ) as never,
  });

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && consultation) {
      form.reset(mapConsultationToFormValues(consultation));
      return;
    }

    form.reset(defaultValues);
  }, [consultation, form, mode, open]);

  const handleSubmit = form.handleSubmit(
    async (values: MedicalRecordFormValues) => {
      if (mode === "create") {
        await onCreate(mapCreateMedicalRecordFormToPayload(values));
        onOpenChange(false);
        return;
      }

      if (!consultation) return;

      await onUpdate(
        consultation.id,
        mapUpdateMedicalRecordFormToPayload(values),
      );
      onOpenChange(false);
    },
  );

  const errors = form.formState.errors;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[980px] max-h-[90vh] overflow-hidden p-0">
          <div className="flex h-full max-h-[90vh] flex-col">
            <DialogHeader className="shrink-0 border-b border-slate-200 px-6 py-5">
              <DialogTitle>
                {mode === "create"
                  ? "Crear ficha clínica"
                  : "Editar ficha clínica"}
              </DialogTitle>
              <DialogDescription>
                {mode === "create"
                  ? "Completa los datos para registrar una nueva ficha clínica."
                  : "Actualiza la información clínica registrada."}
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label className="flex items-center gap-1">
                        <span>Cita</span>
                        <RequiredMark />
                      </Label>

                      <div className="flex gap-2">
                        <Input
                          value={form.watch("appointmentLabel")}
                          readOnly
                          placeholder="Selecciona una cita"
                          className="h-11 flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="h-11"
                          onClick={() => setIsAppointmentSelectorOpen(true)}
                        >
                          Buscar cita
                        </Button>
                      </div>

                      {errors.appointmentLabel && (
                        <p className="text-sm text-red-500">
                          {errors.appointmentLabel.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        <span>Mascota</span>
                        <RequiredMark />
                      </Label>
                      <Input
                        value={form.watch("petLabel")}
                        readOnly
                        className="h-11 w-full"
                        placeholder="Se completa desde la cita"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        <span>Cliente</span>
                        <RequiredMark />
                      </Label>
                      <Input
                        value={form.watch("clientLabel")}
                        readOnly
                        className="h-11 w-full"
                        placeholder="Se completa desde la cita"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        <span>Veterinario</span>
                        <RequiredMark />
                      </Label>
                      <Input
                        value={
                          veterinarians.find(
                            (veterinarian) =>
                              veterinarian.id === form.watch("veterinarianId"),
                          )?.full_name ?? ""
                        }
                        readOnly
                        className="h-11 w-full"
                        placeholder="Se completa desde la cita"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weightKg">Peso (kg)</Label>
                      <Input
                        id="weightKg"
                        {...form.register("weightKg")}
                        className="h-11 w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="temperatureC">Temperatura (°C)</Label>
                      <Input
                        id="temperatureC"
                        {...form.register("temperatureC")}
                        className="h-11 w-full"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="chiefComplaint">Motivo de consulta</Label>
                      <Textarea
                        id="chiefComplaint"
                        {...form.register("chiefComplaint")}
                        className="min-h-[110px]"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="anamnesis">Anamnesis</Label>
                      <Textarea
                        id="anamnesis"
                        {...form.register("anamnesis")}
                        className="min-h-[110px]"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="physicalExam">Examen físico</Label>
                      <Textarea
                        id="physicalExam"
                        {...form.register("physicalExam")}
                        className="min-h-[110px]"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="assessment">Evaluación clínica</Label>
                      <Textarea
                        id="assessment"
                        {...form.register("assessment")}
                        className="min-h-[110px]"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="plan">Plan</Label>
                      <Textarea
                        id="plan"
                        {...form.register("plan")}
                        className="min-h-[110px]"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="diagnosis">Diagnóstico</Label>
                      <Textarea
                        id="diagnosis"
                        {...form.register("diagnosis")}
                        className="min-h-[110px]"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="summary">Resumen</Label>
                      <Textarea
                        id="summary"
                        {...form.register("summary")}
                        className="min-h-[110px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="shrink-0 border-t border-slate-200 px-6 py-4">
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
                      ? "Crear ficha"
                      : "Guardar cambios"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <AppointmentSelectorDialog
        open={isAppointmentSelectorOpen}
        onOpenChange={setIsAppointmentSelectorOpen}
        appointments={appointments}
        onSelectAppointment={(appointment) => {
          form.setValue("appointmentId", appointment.id, {
            shouldDirty: true,
            shouldTouch: true,
          });
          form.setValue("appointmentLabel", appointment.id, {
            shouldDirty: true,
            shouldTouch: true,
          });
          form.setValue("petId", appointment.pet_id ?? "", {
            shouldDirty: true,
            shouldTouch: true,
          });
          form.setValue("petLabel", appointment.pet_name ?? "", {
            shouldDirty: true,
            shouldTouch: true,
          });
          form.setValue("clientId", appointment.client_id ?? "", {
            shouldDirty: true,
            shouldTouch: true,
          });
          form.setValue("clientLabel", appointment.client_name ?? "", {
            shouldDirty: true,
            shouldTouch: true,
          });
          form.setValue("veterinarianId", appointment.veterinarian_id ?? "", {
            shouldDirty: true,
            shouldTouch: true,
          });
        }}
      />
    </>
  );
}