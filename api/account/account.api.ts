import { apiClient } from "@/lib/http/api-client";
import type {
  AccountUser,
  AuthenticatedAccountSession,
  AuthenticatedUserResponse,
  UpdateAccountPayload,
  UpdateAccountResponse,
} from "@/types/account/account.type";

export async function fetchAuthenticatedAccount(): Promise<AuthenticatedAccountSession> {
  const response = await apiClient<AuthenticatedUserResponse>("/auth/users/me", {
    method: "GET",
    auth: true,
  });

  return response.data;
}

export async function updateAuthenticatedAccount(
  userId: string,
  payload: UpdateAccountPayload,
): Promise<AccountUser> {
  const response = await apiClient<UpdateAccountResponse>(`/users/${userId}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(payload),
  });

  return response.data;
}