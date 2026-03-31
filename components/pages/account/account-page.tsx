"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BadgeCheck,
  Mail,
  Phone,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";

import { useAccount } from "@/hooks/account/use-account";
import {
  accountSchema,
  type AccountSchemaData,
} from "@/schemas/account/account.schema";
import {
  mapAccountFormToPayload,
  mapAccountUserToFormValues,
} from "@/utils/account/account-mappers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const defaultValues: AccountSchemaData = {
  username: "",
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export function AccountPage() {
  const { account, roles, isLoading, isMutating, handleUpdateAccount } = useAccount();

  const form = useForm<AccountSchemaData>({
    defaultValues,
    resolver: zodResolver(accountSchema),
  });

  useEffect(() => {
    if (!account) {
      return;
    }

    form.reset(mapAccountUserToFormValues(account));
  }, [account, form]);

  const handleSubmit = form.handleSubmit(async (values: AccountSchemaData) => {
    await handleUpdateAccount(mapAccountFormToPayload(values));

    form.reset({
      ...values,
      password: "",
      confirmPassword: "",
    });
  });

  const errors = form.formState.errors;

  return (
    <section className="space-y-6 p-6 md:p-8">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
            Cuenta
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Mi cuenta
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Administra tu información personal y credenciales de acceso.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          Cargando cuenta...
        </div>
      ) : !account ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          No fue posible cargar la información de la cuenta.
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-4">
            <Card className="rounded-[28px] border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    <UserCircle2 className="size-10" />
                  </div>

                  <h2 className="mt-4 text-xl font-semibold text-slate-950">
                    {account.fullName}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    @{account.username}
                  </p>

                  <div className="mt-5 flex w-full flex-col gap-3">
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left">
                      <Mail className="size-4 text-slate-500" />
                      <div>
                        <p className="text-xs text-slate-500">Correo</p>
                        <p className="text-sm font-medium text-slate-900">
                          {account.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left">
                      <Phone className="size-4 text-slate-500" />
                      <div>
                        <p className="text-xs text-slate-500">Teléfono</p>
                        <p className="text-sm font-medium text-slate-900">
                          {account.phone || "Sin teléfono"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BadgeCheck className="size-4 text-emerald-600" />
                  Roles asignados
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {roles.length ? (
                  roles.map((role) => (
                    <div
                      key={role.id}
                      className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                    >
                      {role.name}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-slate-500">
                    Sin roles asignados.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-[28px] border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShieldCheck className="size-5 text-indigo-600" />
                Información personal
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="username">Usuario</Label>
                    <Input
                      id="username"
                      disabled
                      {...form.register("username")}
                      className="bg-slate-100 text-slate-500"
                    />
                  </div>

                  <div className="space-y-2">
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
                      <p className="text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" {...form.register("phone")} />
                    {errors.phone && (
                      <p className="text-sm text-red-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-900">
                    Cambio de contraseña
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Déjalo vacío si no deseas modificar tu contraseña actual.
                  </p>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="password">Nueva contraseña</Label>
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
                      <Label htmlFor="confirmPassword">
                        Confirmar contraseña
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...form.register("confirmPassword")}
                      />
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-500">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="h-11 rounded-xl px-6"
                    disabled={isMutating}
                  >
                    {isMutating ? "Guardando..." : "Guardar cambios"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}