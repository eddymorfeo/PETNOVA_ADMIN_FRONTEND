import { z } from "zod";

export const createVeterinarianSchema = z.object({
  userId: z.string().min(1, "Debes seleccionar un usuario."),
  licenseNumber: z.string().optional(),
  specialtyId: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const updateVeterinarianSchema = z.object({
  userId: z.string().min(1, "Debes seleccionar un usuario."),
  licenseNumber: z.string().optional(),
  specialtyId: z.string().optional(),
  isActive: z.boolean(),
});

export type CreateVeterinarianSchemaData = z.infer<typeof createVeterinarianSchema>;
export type UpdateVeterinarianSchemaData = z.infer<typeof updateVeterinarianSchema>;