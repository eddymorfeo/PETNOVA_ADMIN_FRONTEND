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

const accountMenuItem: SidebarMenuConfigItem = {
  key: "account",
  title: "Mi cuenta",
  path: "/account",
  icon: "BadgeCheck",
  permissions: {
    view: true,
    update: true,
  },
};

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
        key: "medical-records",
        title: "Fichas clínicas",
        icon: "FileText",
        permissions: { view: true },
        children: [
          {
            key: "manage-medical-records",
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
            key: "settings-user-roles",
            title: "Asignar roles",
            path: "/settings/user-role",
            permissions: { view: true, create: true, update: true, delete: true },
          },
          {
            key: "settings-veterinarians",
            title: "Asignar veterinarios",
            path: "/settings/veterinarians",
            permissions: { view: true, create: true, update: true, delete: true },
          },
          {
            key: "settings-working-hours",
            title: "Asignar horarios",
            path: "/settings/working-hours",
            permissions: { view: true, create: true, update: true, delete: true },
          },
          {
            key: "settings-time-off",
            title: "Asignar días libres",
            path: "/settings/time-off",
            permissions: { view: true, create: true, update: true, delete: true },
          },
        ],
      },
      accountMenuItem,
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
      accountMenuItem,
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
        key: "medical-records",
        title: "Fichas clínicas",
        icon: "FileText",
        permissions: { view: true },
        children: [
          {
            key: "manage-medical-records",
            title: "Gestionar fichas clínicas",
            path: "/medical-records",
            permissions: { view: true },
          },
        ],
      },
      accountMenuItem,
    ],
  },
  {
    role: "ANALYST",
    menus: [
      {
        key: "dashboard",
        title: "Dashboard",
        path: "/dashboard",
        icon: "LayoutDashboard",
        permissions: { view: true },
      },
      accountMenuItem,
    ],
  },
];