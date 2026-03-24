import { apiClient } from "@/lib/http/api-client";
import type {
  ApiSuccessResponse,
  AuthSession,
  LoginRequest,
  LoginResponse,
} from "@/types/auth/auth.types";

export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient<ApiSuccessResponse<LoginResponse>>(
    "/auth/users/login",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  return response.data;
}

export async function fetchAuthenticatedSession(): Promise<AuthSession> {
  const response = await apiClient<ApiSuccessResponse<AuthSession>>(
    "/auth/users/session",
    {
      method: "GET",
      auth: true,
    }
  );

  return response.data;
}