import { z } from "zod";

export const createUserRoleSchema = z.object({
  userId: z.string().min(1, "Debes seleccionar un usuario."),
  roleId: z.string().min(1, "Debes seleccionar un rol."),
});

export type CreateUserRoleSchemaData = z.infer<typeof createUserRoleSchema>;