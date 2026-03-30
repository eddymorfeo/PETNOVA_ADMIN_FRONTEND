import { z } from "zod";

export const createPetSchema = z.object({
  clientId: z.string().min(1, "Debes seleccionar un cliente."),
  clientLabel: z.string().min(1, "Debes seleccionar un cliente."),
  name: z
    .string()
    .min(2, "El nombre de la mascota debe tener al menos 2 caracteres.")
    .max(100, "El nombre de la mascota no puede superar los 100 caracteres."),
  speciesId: z.string().min(1, "Debes seleccionar una especie."),
  breedId: z.string().optional().or(z.literal("")),
  sex: z.string().min(1, "Debes seleccionar el sexo."),
  birthDate: z.string().min(1, "Debes ingresar la fecha de nacimiento."),
  color: z.string().max(50, "El color no puede superar los 50 caracteres.").optional().or(z.literal("")),
  microchip: z.string().max(100, "El microchip no puede superar los 100 caracteres.").optional().or(z.literal("")),
  isSterilized: z.boolean(),
  allergies: z.string().max(500, "Las alergias no pueden superar los 500 caracteres.").optional().or(z.literal("")),
  notes: z.string().max(1000, "Las notas no pueden superar los 1000 caracteres.").optional().or(z.literal("")),
  isActive: z.boolean(),
});

export const updatePetSchema = z.object({
  clientId: z.string().optional().or(z.literal("")),
  clientLabel: z.string().optional().or(z.literal("")),
  name: z.string().max(100, "El nombre de la mascota no puede superar los 100 caracteres.").optional().or(z.literal("")),
  speciesId: z.string().optional().or(z.literal("")),
  breedId: z.string().optional().or(z.literal("")),
  sex: z.string().optional().or(z.literal("")),
  birthDate: z.string().optional().or(z.literal("")),
  color: z.string().max(50, "El color no puede superar los 50 caracteres.").optional().or(z.literal("")),
  microchip: z.string().max(100, "El microchip no puede superar los 100 caracteres.").optional().or(z.literal("")),
  isSterilized: z.boolean().optional(),
  allergies: z.string().max(500, "Las alergias no pueden superar los 500 caracteres.").optional().or(z.literal("")),
  notes: z.string().max(1000, "Las notas no pueden superar los 1000 caracteres.").optional().or(z.literal("")),
  isActive: z.boolean().optional(),
});

export type CreatePetSchemaData = z.infer<typeof createPetSchema>;
export type UpdatePetSchemaData = z.infer<typeof updatePetSchema>;