export type RoleItem = {
  id: string;
  code: string;
  name: string;
  description: string | null;
};

export type PermissionItem = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  module: string;
  is_active?: boolean;
};

export type AccessibleModule = {
  code: string;
  permissions: string[];
};

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string | null;
  isActive: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type AuthSession = {
  user: AuthUser;
  roles: RoleItem[];
  permissions: PermissionItem[];
  modules: AccessibleModule[];
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
  roles: RoleItem[];
  permissions: PermissionItem[];
  modules: AccessibleModule[];
};

export type ApiSuccessResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};