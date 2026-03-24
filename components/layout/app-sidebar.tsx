"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, PawPrint, CalendarDays, FileText } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/auth/use-auth";
import { NavUser } from "@/components/layout/nav-user";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Usuarios",
    href: "/users",
    icon: Users,
    requiredPermissions: ["USERS_VIEW"],
  },
  {
    title: "Mascotas",
    href: "/pets",
    icon: PawPrint,
    requiredPermissions: ["PETS_VIEW"],
  },
  {
    title: "Citas",
    href: "/appointments",
    icon: CalendarDays,
    requiredPermissions: ["APPOINTMENTS_VIEW"],
  },
  {
    title: "Fichas clínicas",
    href: "/medical-records",
    icon: FileText,
    requiredPermissions: ["CONSULTATIONS_VIEW"],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { hasAnyPermission } = useAuth();

  const visibleItems = sidebarItems.filter((item) => {
    if (!item.requiredPermissions) return true;
    return hasAnyPermission(item.requiredPermissions);
  });

  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col border-r border-slate-200 bg-white/90 px-4 py-5 backdrop-blur">
      <div className="mb-6 px-2">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
          PETNOVA
        </p>
        <h2 className="mt-1 text-lg font-semibold text-slate-900">
          Portal administrativo
        </h2>
      </div>

      <nav className="flex-1 space-y-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-slate-950 text-white shadow-lg shadow-slate-950/15"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon className="size-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <NavUser />
    </aside>
  );
}