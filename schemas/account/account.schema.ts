import { z } from "zod";

export const accountSchema = z
  .object({
    username: z.string(),
    fullName: z.string().min(1, "El nombre completo es obligatorio."),
    email: z
      .string()
      .min(1, "El correo electrónico es obligatorio.")
      .email("Debes ingresar un correo válido."),
    phone: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine((values, context) => {
    const hasPassword = values.password.trim().length > 0;
    const hasConfirmPassword = values.confirmPassword.trim().length > 0;

    if (hasPassword || hasConfirmPassword) {
      if (values.password.trim().length < 6) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "La nueva contraseña debe tener al menos 6 caracteres.",
        });
      }

      if (values.password !== values.confirmPassword) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["confirmPassword"],
          message: "La confirmación de contraseña no coincide.",
        });
      }
    }
  });

export type AccountSchemaData = z.infer<typeof accountSchema>;