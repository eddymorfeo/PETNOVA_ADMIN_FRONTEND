"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createUserRoleSchema } from "@/schemas/user-role/user-role.schema";
import type {
  CreateUserRolePayload,
  UserRoleFormValues,
  UserRoleOption,
  UserRoleUserOption,
} from "@/types/user-role/user-role-type";
import { mapCreateUserRoleFormToPayload } from "@/utils/user-role/user-role-mappers";

type UserRoleFormDialogProps = {
  open: boolean;
  users: UserRoleUserOption[];
  roles: UserRoleOption[];
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (values: CreateUserRolePayload) => Promise<void>;
};

const defaultValues: UserRoleFormValues = {
  userId: "",
  roleId: "",
};

export function UserRoleFormDialog({
  open,
  users,
  roles,
  isSubmitting,
  onOpenChange,
  onCreate,
}: UserRoleFormDialogProps) {
  const form = useForm<UserRoleFormValues>({
    defaultValues,
    resolver: zodResolver(createUserRoleSchema) as never,
  });

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
  }, [form, open]);

  const handleSubmit = form.handleSubmit(async (values: UserRoleFormValues) => {
    await onCreate(mapCreateUserRoleFormToPayload(values));
    onOpenChange(false);
  });

  const errors = form.formState.errors;
  const selectedUserId = form.watch("userId");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>Asignar rol</DialogTitle>
          <DialogDescription>
            Completa los datos para asociar un rol a un usuario.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="userId">
                Usuario<span className="text-red-500">*</span>
              </Label>

              <Select
                value={form.watch("userId")}
                onValueChange={(value) =>
                  form.setValue("userId", value, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id="userId">
                  <SelectValue placeholder="Seleccionar usuario" />
                </SelectTrigger>

                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name} · {user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.userId && (
                <p className="text-sm text-red-500">{errors.userId.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="roleId">
                Rol<span className="text-red-500">*</span>
              </Label>

              <Select
                value={form.watch("roleId")}
                onValueChange={(value) =>
                  form.setValue("roleId", value, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id="roleId">
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>

                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.roleId && (
                <p className="text-sm text-red-500">{errors.roleId.message}</p>
              )}
            </div>
          </div>

          {selectedUserId ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm font-medium text-slate-900">
                Usuario seleccionado
              </p>
              <p className="text-xs text-slate-500">
                {users.find((item) => item.id === selectedUserId)?.full_name} ·{" "}
                {users.find((item) => item.id === selectedUserId)?.email}
              </p>
            </div>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Crear asignación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}