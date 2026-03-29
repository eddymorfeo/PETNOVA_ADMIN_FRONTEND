"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

type BreadcrumbEntry = {
  label: string;
  href: string;
};

const segmentLabels: Record<string, string> = {
  dashboard: "Dashboard",
  users: "Users",
  clients: "Clientes",
  pets: "Mascotas",
  appointments: "Citas",
  "medical-records": "Fichas clínicas",
  settings: "Configuración",
};

function formatSegmentLabel(segment: string): string {
  return (
    segmentLabels[segment] ??
    segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

export function PrivateTopbar() {
  const pathname = usePathname();

  const breadcrumbItems = useMemo<BreadcrumbEntry[]>(() => {
    const segments = pathname.split("/").filter(Boolean);

    return segments.map((segment, index) => ({
      label: formatSegmentLabel(segment),
      href: `/${segments.slice(0, index + 1).join("/")}`,
    }));
  }, [pathname]);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200/70 bg-white/80 backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />

        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard">PETNOVA ADMIN</BreadcrumbLink>
            </BreadcrumbItem>

            {breadcrumbItems.length > 0 && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}

            {breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1;

              return (
                <div key={item.href} className="flex items-center gap-2">
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>

                  {!isLast && <BreadcrumbSeparator />}
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}