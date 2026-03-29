import { z } from "zod";

export const createUserSchemaData = z.object({
  username: z
    .string()
    .min(3, "El username debe tener al menos 3 caracteres.")
    .max(50, "El username no puede superar los 50 caracteres."),
  email: z.string().email("Ingresa un correo válido."),
  fullName: z
    .string()
    .min(3, "El nombre completo debe tener al menos 3 caracteres.")
    .max(120, "El nombre completo no puede superar los 120 caracteres."),
  phone: z
    .string()
    .max(20, "El teléfono no puede superar los 20 caracteres.")
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres."),
  isActive: z.boolean(),
});

export const updateUserSchemaData = z.object({
  username: z
    .string()
    .min(3, "El username debe tener al menos 3 caracteres.")
    .max(50, "El username no puede superar los 50 caracteres."),
  email: z.string().email("Ingresa un correo válido."),
  fullName: z
    .string()
    .min(3, "El nombre completo debe tener al menos 3 caracteres.")
    .max(120, "El nombre completo no puede superar los 120 caracteres."),
  phone: z
    .string()
    .max(20, "El teléfono no puede superar los 20 caracteres.")
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .max(120, "La contraseña es demasiado larga.")
    .optional()
    .or(z.literal("")),
  isActive: z.boolean(),
});

export type CreateUserSchemaData = z.infer<typeof createUserSchemaData>;
export type UpdateUserSchemaData = z.infer<typeof updateUserSchemaData>;