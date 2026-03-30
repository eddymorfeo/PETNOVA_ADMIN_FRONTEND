import { z } from "zod";

export const createMedicalRecordSchema = z.object({
  appointmentId: z.string().min(1, "Debes seleccionar una cita."),
  appointmentLabel: z.string().min(1, "Debes seleccionar una cita."),
  petId: z.string().min(1, "Debes seleccionar una mascota."),
  petLabel: z.string().min(1, "Debes seleccionar una mascota."),
  clientId: z.string().min(1, "Debes seleccionar un cliente."),
  clientLabel: z.string().min(1, "Debes seleccionar un cliente."),
  veterinarianId: z.string().min(1, "Debes seleccionar un veterinario."),
  chiefComplaint: z.string().max(1000).optional().or(z.literal("")),
  anamnesis: z.string().max(3000).optional().or(z.literal("")),
  physicalExam: z.string().max(3000).optional().or(z.literal("")),
  assessment: z.string().max(3000).optional().or(z.literal("")),
  plan: z.string().max(3000).optional().or(z.literal("")),
  weightKg: z.string().optional().or(z.literal("")),
  temperatureC: z.string().optional().or(z.literal("")),
  diagnosis: z.string().max(3000).optional().or(z.literal("")),
  summary: z.string().max(3000).optional().or(z.literal("")),
});

export const updateMedicalRecordSchema = z.object({
  appointmentId: z.string().optional().or(z.literal("")),
  appointmentLabel: z.string().optional().or(z.literal("")),
  petId: z.string().optional().or(z.literal("")),
  petLabel: z.string().optional().or(z.literal("")),
  clientId: z.string().optional().or(z.literal("")),
  clientLabel: z.string().optional().or(z.literal("")),
  veterinarianId: z.string().optional().or(z.literal("")),
  chiefComplaint: z.string().max(1000).optional().or(z.literal("")),
  anamnesis: z.string().max(3000).optional().or(z.literal("")),
  physicalExam: z.string().max(3000).optional().or(z.literal("")),
  assessment: z.string().max(3000).optional().or(z.literal("")),
  plan: z.string().max(3000).optional().or(z.literal("")),
  weightKg: z.string().optional().or(z.literal("")),
  temperatureC: z.string().optional().or(z.literal("")),
  diagnosis: z.string().max(3000).optional().or(z.literal("")),
  summary: z.string().max(3000).optional().or(z.literal("")),
});

export type CreateMedicalRecordSchemaData = z.infer<
  typeof createMedicalRecordSchema
>;
export type UpdateMedicalRecordSchemaData = z.infer<
  typeof updateMedicalRecordSchema
>;