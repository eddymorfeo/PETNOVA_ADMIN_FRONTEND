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
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}