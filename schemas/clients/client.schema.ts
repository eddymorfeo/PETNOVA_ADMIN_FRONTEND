import { z } from "zod";

export const createClientSchema = z.object({
  fullName: z
    .string()
    .min(3, "El nombre completo debe tener al menos 3 caracteres.")
    .max(150, "El nombre completo no puede superar los 150 caracteres."),
  email: z.email("Ingresa un correo válido."),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .max(120, "La contraseña no puede superar los 120 caracteres."),
  phone: z
    .string()
    .max(20, "El teléfono no puede superar los 20 caracteres.")
    .optional()
    .or(z.literal("")),
  documentId: z
    .string()
    .max(30, "El documento no puede superar los 30 caracteres.")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .max(200, "La dirección no puede superar los 200 caracteres.")
    .optional()
    .or(z.literal("")),
  isActive: z.boolean(),
});

export const updateClientSchema = z.object({
  fullName: z
    .string()
    .max(150, "El nombre completo no puede superar los 150 caracteres.")
    .optional()
    .or(z.literal("")),
  email: z
    .union([z.literal(""), z.email("Ingresa un correo válido.")])
    .optional(),
  password: z
    .string()
    .max(120, "La contraseña no puede superar los 120 caracteres.")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .max(20, "El teléfono no puede superar los 20 caracteres.")
    .optional()
    .or(z.literal("")),
  documentId: z
    .string()
    .max(30, "El documento no puede superar los 30 caracteres.")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .max(200, "La dirección no puede superar los 200 caracteres.")
    .optional()
    .or(z.literal("")),
  isActive: z.boolean().optional(),
});

export type CreateClientSchemaData = z.infer<typeof createClientSchema>;
export type UpdateClientSchemaData = z.infer<typeof updateClientSchema>;