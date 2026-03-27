export type AdminRoleCode =
  | "ADMIN"
  | "RECEPCION"
  | "VETERINARIO"
  | "ANALYST";

export interface AdminSessionUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone?: string | null;
  isActive?: boolean;
}

export interface AdminSessionRole {
  id: string;
  code: AdminRoleCode | string;
  name: string;
  description?: string;
}

export interface AdminSessionPermission {
  id?: string;
  code: string;
  name?: string;
  module?: string;
  description?: string;
}

export interface AdminSession {
  user: AdminSessionUser;
  roles: AdminSessionRole[];
  permissions?: AdminSessionPermission[];
  modules?: string[];
}