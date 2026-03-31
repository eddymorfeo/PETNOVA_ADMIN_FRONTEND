import { z } from "zod";

export const createTimeOffSchema = z
  .object({
    veterinarianId: z.string().min(1, "Debes seleccionar un veterinario."),
    startDate: z.string().min(1, "Debes seleccionar la fecha de inicio."),
    startTime: z.string().min(1, "Debes seleccionar la hora de inicio."),
    endDate: z.string().min(1, "Debes seleccionar la fecha de término."),
    endTime: z.string().min(1, "Debes seleccionar la hora de término."),
    reason: z.string().optional(),
  })
  .superRefine((values, context) => {
    const start = new Date(`${values.startDate}T${values.startTime}:00`);
    const end = new Date(`${values.endDate}T${values.endTime}:00`);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return;
    }

    if (end <= start) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "La fecha y hora de término debe ser mayor a la de inicio.",
      });
    }
  });

export const updateTimeOffSchema = createTimeOffSchema;

export type CreateTimeOffSchemaData = z.infer<typeof createTimeOffSchema>;
export type UpdateTimeOffSchemaData = z.infer<typeof updateTimeOffSchema>;