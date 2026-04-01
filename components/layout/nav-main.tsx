"use client";

import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

type NavMainItem = {
  key: string;
  title: string;
  path?: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    key: string;
    title: string;
    path?: string;
    isActive?: boolean;
  }[];
};

const activeItemClassName =
  "h-11 rounded-xl border border-sky-100 bg-gradient-to-r from-sky-50 via-blue-50 to-cyan-50 text-sky-700 shadow-[0_8px_20px_-16px_rgba(59,130,246,0.35)] transition-all duration-200 hover:from-sky-50 hover:via-blue-50 hover:to-cyan-50 hover:text-sky-700";

const inactiveItemClassName =
  "h-11 rounded-xl text-slate-700 transition-all duration-200 hover:bg-white hover:text-slate-950 hover:shadow-sm";

const activeSubItemClassName =
  "h-9 rounded-lg bg-sky-50 text-sky-700 shadow-sm ring-1 ring-sky-100 transition-all duration-200 hover:bg-sky-50 hover:text-sky-700";

const inactiveSubItemClassName =
  "h-9 rounded-lg text-slate-600 transition-all duration-200 hover:bg-white hover:text-slate-950";

export function NavMain({ items }: { items: NavMainItem[] }) {
  return (
    <SidebarGroup className="pt-1">
      <SidebarGroupLabel className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        Principal
      </SidebarGroupLabel>

      <SidebarMenu className="gap-1">
        {items.map((item) => {
          const hasChildren = Boolean(item.items?.length);

          if (!hasChildren) {
            return (
              <SidebarMenuItem key={item.key}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={item.isActive}
                  className={
                    item.isActive
                      ? activeItemClassName
                      : inactiveItemClassName
                  }
                  render={
                    <Link
                      href={item.path ?? "/dashboard"}
                      className="flex items-center gap-3"
                    >
                      {item.icon && (
                        <item.icon
                          className={
                            item.isActive
                              ? "size-4 text-sky-700"
                              : "size-4 text-slate-500"
                          }
                        />
                      )}
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.key}
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={item.isActive}
                    className={
                      item.isActive
                        ? activeItemClassName
                        : inactiveItemClassName
                    }
                  >
                    {item.icon && (
                      <item.icon
                        className={
                          item.isActive
                            ? "size-4 text-sky-700"
                            : "size-4 text-slate-500"
                        }
                      />
                    )}
                    <span className="text-sm font-medium">{item.title}</span>
                    <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent className="pt-1">
                  <SidebarMenuSub className="ml-5 border-l border-slate-200 pl-3">
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.key}>
                        <SidebarMenuSubButton
                          isActive={subItem.isActive}
                          className={
                            subItem.isActive
                              ? activeSubItemClassName
                              : inactiveSubItemClassName
                          }
                          render={
                            <Link
                              href={subItem.path ?? "/dashboard"}
                              className="flex items-center gap-2"
                            >
                              <span className="text-sm font-medium">
                                {subItem.title}
                              </span>
                            </Link>
                          }
                        />
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}