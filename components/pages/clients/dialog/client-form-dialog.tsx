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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  createClientSchema,
  updateClientSchema,
  type CreateClientSchemaData,
  type UpdateClientSchemaData,
} from "@/schemas/clients/client.schema";
import type {
  ClientFormValues,
  ClientItem,
  CreateClientPayload,
  UpdateClientPayload,
} from "@/types/clients/client.type";
import {
  mapClientToFormValues,
  mapCreateClientFormToPayload,
  mapUpdateClientFormToPayload,
} from "@/utils/clients/client-mappers";

type ClientFormDialogProps = {
  mode: "create" | "edit";
  open: boolean;
  client?: ClientItem | null;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (values: CreateClientPayload) => Promise<void>;
  onUpdate: (clientId: string, values: UpdateClientPayload) => Promise<void>;
};

const defaultValues: ClientFormValues = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  documentId: "",
  address: "",
  isActive: true,
};

export function ClientFormDialog({
  mode,
  open,
  client,
  isSubmitting,
  onOpenChange,
  onCreate,
  onUpdate,
}: ClientFormDialogProps) {
  const form = useForm<ClientFormValues>({
    defaultValues,
    resolver: zodResolver(
      mode === "create" ? createClientSchema : updateClientSchema,
    ) as never,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === "edit" && client) {
      form.reset(mapClientToFormValues(client));
      return;
    }

    form.reset(defaultValues);
  }, [client, form, mode, open]);

  const handleSubmit = form.handleSubmit(async (values: ClientFormValues) => {
    if (mode === "create") {
      await onCreate(mapCreateClientFormToPayload(values));
      onOpenChange(false);
      return;
    }

    if (!client) {
      return;
    }

    await onUpdate(client.id, mapUpdateClientFormToPayload(values));
    onOpenChange(false);
  });

  const errors = form.formState.errors;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Crear cliente" : "Editar cliente"}
          </DialogTitle>

          <DialogDescription>
            {mode === "create"
              ? "Completa los datos para registrar un nuevo cliente."
              : "Actualiza la información del cliente seleccionado. En edición, todos los campos son opcionales."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="fullName">
                Nombre completo<span className="text-red-500">*</span>
              </Label>
              <Input id="fullName" {...form.register("fullName")} />
              {errors.fullName && (
                <p className="text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Correo electrónico<span className="text-red-500">*</span>
              </Label>
              <Input id="email" type="email" {...form.register("email")} />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                <span>
                  {mode === "create" ? "Contraseña" : "Nueva contraseña"}
                </span>
                {mode === "create" && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="password"
                type="password"
                {...form.register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
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
              <Label htmlFor="documentId">Documento / Identificación</Label>
              <Input id="documentId" {...form.register("documentId")} />
              {errors.documentId && (
                <p className="text-sm text-red-500">
                  {errors.documentId.message}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Dirección</Label>
              <Input id="address" {...form.register("address")} />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Estado del cliente
              </p>
              <p className="text-xs text-slate-500">
                Define si el cliente se mantiene activo en el sistema.
              </p>
            </div>

            <Switch
              checked={Boolean(form.watch("isActive"))}
              onCheckedChange={(checked) => {
                form.setValue("isActive", checked, {
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Guardando..."
                : mode === "create"
                  ? "Crear cliente"
                  : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
