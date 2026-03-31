export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type UserRoleItem = {
  user_id: string;
  role_id: string;
  created_by: string | null;
  updated_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  username: string;
  email: string;
  full_name: string;
  role_code: string;
  role_name: string;
  role_description: string | null;
};

export type UserRoleUserOption = {
  id: string;
  username: string;
  email: string;
  full_name: string;
  phone: string | null;
  is_active: boolean;
  created_by: string | null;
  updated_by: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type UserRoleOption = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_by: string | null;
  updated_by: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type UserRoleFormValues = {
  userId: string;
  roleId: string;
};

export type CreateUserRolePayload = {
  userId: string;
  roleId: string;
};

export type DeleteUserRolePayload = {
  userId: string;
  roleId: string;
};

export type UserRoleListResponse = ApiResponse<UserRoleItem[]>;
export type UserRoleResponse = ApiResponse<UserRoleItem>;
export type UserRoleUsersResponse = ApiResponse<UserRoleUserOption[]>;
export type UserRoleOptionsResponse = ApiResponse<UserRoleOption[]>;