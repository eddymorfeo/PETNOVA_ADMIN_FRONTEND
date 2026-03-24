"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { useAuth } from "@/hooks/auth/use-auth";
import { getRequiredPermissions } from "@/lib/auth/route-permissions";

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
    <main className="flex min-h-screen bg-[radial-gradient(circle_at_top,#f5fbf8_0%,#edf5f2_42%,#e8eff1_100%)]">
      <AppSidebar />
      <section className="flex-1 p-6">{children}</section>
    </main>
  );
}