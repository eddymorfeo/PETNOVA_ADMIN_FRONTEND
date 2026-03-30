import type { AdminRoleCode } from "@/types/auth/admin-session";

export type MenuAction = "view" | "create" | "update" | "delete";

export interface MenuPermissions {
  view?: boolean;
  create?: boolean;
  update?: boolean;
  delete?: boolean;
}

export interface SidebarMenuConfigItem {
  key: string;
  title: string;
  path?: string;
  icon?: string;
  permissions: MenuPermissions;
  children?: SidebarMenuConfigItem[];
}

export interface RoleSidebarConfig {
  role: AdminRoleCode;
  menus: SidebarMenuConfigItem[];
}

export const adminAccessConfig: RoleSidebarConfig[] = [
  {
    role: "ADMIN",
    menus: [
      {
        key: "dashboard",
        title: "Dashboard",
        path: "/dashboard",
        icon: "LayoutDashboard",
        permissions: { view: true },
      },
      {
        key: "users",
        title: "Usuarios",
        icon: "Users",
        permissions: { view: true },
        children: [
          {
            key: "manage-users",
            title: "Gestionar usuarios",
            path: "/users",
            permissions: { view: true },
          },
        ],
      },
      {
        key: "clients",
        title: "Clientes",
        icon: "UserRound",
        permissions: { view: true },
        children: [
          {
            key: "manage-clients",
            title: "Gestionar clientes",
            path: "/clients",
            permissions: { view: true },
          },
        ],
      },
      {
        key: "pets",
        title: "Mascotas",
        icon: "PawPrint",
        permissions: { view: true },
        children: [
          {
            key: "manage-pets",
            title: "Gestionar mascotas",
            path: "/pets",
            permissions: { view: true },
          },
        ],
      },
      {
        key: "appointments",
        title: "Citas",
        icon: "CalendarDays",
        permissions: { view: true },
        children: [
          {
            key: "manage-appointments",
            title: "Gestionar citas",
            path: "/appointments",
            permissions: { view: true },
          },
        ],
      },
      {
        key: "consultations",
        title: "Fichas clínicas",
        icon: "FileText",
        permissions: { view: true },
        children: [
          {
            key: "manage-consultations",
            title: "Gestionar fichas clínicas",
            path: "/medical-records",
            permissions: { view: true },
          },
        ],
      },
      {
        key: "settings",
        title: "Configuración",
        icon: "Settings",
        permissions: { view: true },
        children: [
          {
            key: "settings-general",
            title: "Configuración general",
            path: "/settings",
            permissions: { view: true, update: true },
          },
        ],
      },
    ],
  },
  {
    role: "RECEPCION",
    menus: [
      {
        key: "dashboard",
        title: "Dashboard",
        path: "/dashboard",
        icon: "LayoutDashboard",
        permissions: { view: true },
      },
      {
        key: "clients",
        title: "Clientes",
        icon: "UserRound",
        permissions: { view: true },
        children: [
          {
            key: "manage-clients",
            title: "Gestionar clientes",
            path: "/clients",
            permissions: { view: true },
          },
        ],
      },
      {
        key: "pets",
        title: "Mascotas",
        icon: "PawPrint",
        permissions: { view: true },
        children: [
          {
            key: "manage-pets",
            title: "Gestionar mascotas",
            path: "/pets",
            permissions: { view: true },
          },
        ],
      },
      {
        key: "appointments",
        title: "Citas",
        icon: "CalendarDays",
        permissions: { view: true },
        children: [
          {
            key: "manage-appointments",
            title: "Gestionar citas",
            path: "/appointments",
            permissions: { view: true },
          },
        ],
      },
      {
        key: "consultations",
        title: "Fichas clínicas",
        icon: "FileText",
        permissions: { view: true },
        children: [
          {
            key: "manage-consultations",
            title: "Gestionar fichas clínicas",
            path: "/consultations",
            permissions: { view: true },
          },
        ],
      },
    ],
  },
  {
    role: "VETERINARIO",
    menus: [
      {
        key: "dashboard",
        title: "Dashboard",
        path: "/dashboard",
        icon: "LayoutDashboard",
        permissions: { view: true },
      },
      {
        key: "clients",
        title: "Clientes",
        icon: "UserRound",
        permissions: { view: true },
        children: [
          {
            key: "manage-clients",
            title: "Gestionar clientes",
            path: "/clients",
            permissions: { view: true },
          },
        ],
      },
      {
        key: "pets",
        title: "Mascotas",
        icon: "PawPrint",
        permissions: { view: true },
        children: [
          {
            key: "manage-pets",
            title: "Gestionar mascotas",
            path: "/pets",
            permissions: { view: true },
          },
        ],
      },
      {
        key: "appointments",
        title: "Citas",
        icon: "CalendarDays",
        permissions: { view: true },
        children: [
          {
            key: "manage-appointments",
            title: "Gestionar citas",
            path: "/appointments",
            permissions: { view: true },
          },
        ],
      },
      {
        key: "consultations",
        title: "Fichas clínicas",
        icon: "FileText",
        permissions: { view: true },
        children: [
          {
            key: "manage-consultations",
            title: "Gestionar fichas clínicas",
            path: "/consultations",
            permissions: { view: true },
          },
        ],
      },
    ],
  },
];