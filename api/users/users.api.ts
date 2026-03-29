import { apiClient } from "@/lib/http/api-client";
import type {
  CreateUserPayload,
  UpdateUserPayload,
  UserItem,
  UserListResponse,
  UserResponse,
} from "@/types/users/user.type";

export async function fetchUsers(): Promise<UserItem[]> {
  const response = await apiClient<UserListResponse>("/users", {
    method: "GET",
    auth: true,
  });

  return response.data;
}

export async function createUser(payload: CreateUserPayload): Promise<UserItem> {
  const response = await apiClient<UserResponse>("/users", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateUser(
  userId: string,
  payload: UpdateUserPayload,
): Promise<UserItem> {
  const response = await apiClient<UserResponse>(`/users/${userId}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function deleteUser(userId: string): Promise<UserItem> {
  const response = await apiClient<UserResponse>(`/users/${userId}`, {
    method: "DELETE",
    auth: true,
  });

  return response.data;
}