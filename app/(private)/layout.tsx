"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { useAuth } from "@/hooks/auth/use-auth";
import { getRequiredPermissions } from "@/lib/auth/route-permissions";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, hasAnyPermission } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/auth/login");
      return;
    }

    const requiredPermissions = getRequiredPermissions(pathname);

    if (
      requiredPermissions &&
      requiredPermissions.length > 0 &&
      !hasAnyPermission(requiredPermissions)
    ) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, pathname, router, hasAnyPermission]);

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50">
        <p className="text-sm text-slate-500">Cargando sesión...</p>
      </main>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <main>
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
    </main>
  );
}