export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type AccountRole = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
};

export type AccountPermission = {
  id: string;
  code: string;
  name: string;
  module: string;
  description?: string | null;
};

export type AccountModule = {
  code: string;
  permissions: string[];
};

export type AccountUser = {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone?: string | null;
  isActive?: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type AuthenticatedAccountSession = {
  user: AccountUser;
  roles: AccountRole[];
  permissions: AccountPermission[];
  modules: AccountModule[];
};

export type AccountFormValues = {
  username: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export type UpdateAccountPayload = {
  email?: string;
  fullName?: string;
  phone?: string;
  password?: string;
};

export type AuthenticatedUserResponse = ApiResponse<AuthenticatedAccountSession>;
export type UpdateAccountResponse = ApiResponse<AccountUser>;