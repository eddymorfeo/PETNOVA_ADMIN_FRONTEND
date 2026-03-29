export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type UserItem = {
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

export type UserFormValues = {
  username: string;
  email: string;
  fullName: string;
  phone: string;
  password: string;
  isActive: boolean;
};

export type CreateUserPayload = {
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  password: string;
};

export type UpdateUserPayload = Partial<{
  username: string;
  email: string;
  fullName: string;
  phone: string;
  password: string;
  isActive: boolean;
}>;

export type UserResponse = ApiResponse<UserItem>;
export type UserListResponse = ApiResponse<UserItem[]>;