"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  createUserSchemaData,
  updateUserSchemaData,
  type CreateUserSchemaData,
  type UpdateUserSchemaData,
} from "@/schemas/users/user.schema";
import type { UserFormValues, UserItem } from "@/types/users/user.type";
import {
  mapCreateFormToPayload,
  mapUpdateFormToPayload,
  mapUserToFormValues,
} from "@/utils/users/user-mappers";

type UserFormDialogProps = {
  mode: "create" | "edit";
  open: boolean;
  user?: UserItem | null;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (values: ReturnType<typeof mapCreateFormToPayload>) => Promise<void>;
  onUpdate: (
    userId: string,
    values: ReturnType<typeof mapUpdateFormToPayload>,
  ) => Promise<void>;
};

const defaultValues: UserFormValues = {
  username: "",
  email: "",
  fullName: "",
  phone: "",
  password: "",
  isActive: true,
};

export function UserFormDialog({
  mode,
  open,
  user,
  isSubmitting,
  onOpenChange,
  onCreate,
  onUpdate,
}: UserFormDialogProps) {
  const form = useForm<CreateUserSchemaData | UpdateUserSchemaData>({
    resolver: zodResolver(
      mode === "create" ? createUserSchemaData : updateUserSchemaData,
    ),
    defaultValues,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === "edit" && user) {
      form.reset(mapUserToFormValues(user));
      return;
    }

    form.reset(defaultValues);
  }, [form, mode, open, user]);

  const handleSubmit = form.handleSubmit(async (values) => {
    if (mode === "create") {
      await onCreate(mapCreateFormToPayload(values as UserFormValues));
      onOpenChange(false);
      return;
    }

    if (!user) {
      return;
    }

    await onUpdate(user.id, mapUpdateFormToPayload(values as UserFormValues));
    onOpenChange(false);
  });

  const errors = form.formState.errors;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Crear usuario" : "Editar usuario"}
          </DialogTitle>

          <DialogDescription>
            {mode === "create"
              ? "Completa los datos para registrar un nuevo usuario administrativo."
              : "Actualiza la información del usuario seleccionado."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" {...form.register("username")} />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" {...form.register("email")} />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input id="fullName" {...form.register("fullName")} />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" {...form.register("phone")} />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {mode === "create" ? "Contraseña" : "Nueva contraseña"}
              </Label>
              <Input id="password" type="password" {...form.register("password")} />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-900">Estado del usuario</p>
              <p className="text-xs text-slate-500">
                Define si el usuario puede operar en el sistema.
              </p>
            </div>

            <Switch
              checked={Boolean(form.watch("isActive"))}
              onCheckedChange={(checked) => form.setValue("isActive", checked)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Guardando..."
                : mode === "create"
                  ? "Crear usuario"
                  : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}