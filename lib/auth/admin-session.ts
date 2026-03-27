"use client";

import type { AdminRoleCode, AdminSession } from "@/types/auth/admin-session";

export const ADMIN_SESSION_STORAGE_KEY = "pn_admin_session";
export const ADMIN_ACCESS_TOKEN_STORAGE_KEY = "pn_admin_access_token";

export function getAdminSessionFromStorage(): AdminSession | null {
  if (typeof window === "undefined") return null;

  const rawSession = window.localStorage.getItem(ADMIN_SESSION_STORAGE_KEY);

  if (!rawSession) return null;

  try {
    return JSON.parse(rawSession) as AdminSession;
  } catch (error) {
    console.error("No fue posible parsear la sesión del admin.", error);
    return null;
  }
}

export function clearAdminSessionFromStorage(): void {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
  window.localStorage.removeItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY);
}

export function getPrimaryRoleCode(
  session: AdminSession | null
): AdminRoleCode | null {
  if (!session?.roles?.length) return null;

  const priorityOrder: AdminRoleCode[] = [
    "ADMIN",
    "RECEPCION",
    "VETERINARIO",
    "ANALYST",
  ];

  const sessionRoleCodes = session.roles.map((role) => role.code);

  const prioritizedRole = priorityOrder.find((roleCode) =>
    sessionRoleCodes.includes(roleCode)
  );

  return prioritizedRole ?? (session.roles[0].code as AdminRoleCode);
}