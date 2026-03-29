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

export function NavMain({
  items,
}: {
  items: {
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
  }[];
}) {
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
                      ? "h-11 rounded-xl border border-blue-200/80 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200/60 transition-all hover:from-blue-600 hover:to-indigo-600 hover:text-white"
                      : "h-11 rounded-xl text-slate-700 transition-all hover:bg-white hover:text-slate-950 hover:shadow-sm"
                  }
                  render={
                    <Link
                      href={item.path ?? "/dashboard"}
                      className="flex items-center gap-3"
                    >
                      {item.icon && (
                        <item.icon className={item.isActive ? "size-4" : "size-4 text-slate-500"} />
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
                        ? "h-11 rounded-xl border border-blue-200/80 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200/60 transition-all hover:from-blue-600 hover:to-indigo-600 hover:text-white"
                        : "h-11 rounded-xl text-slate-700 transition-all hover:bg-white hover:text-slate-950 hover:shadow-sm"
                    }
                  >
                    {item.icon && (
                      <item.icon className={item.isActive ? "size-4" : "size-4 text-slate-500"} />
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
                              ? "h-9 rounded-lg bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100 transition-all hover:bg-blue-50 hover:text-blue-700"
                              : "h-9 rounded-lg text-slate-600 transition-all hover:bg-white hover:text-slate-950"
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