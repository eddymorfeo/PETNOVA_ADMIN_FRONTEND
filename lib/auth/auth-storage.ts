import type { AuthSession } from "@/types/auth/auth.types";

const ACCESS_TOKEN_KEY = "pn_admin_access_token";
const SESSION_KEY = "pn_admin_session";
const COOKIE_KEY = "pn_admin_access_token";

function isBrowser() {
  return typeof window !== "undefined";
}

export function saveAccessToken(token: string) {
  if (!isBrowser()) return;

  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  document.cookie = `${COOKIE_KEY}=${token}; path=/; samesite=lax`;
}

export function getAccessToken() {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function clearAccessToken() {
  if (!isBrowser()) return;

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  document.cookie = `${COOKIE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export function saveAuthSession(session: AuthSession) {
  if (!isBrowser()) return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getAuthSession(): AuthSession | null {
  if (!isBrowser()) return null;

  const rawSession = localStorage.getItem(SESSION_KEY);
  if (!rawSession) return null;

  try {
    return JSON.parse(rawSession) as AuthSession;
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  if (!isBrowser()) return;
  localStorage.removeItem(SESSION_KEY);
}

export function clearAuthStorage() {
  clearAccessToken();
  clearAuthSession();
}