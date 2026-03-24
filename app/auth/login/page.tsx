import Image from "next/image";
import { PawPrint, Stethoscope, ShieldCheck, ClipboardList } from "lucide-react";

import { LoginForm } from "@/components/pages/login/login-form";

const portalHighlights = [
  {
    icon: ShieldCheck,
    title: "Acceso protegido",
    description:
      "Gestiona usuarios, roles y operaciones internas desde un entorno centralizado.",
  },
  {
    icon: ClipboardList,
    title: "Control administrativo",
    description:
      "Supervisa citas, pacientes, clientes, fichas clínicas y módulos del sistema.",
  },
  {
    icon: Stethoscope,
    title: "Entorno profesional",
    description:
      "Diseñado para el backoffice de una consulta veterinaria moderna y escalable.",
  },
];

export default function LoginPage() {
  return (
    <main className="min-h-svh bg-[linear-gradient(180deg,#f8fafc_0%,#eef6f3_100%)]">
      <div className="mx-auto flex min-h-svh w-full max-w-[1600px] items-center justify-center p-4 md:p-6 xl:p-8">
        <section className="grid min-h-[92vh] w-full overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.10)] lg:grid-cols-[minmax(520px,1fr)_1.15fr]">
          <div className="relative flex flex-col justify-between bg-white px-6 py-8 sm:px-10 lg:px-14 lg:py-12">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                <PawPrint className="size-5" />
              </div>

              <div className="space-y-0.5">
                <p className="text-sm font-semibold tracking-wide text-slate-900">
                  PETNOVA
                </p>
                <p className="text-xs text-slate-500">
                  Portal administrativo
                </p>
              </div>
            </div>

            <div className="flex flex-1 items-center py-10 lg:py-0">
              <div className="w-full max-w-xl">
                <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
                  <LoginForm />
                </div>
              </div>
            </div>
          </div>

          <div className="relative hidden min-h-full lg:block">
            <Image
              src="/images/admin-login-vet.jpg"
              alt="Entorno administrativo veterinario"
              fill
              priority
              className="object-cover"
            />

            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(2,6,23,0.82)_0%,rgba(15,23,42,0.55)_40%,rgba(5,150,105,0.30)_100%)]" />

            <div className="absolute inset-0 flex flex-col justify-between p-10 xl:p-14">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md">
                <ShieldCheck className="size-4" />
                Backoffice veterinario
              </div>

              <div className="max-w-xl space-y-8 text-white">
                <div className="space-y-4">
                  <h2 className="text-3xl font-semibold leading-tight xl:text-4xl">
                    Administra tu consulta veterinaria desde una sola plataforma
                  </h2>
                  <p className="max-w-lg text-sm leading-7 text-white/80 xl:text-base">
                    Centraliza la operación clínica, el seguimiento de pacientes
                    y la gestión interna del negocio con una experiencia clara,
                    segura y profesional.
                  </p>
                </div>

                <div className="grid gap-4">
                  {portalHighlights.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
                            <Icon className="size-5" />
                          </div>

                          <div className="space-y-1">
                            <h3 className="text-sm font-semibold xl:text-base">
                              {item.title}
                            </h3>
                            <p className="text-sm leading-6 text-white/75">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}