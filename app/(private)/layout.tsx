"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  getAdminSessionFromStorage,
  getPrimaryRoleCode,
} from "@/lib/auth/admin-session";
import { canAccessPath } from "@/lib/auth/admin-access.utils";
import type { AdminSession } from "@/types/auth/admin-session";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [session, setSession] = useState<AdminSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedSession = getAdminSessionFromStorage();
    setSession(storedSession);
    setIsReady(true);
  }, []);

  const roleCode = useMemo(() => getPrimaryRoleCode(session), [session]);

  useEffect(() => {
    if (!isReady) return;

    if (!session) {
      router.replace("/auth/login");
      return;
    }

    if (!canAccessPath(roleCode, pathname)) {
      router.replace("/dashboard");
    }
  }, [isReady, pathname, roleCode, router, session]);

  if (!isReady) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50">
        <p className="text-sm text-slate-500">Cargando sesión...</p>
      </main>
    );
  }

  if (!session) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}