"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/auth/use-auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { signIn } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await signIn({
        username,
        password,
      });
    } catch (error) {
      const resolvedMessage =
        error instanceof Error
          ? error.message
          : "No fue posible iniciar sesión.";

      setErrorMessage(resolvedMessage);
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex w-full flex-col gap-8", className)}
      {...props}
    >
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur">
          <ShieldCheck className="size-3.5 text-emerald-600" />
          Acceso seguro al portal administrativo
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            PETNOVA ADMIN
          </h1>
          <p className="max-w-md text-sm leading-6 text-slate-500">
            Ingresa tus credenciales para acceder al panel de administración.
          </p>
        </div>
      </div>

      <FieldGroup className="space-y-5">
        <Field className="space-y-2">
          <FieldLabel
            htmlFor="username"
            className="text-sm font-medium text-slate-700"
          >
            Usuario
          </FieldLabel>

          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="admin"
              autoComplete="username"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="h-12 rounded-xl border-slate-200 bg-white pl-11 text-slate-900 shadow-sm transition focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
            />
          </div>
        </Field>

        <Field className="space-y-2">
          <FieldLabel
            htmlFor="password"
            className="text-sm font-medium text-slate-700"
          >
            Contraseña
          </FieldLabel>

          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 rounded-xl border-slate-200 bg-white pl-11 text-slate-900 shadow-sm transition focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
            />
          </div>
        </Field>

        {errorMessage ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <Field className="pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl bg-slate-950 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}