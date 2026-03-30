import { z } from "zod";

export const createAppointmentSchema = z.object({
  veterinarianId: z.string().min(1, "Debes seleccionar un veterinario."),
  appointmentTypeId: z.string().optional().or(z.literal("")),
  clientId: z.string().optional().or(z.literal("")),
  clientLabel: z.string().optional().or(z.literal("")),
  petId: z.string().optional().or(z.literal("")),
  petLabel: z.string().optional().or(z.literal("")),
  appointmentDate: z.string().min(1, "Debes seleccionar una fecha."),
  appointmentTime: z.string().min(1, "Debes seleccionar un horario disponible."),
  status: z.string().optional().or(z.literal("")),
  reason: z
    .string()
    .max(500, "El motivo no puede superar los 500 caracteres.")
    .optional()
    .or(z.literal("")),
  bookedSource: z.string().optional().or(z.literal("")),
  cancelReason: z
    .string()
    .max(500, "El motivo de cancelación no puede superar los 500 caracteres.")
    .optional()
    .or(z.literal("")),
});

export const updateAppointmentSchema = z.object({
  veterinarianId: z.string().optional().or(z.literal("")),
  appointmentTypeId: z.string().optional().or(z.literal("")),
  clientId: z.string().optional().or(z.literal("")),
  clientLabel: z.string().optional().or(z.literal("")),
  petId: z.string().optional().or(z.literal("")),
  petLabel: z.string().optional().or(z.literal("")),
  appointmentDate: z.string().optional().or(z.literal("")),
  appointmentTime: z.string().optional().or(z.literal("")),
  status: z.string().optional().or(z.literal("")),
  reason: z
    .string()
    .max(500, "El motivo no puede superar los 500 caracteres.")
    .optional()
    .or(z.literal("")),
  bookedSource: z.string().optional().or(z.literal("")),
  cancelReason: z
    .string()
    .max(500, "El motivo de cancelación no puede superar los 500 caracteres.")
    .optional()
    .or(z.literal("")),
});

export type CreateAppointmentSchemaData = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentSchemaData = z.infer<typeof updateAppointmentSchema>;