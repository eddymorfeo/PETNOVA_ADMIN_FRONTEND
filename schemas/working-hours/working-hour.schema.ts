import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):00$|^24:00$/;

const weekdaysSchema = z
  .array(z.string())
  .min(1, "Debes seleccionar al menos un día.");

export const createWorkingHourSchema = z
  .object({
    veterinarianId: z.string().min(1, "Debes seleccionar un veterinario."),
    weekdays: weekdaysSchema,
    startTime: z
      .string()
      .regex(timeRegex, "Debes seleccionar una hora de inicio válida."),
    endTime: z
      .string()
      .regex(timeRegex, "Debes seleccionar una hora de término válida."),
    slotMinutes: z.string().min(1, "Debes ingresar la duración del bloque."),
    isActive: z.boolean().default(true),
  })
  .superRefine((values, context) => {
    const startValue = values.startTime === "24:00" ? 24 : Number(values.startTime.slice(0, 2));
    const endValue = values.endTime === "24:00" ? 24 : Number(values.endTime.slice(0, 2));

    if (endValue <= startValue) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "La hora de término debe ser mayor que la hora de inicio.",
      });
    }
  });

export const updateWorkingHourSchema = createWorkingHourSchema;

export type CreateWorkingHourSchemaData = z.infer<typeof createWorkingHourSchema>;
export type UpdateWorkingHourSchemaData = z.infer<typeof updateWorkingHourSchema>;