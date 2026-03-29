"use client";

import dynamic from "next/dynamic";
import {
  AlertTriangle,
  CalendarDays,
  DollarSign,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type FilterOption = {
  label: string;
  value: string;
};

type KpiCardItem = {
  title: string;
  value: string;
  subtitle: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
};

const userOptions: FilterOption[] = [
  { label: "Todos", value: "all" },
  { label: "demo_manager", value: "manager" },
  { label: "demo_sales_1", value: "sales_1" },
  { label: "demo_sales_2", value: "sales_2" },
];

const teamOptions: FilterOption[] = [
  { label: "Todos", value: "all" },
  { label: "Comercial", value: "commercial" },
  { label: "Veterinarios", value: "vets" },
  { label: "Recepción", value: "reception" },
];

const supervisorOptions: FilterOption[] = [
  { label: "Todos", value: "all" },
  { label: "Supervisor A", value: "sup_a" },
  { label: "Supervisor B", value: "sup_b" },
];

const kpiCards: KpiCardItem[] = [
  {
    title: "Nuevas oportunidades",
    value: "11",
    subtitle: "Indicador de prospección activa.",
    badge: "Mes",
    icon: TrendingUp,
  },
  {
    title: "Potenciales clientes",
    value: "8",
    subtitle: "Nuevas cuentas para desarrollar.",
    badge: "Cuentas",
    icon: Users,
  },
  {
    title: "Ventas por cerrar",
    value: "$1.2 M",
    subtitle: "Valor abierto: $1,179,000.",
    badge: "Funnel",
    icon: DollarSign,
  },
  {
    title: "Ventas cerradas",
    value: "$140.3 mil",
    subtitle: "Cierre real: $140,302.",
    badge: "Mes",
    icon: Target,
  },
  {
    title: "Cumplimiento global",
    value: "5.71%",
    subtitle: "Vendido vs meta vigente.",
    badge: "En riesgo",
    icon: CalendarDays,
  },
  {
    title: "Alertas activas",
    value: "0",
    subtitle: "Riesgos detectados automáticamente.",
    badge: "Controlado",
    icon: AlertTriangle,
  },
];

const salesTrendOptions: ApexCharts.ApexOptions = {
  chart: {
    type: "line",
    toolbar: { show: false },
    fontFamily: "inherit",
    zoom: { enabled: false },
  },
  stroke: {
    curve: "smooth",
    width: [3, 3, 3],
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    position: "top",
    horizontalAlign: "right",
    fontSize: "13px",
    markers: {
      size: 8,
    },
  },
  grid: {
    borderColor: "#e5e7eb",
    strokeDashArray: 4,
  },
  xaxis: {
    categories: [
      "Semana 6",
      "Semana 7",
      "Semana 8",
      "Semana 9",
      "Semana 10",
      "Semana 11",
      "Semana 12",
      "Semana 13",
    ],
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
  tooltip: {
    shared: true,
    intersect: false,
  },
  colors: ["#2563eb", "#10b981", "#f97316"],
};

const salesTrendSeries = [
  {
    name: "Nuevas",
    data: [11, 1, 2, 0, 9, 2, 0, 0],
  },
  {
    name: "Ganadas",
    data: [0, 0, 2, 1, 0, 0, 0, 0],
  },
  {
    name: "Perdidas",
    data: [0, 0, 2, 0, 0, 0, 2, 0],
  },
];

const complianceRadialOptions: ApexCharts.ApexOptions = {
  chart: {
    type: "radialBar",
    toolbar: { show: false },
    fontFamily: "inherit",
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,
      hollow: {
        size: "62%",
      },
      track: {
        background: "#e5e7eb",
        strokeWidth: "100%",
      },
      dataLabels: {
        name: {
          show: false,
        },
        value: {
          fontSize: "28px",
          fontWeight: 700,
          color: "#0f172a",
          offsetY: 8,
          formatter: (value: number) => `${value.toFixed(1)}%`,
        },
      },
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "light",
      type: "horizontal",
      shadeIntensity: 0.25,
      gradientToColors: ["#ef4444"],
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100],
    },
  },
  stroke: {
    lineCap: "round",
  },
  labels: ["Cumplimiento"],
};

const complianceSeries = [5.7];

const funnelOptions: ApexCharts.ApexOptions = {
  chart: {
    type: "bar",
    toolbar: { show: false },
    fontFamily: "inherit",
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 6,
      barHeight: "42%",
    },
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: "12px",
      fontWeight: 700,
    },
  },
  xaxis: {
    categories: ["Prospecting", "Qualification", "Proposal", "Closing"],
    labels: {
      style: {
        colors: "#64748b",
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: "#334155",
        fontSize: "12px",
      },
    },
  },
  grid: {
    borderColor: "#e5e7eb",
    strokeDashArray: 4,
  },
  colors: ["#3b82f6"],
  legend: {
    show: false,
  },
};

