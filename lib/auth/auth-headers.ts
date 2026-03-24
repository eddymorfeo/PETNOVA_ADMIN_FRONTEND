import { getAccessToken } from "@/lib/auth/auth-storage";

export function getAuthHeaders(init?: HeadersInit): HeadersInit {
  const token = getAccessToken();

  return {
    "Content-Type": "application/json",
    ...(init ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}