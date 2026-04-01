"use client";

import dynamic from "next/dynamic";
import {
  CalendarDays,
  ClipboardList,
  PawPrint,
  Stethoscope,
  Users,
  UserRoundCog,
} from "lucide-react";

import { useDashboardData } from "@/hooks/dashboard/use-dashboard-data";
import type { DashboardChartItem } from "@/types/dashboard/dashboard.type";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type KpiCardItem = {
  title: string;
  value: string;
  subtitle: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
};

function buildDonutChartOptions(labels: string[]): ApexCharts.ApexOptions {
  return {
    chart: {
      type: "donut",
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    labels,
    legend: {
      position: "bottom",
      fontSize: "12px",
      labels: {
        colors: "#475569",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (
        value: number,
        opts?: {
          seriesIndex?: number;
          w?: { globals?: { series?: number[] } };
        },
      ) => {
        const seriesIndex = opts?.seriesIndex ?? -1;
        const series = opts?.w?.globals?.series ?? [];
        const seriesValue =
          seriesIndex >= 0 && typeof series[seriesIndex] === "number"
            ? series[seriesIndex]
            : 0;

        return `${seriesValue} (${value.toFixed(1)}%)`;
      },
      style: {
        fontSize: "12px",
        fontWeight: 700,
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} registros`,
      },
    },
    stroke: {
      colors: ["#ffffff"],
    },
    colors: ["#38bdf8", "#60a5fa", "#34d399", "#f59e0b", "#f87171", "#a78bfa"],
  };
}

function buildBarChartOptions(categories: string[]): ApexCharts.ApexOptions {
  return {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "42%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "12px",
        },
      },
    },
    grid: {
      borderColor: "#e2e8f0",
      strokeDashArray: 4,
    },
    colors: ["#3b82f6"],
    legend: {
      show: false,
    },
  };
}

function buildLineChartOptions(categories: string[]): ApexCharts.ApexOptions {
  return {
    chart: {
      type: "line",
      toolbar: { show: false },
      fontFamily: "inherit",
      zoom: { enabled: false },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      labels: {
        formatter: (value: number) => `${Math.round(value)}`,
        style: {
          colors: "#64748b",
          fontSize: "12px",
        },
      },
    },
    grid: {
      borderColor: "#e2e8f0",
      strokeDashArray: 4,
    },
    colors: ["#2563eb"],
    tooltip: {
      shared: true,
      intersect: false,
    },
  };
}

function chartLabels(items: DashboardChartItem[]): string[] {
  return items.map((item) => item.label);
}

function chartValues(items: DashboardChartItem[]): number[] {
  return items.map((item) => item.value);
}

function KpiCard({ item }: { item: KpiCardItem }) {
  const Icon = item.icon;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
          <Icon className="size-4" />
        </div>

        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
          {item.badge}
        </span>
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          {item.title}
        </p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          {item.value}
        </p>
        <p className="mt-2 text-xs text-slate-500">{item.subtitle}</p>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  rightSlot,
  children,
}: {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {subtitle ? (
            <p className="text-sm text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        {rightSlot}
      </div>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}

function EmptyChartState({ label }: { label: string }) {
  return (
    <div className="flex h-[340px] items-center justify-center rounded-2xl bg-slate-50 text-sm text-slate-500">
      {label}
    </div>
  );
}

function SummaryTable({
  title,
  icon,
  columns,
  rows,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  columns: string[];
  rows: React.ReactNode[][];
}) {
  const Icon = icon;

  return (
    <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <Icon className="size-4" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">Resumen operativo reciente</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-400"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`${rowIndex}-${cellIndex}`}
                      className="bg-slate-50 px-3 py-3 align-top text-sm text-slate-700 first:rounded-l-2xl last:rounded-r-2xl"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="rounded-2xl bg-slate-50 px-4 py-10 text-center text-sm text-slate-500"
                >
                  No hay datos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminDashboardPage() {
  const { dashboardData, isLoading, errorMessage } = useDashboardData();

  const kpiCards: KpiCardItem[] = dashboardData
    ? [
        {
          title: "Clientes registrados",
          value: String(dashboardData.summaryCards.totalClients),
          subtitle: "Base actual de clientes en la clínica.",
          badge: "Clientes",
          icon: Users,
        },
        {
          title: "Mascotas registradas",
          value: String(dashboardData.summaryCards.totalPets),
          subtitle: "Pacientes disponibles en el sistema.",
          badge: "Pacientes",
          icon: PawPrint,
        },
        {
          title: "Veterinarios",
          value: String(dashboardData.summaryCards.totalVeterinarians),
          subtitle: "Profesionales registrados para atención.",
          badge: "Equipo",
          icon: UserRoundCog,
        },
        {
          title: "Consultas clínicas",
          value: String(dashboardData.summaryCards.totalConsultations),
          subtitle: "Atenciones clínicas registradas.",
          badge: "Clínica",
          icon: Stethoscope,
        },
        {
          title: "Próximas citas",
          value: String(dashboardData.summaryCards.upcomingAppointments),
          subtitle: "Citas pendientes desde hoy en adelante.",
          badge: "Agenda",
          icon: CalendarDays,
        },
      ]
    : [];

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto bg-slate-50/70 p-4 md:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Vista general de clientes, pacientes, agenda y actividad clínica.
          </p>
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {isLoading && !dashboardData ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500 shadow-sm">
          Cargando panel operativo...
        </div>
      ) : null}

      {dashboardData ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
            {kpiCards.map((item) => (
              <KpiCard key={item.title} item={item} />
            ))}
          </div>

          <div className="grid items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-8">
              <SectionCard
                title="Citas de los próximos 7 días"
                subtitle="Demanda agendada desde hoy en adelante"
                rightSlot={
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                    Próxima semana
                  </span>
                }
              >
                {dashboardData.appointmentsByNextDaysChart.length > 0 ? (
                  <ReactApexChart
                    type="line"
                    height={340}
                    options={buildLineChartOptions(
                      chartLabels(dashboardData.appointmentsByNextDaysChart),
                    )}
                    series={[
                      {
                        name: "Citas",
                        data: chartValues(
                          dashboardData.appointmentsByNextDaysChart,
                        ),
                      },
                    ]}
                  />
                ) : (
                  <EmptyChartState label="No hay citas próximas para graficar." />
                )}
              </SectionCard>
            </div>

            <div className="xl:col-span-4">
              <SectionCard
                title="Citas por estado"
                subtitle="Distribución operacional de la agenda"
              >
                {dashboardData.appointmentStatusChart.length > 0 ? (
                  <div className="flex flex-1 items-center justify-center">
                    <ReactApexChart
                      type="donut"
                      height={340}
                      options={buildDonutChartOptions(
                        chartLabels(dashboardData.appointmentStatusChart),
                      )}
                      series={chartValues(dashboardData.appointmentStatusChart)}
                    />
                  </div>
                ) : (
                  <EmptyChartState label="No hay estados de cita disponibles." />
                )}
              </SectionCard>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-12">
            <div className="xl:col-span-4">
              <SectionCard
                title="Pacientes por especie"
                subtitle="Composición actual de pacientes"
              >
                {dashboardData.petsBySpeciesChart.length > 0 ? (
                  <ReactApexChart
                    type="donut"
                    height={300}
                    options={buildDonutChartOptions(
                      chartLabels(dashboardData.petsBySpeciesChart),
                    )}
                    series={chartValues(dashboardData.petsBySpeciesChart)}
                  />
                ) : (
                  <EmptyChartState label="No hay especies registradas para mostrar." />
                )}
              </SectionCard>
            </div>

            <div className="xl:col-span-4">
              <SectionCard
                title="Canales de reserva"
                subtitle="Origen de agendamiento de citas"
              >
                {dashboardData.appointmentsBySourceChart.length > 0 ? (
                  <ReactApexChart
                    type="bar"
                    height={300}
                    options={buildBarChartOptions(
                      chartLabels(dashboardData.appointmentsBySourceChart),
                    )}
                    series={[
                      {
                        name: "Reservas",
                        data: chartValues(
                          dashboardData.appointmentsBySourceChart,
                        ),
                      },
                    ]}
                  />
                ) : (
                  <EmptyChartState label="No hay fuentes de reserva disponibles." />
                )}
              </SectionCard>
            </div>

            <div className="xl:col-span-4">
              <SectionCard
                title="Resumen operativo"
                subtitle="Indicadores rápidos"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">Clientes</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {dashboardData.summaryCards.totalClients}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">Mascotas</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {dashboardData.summaryCards.totalPets}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-xs text-emerald-700">Próximas citas</p>
                    <p className="mt-2 text-3xl font-bold text-emerald-700">
                      {dashboardData.summaryCards.upcomingAppointments}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-sky-50 p-4">
                    <p className="text-xs text-sky-700">Consultas</p>
                    <p className="mt-2 text-3xl font-bold text-sky-700">
                      {dashboardData.summaryCards.totalConsultations}
                    </p>
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>

          <div className="grid items-stretch gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <SummaryTable
                title="Próximas citas"
                icon={CalendarDays}
                columns={[
                  "Fecha",
                  "Hora",
                  "Mascota",
                  "Cliente",
                  "Veterinario",
                  "Estado",
                ]}
                rows={dashboardData.upcomingAppointmentsTable.map((item) => [
                  item.dateLabel,
                  item.timeLabel,
                  item.petName,
                  item.clientName,
                  item.veterinarianName,
                  <span
                    key={item.id}
                    className="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700"
                  >
                    {item.status}
                  </span>,
                ])}
              />
            </div>

            <div className="xl:col-span-5">
              <SummaryTable
                title="Consultas recientes"
                icon={ClipboardList}
                columns={["Mascota", "Veterinario", "Diagnóstico", "Resumen"]}
                rows={dashboardData.recentConsultationsTable.map((item) => [
                  item.petName,
                  item.veterinarianName,
                  item.diagnosis,
                  item.summary,
                ])}
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