const funnelSeries = [
  {
    name: "Oportunidades",
    data: [2, 3, 9, 5],
  },
];

const productivityBarOptions: ApexCharts.ApexOptions = {
  chart: {
    type: "bar",
    toolbar: { show: false },
    fontFamily: "inherit",
  },
  plotOptions: {
    bar: {
      distributed: true,
      borderRadius: 8,
      columnWidth: "46%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  xaxis: {
    categories: ["Hoy", "Semana", "Completadas", "Pendientes"],
    labels: {
      style: {
        colors: "#64748b",
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: "#64748b",
      },
    },
  },
  colors: ["#cbd5e1", "#dbeafe", "#10b981", "#f59e0b"],
  grid: {
    borderColor: "#e5e7eb",
    strokeDashArray: 4,
  },
};

const productivityBarSeries = [
  {
    name: "Cantidad",
    data: [0, 0, 38, 19],
  },
];

const complianceDetails = [
  { label: "demo_manager", value: 30.83 },
  { label: "demo_sales_1", value: 17.45 },
  { label: "demo_sales_2", value: 0 },
  { label: "demo_sales_3", value: 0 },
];

function DashboardFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="min-w-[170px]">
      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-300"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function KpiCard({ item }: { item: KpiCardItem }) {
  const Icon = item.icon;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
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
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        {rightSlot}
      </div>
      {children}
    </div>
  );
}

export function AdminDashboardPage() {
  const [selectedUser, setSelectedUser] = useState("all");
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [selectedSupervisor, setSelectedSupervisor] = useState("all");

  const kpiGrid = useMemo(() => kpiCards, []);

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto bg-slate-50/70 p-4 md:p-6">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
        Bienvenido al panel de resultados.
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Dashboard Comercial
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Vista ejecutiva del periodo actual · indicadores comerciales y operativos.
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-end">
          <DashboardFilter
            label="Filtrar usuario"
            value={selectedUser}
            options={userOptions}
            onChange={setSelectedUser}
          />
          <DashboardFilter
            label="Equipo"
            value={selectedTeam}
            options={teamOptions}
            onChange={setSelectedTeam}
          />
          <DashboardFilter
            label="Supervisor"
            value={selectedSupervisor}
            options={supervisorOptions}
            onChange={setSelectedSupervisor}
          />
          <button className="h-10 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
            Aplicar
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {kpiGrid.map((item) => (
          <KpiCard key={item.title} item={item} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <SectionCard
            title="Evolución semanal de oportunidades"
            subtitle="Nuevas, ganadas y cerradas perdidas · últimas 8 semanas"
            rightSlot={
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                8 semanas
              </span>
            }
          >
            <ReactApexChart
              type="line"
              height={340}
              options={salesTrendOptions}
              series={salesTrendSeries}
            />
          </SectionCard>
        </div>

        <div className="xl:col-span-4">
          <SectionCard
            title="Cumplimiento de metas"
            subtitle="Global y detalle por ejecutivo"
          >
            <ReactApexChart
              type="radialBar"
              height={260}
              options={complianceRadialOptions}
              series={complianceSeries}
            />

            <div className="mt-4 space-y-4">
              {complianceDetails.map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-600">{item.label}</span>
                    <span className="font-semibold text-slate-500">
                      {item.value.toFixed(2)}%
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${Math.min(item.value, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <SectionCard
            title="Funnel comercial por etapas"
            subtitle="Cantidad de oportunidades por fase del proceso"
          >
            <ReactApexChart
              type="bar"
              height={300}
              options={funnelOptions}
              series={funnelSeries}
            />
          </SectionCard>
        </div>

        <div className="xl:col-span-4">
          <SectionCard
            title="Productividad comercial"
            subtitle="Resumen operativo del periodo"
          >
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Nuevas hoy</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">0</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Nuevas semana</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">0</p>
              </div>

              <div className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-xs text-emerald-700">Tareas completadas</p>
                <p className="mt-2 text-3xl font-bold text-emerald-700">38</p>
              </div>

              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="text-xs text-amber-700">Tareas pendientes</p>
                <p className="mt-2 text-3xl font-bold text-amber-700">19</p>
              </div>
            </div>

            <ReactApexChart
              type="bar"
              height={220}
              options={productivityBarOptions}
              series={productivityBarSeries}
            />
          </SectionCard>
        </div>

        <div className="xl:col-span-4">
          <SectionCard
            title="KPIs gerenciales"
            subtitle="Resumen financiero del panel"
          >
            <div className="space-y-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Volumen por cerrar</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  $1.2 M
                </p>
                <p className="mt-1 text-sm text-slate-500">$1,179,000</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Volumen cerrado (mes)</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  $140.3 mil
                </p>
                <p className="mt-1 text-sm text-slate-500">$140,302</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Ejecutivos activos</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  4
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Seguimiento comercial vigente
                </p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}