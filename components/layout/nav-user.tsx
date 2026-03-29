"use client";

import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { clearAdminSessionFromStorage } from "@/lib/auth/admin-session";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const router = useRouter();
  const { isMobile } = useSidebar();

  const handleLogout = (): void => {
    clearAdminSessionFromStorage();
    router.replace("/auth/login");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <SidebarMenuButton
            render={<DropdownMenuTrigger />}
            size="lg"
            className="h-14 w-full rounded-2xl border border-slate-200/80 bg-white/90 px-2 shadow-sm transition-all hover:bg-white hover:shadow-md data-[popup-open]:border-blue-200 data-[popup-open]:bg-blue-50/70 data-[popup-open]:text-slate-900"
          >
            <Avatar className="h-9 w-9 rounded-xl ring-1 ring-slate-200">
              <AvatarImage src={user.avatar || ""} alt={user.name} />
              <AvatarFallback className="rounded-xl bg-slate-100 text-slate-700">
                {user.name?.slice(0, 2).toUpperCase() || "US"}
              </AvatarFallback>
            </Avatar>

            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate text-sm font-semibold text-slate-900">
                {user.name}
              </span>
              <span className="truncate text-xs text-slate-500">
                {user.email}
              </span>
            </div>

            <ChevronsUpDown className="ml-auto size-4 text-slate-400" />
          </SidebarMenuButton>

          <DropdownMenuContent
            className="min-w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <div className="rounded-xl bg-slate-50 p-2">
              <div className="flex items-center gap-3 px-1 py-1.5 text-left">
                <Avatar className="h-10 w-10 rounded-xl ring-1 ring-slate-200">
                  <AvatarImage src={user.avatar || ""} alt={user.name} />
                  <AvatarFallback className="rounded-xl bg-slate-100 text-slate-700">
                    {user.name?.slice(0, 2).toUpperCase() || "US"}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate text-sm font-semibold text-slate-900">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-slate-500">
                    {user.email}
                  </span>
                </div>
              </div>
            </div>

            <DropdownMenuSeparator className="my-2 bg-slate-200" />

            <DropdownMenuGroup>
              <DropdownMenuItem className="rounded-xl text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950">
                <Sparkles className="size-4 text-slate-500" />
                <span>Mi perfil</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="rounded-xl text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950">
                <BadgeCheck className="size-4 text-slate-500" />
                <span>Mi cuenta</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="rounded-xl text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950">
                <CreditCard className="size-4 text-slate-500" />
                <span>Suscripción</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="rounded-xl text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950">
                <Bell className="size-4 text-slate-500" />
                <span>Notificaciones</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-2 bg-slate-200" />

            <DropdownMenuItem
              onClick={handleLogout}
              className="rounded-xl text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700"
            >
              <LogOut className="size-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}