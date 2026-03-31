import { apiClient } from "@/lib/http/api-client";
import type {
  CreateUserRolePayload,
  DeleteUserRolePayload,
  UserRoleItem,
  UserRoleListResponse,
  UserRoleOption,
  UserRoleOptionsResponse,
  UserRoleResponse,
  UserRoleUserOption,
  UserRoleUsersResponse,
} from "@/types/user-role/user-role-type";

export async function fetchUserRoles(): Promise<UserRoleItem[]> {
  const response = await apiClient<UserRoleListResponse>("/user-roles", {
    method: "GET",
    auth: true,
  });

  return response.data;
}

export async function fetchAssignableUsers(): Promise<UserRoleUserOption[]> {
  const response = await apiClient<UserRoleUsersResponse>("/users", {
    method: "GET",
    auth: true,
  });

  return response.data;
}

export async function fetchAssignableRoles(): Promise<UserRoleOption[]> {
  const response = await apiClient<UserRoleOptionsResponse>("/roles", {
    method: "GET",
    auth: true,
  });

  return response.data;
}

export async function createUserRoleAssignment(
  payload: CreateUserRolePayload,
): Promise<UserRoleItem> {
  const response = await apiClient<UserRoleResponse>("/user-roles", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function deleteUserRoleAssignment(
  payload: DeleteUserRolePayload,
): Promise<UserRoleItem> {
  const response = await apiClient<UserRoleResponse>("/user-roles", {
    method: "DELETE",
    auth: true,
    body: JSON.stringify(payload),
  });

  return response.data;
}