import type { AdminRoleCode } from "@/types/auth/admin-session";
import {
  adminAccessConfig,
  type MenuAction,
  type SidebarMenuConfigItem,
} from "@/lib/auth/admin-access";

export interface SidebarNavItem {
  key: string;
  title: string;
  path?: string;
  icon?: string;
  isActive?: boolean;
  items?: SidebarNavItem[];
}

function normalizePath(path: string): string {
  if (!path) return "/";
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }
  return path;
}

function matchesPath(currentPathname: string, itemPath?: string): boolean {
  if (!itemPath) return false;

  const normalizedCurrentPath = normalizePath(currentPathname);
  const normalizedItemPath = normalizePath(itemPath);

  if (normalizedItemPath === "/") {
    return normalizedCurrentPath === "/";
  }

  return (
    normalizedCurrentPath === normalizedItemPath ||
    normalizedCurrentPath.startsWith(`${normalizedItemPath}/`)
  );
}

function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

export function getMenusByRole(
  roleCode: AdminRoleCode | null
): SidebarMenuConfigItem[] {
  if (!roleCode) return [];

  return (
    adminAccessConfig.find((config) => config.role === roleCode)?.menus ?? []
  );
}

export function buildSidebarItems(
  roleCode: AdminRoleCode | null,
  pathname: string
): SidebarNavItem[] {
  const menus = getMenusByRole(roleCode);

  const sidebarItems: Array<SidebarNavItem | null> = menus
    .filter((menu) => menu.permissions.view)
    .map((menu): SidebarNavItem | null => {
      if (menu.children?.length) {
        const visibleChildren: SidebarNavItem[] = menu.children
          .filter((child) => child.permissions.view)
          .map((child): SidebarNavItem => ({
            key: child.key,
            title: child.title,
            path: child.path,
            isActive: matchesPath(pathname, child.path),
          }));

        if (visibleChildren.length === 0) {
          return null;
        }

        return {
          key: menu.key,
          title: menu.title,
          icon: menu.icon,
          isActive: visibleChildren.some((child) => child.isActive),
          items: visibleChildren,
        };
      }

      return {
        key: menu.key,
        title: menu.title,
        path: menu.path,
        icon: menu.icon,
        isActive: matchesPath(pathname, menu.path),
      };
    });

  return sidebarItems.filter(isNotNull);
}

export function canAccessPath(
  roleCode: AdminRoleCode | null,
  pathname: string
): boolean {
  const menus = getMenusByRole(roleCode);
  const normalizedPathname = normalizePath(pathname);

  for (const menu of menus) {
    if (
      menu.permissions.view &&
      menu.path &&
      matchesPath(normalizedPathname, menu.path)
    ) {
      return true;
    }

    if (menu.children?.length) {
      for (const child of menu.children) {
        if (
          child.permissions.view &&
          child.path &&
          matchesPath(normalizedPathname, child.path)
        ) {
          return true;
        }
      }
    }
  }

  return false;
}

export function hasMenuActionPermission(
  roleCode: AdminRoleCode | null,
  itemKey: string,
  action: MenuAction
): boolean {
  const menus = getMenusByRole(roleCode);

  for (const menu of menus) {
    if (menu.key === itemKey) {
      return Boolean(menu.permissions[action]);
    }

    if (menu.children?.length) {
      for (const child of menu.children) {
        if (child.key === itemKey) {
          return Boolean(child.permissions[action]);
        }
      }
    }
  }

  return false;
}

export function canView(
  roleCode: AdminRoleCode | null,
  itemKey: string
): boolean {
  return hasMenuActionPermission(roleCode, itemKey, "view");
}

export function canCreate(
  roleCode: AdminRoleCode | null,
  itemKey: string
): boolean {
  return hasMenuActionPermission(roleCode, itemKey, "create");
}

export function canUpdate(
  roleCode: AdminRoleCode | null,
  itemKey: string
): boolean {
  return hasMenuActionPermission(roleCode, itemKey, "update");
}

export function canDelete(
  roleCode: AdminRoleCode | null,
  itemKey: string
): boolean {
  return hasMenuActionPermission(roleCode, itemKey, "delete");
}