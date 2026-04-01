"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  FileText,
  LayoutDashboard,
  PawPrint,
  Settings,
  UserRound,
  Users,
  ShieldCheck,
  BadgeCheck
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { NavMain } from "@/components/layout/nav-main";
import { NavUser } from "@/components/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  getAdminSessionFromStorage,
  getPrimaryRoleCode,
} from "@/lib/auth/admin-session";
import { buildSidebarItems } from "@/lib/auth/admin-access.utils";

const menuIconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  UserRound,
  PawPrint,
  CalendarDays,
  FileText,
  Settings,
  BadgeCheck,
};

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const session = React.useMemo(() => getAdminSessionFromStorage(), []);
  const roleCode = getPrimaryRoleCode(session);

  const navItems = React.useMemo(() => {
    return buildSidebarItems(roleCode, pathname).map((item) => ({
      ...item,
      icon: item.icon ? menuIconMap[item.icon] : undefined,
    }));
  }, [pathname, roleCode]);

  const user = {
    name: session?.user?.fullName ?? "Usuario",
    email: session?.user?.email ?? "",
    avatar: "",
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-slate-200/80 bg-gradient-to-b from-white via-slate-50 to-slate-100/90"
      {...props}
    >
      <div className="px-4 pb-3 pt-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 px-3 py-3 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm">
              <ShieldCheck className="size-5" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-slate-900">
                PETNOVA ADMIN
              </p>
              <p className="truncate text-xs text-slate-500">
                Portal administrativo
              </p>
            </div>
          </div>
        </div>
      </div>

      <SidebarContent className="px-2">
        <NavMain items={navItems} />
      </SidebarContent>
      

      <SidebarFooter className="border-t border-slate-200/70 bg-white/60 px-2 py-3 backdrop-blur">
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}