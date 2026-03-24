"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { fetchAuthenticatedSession, loginUser } from "@/api/auth/auth.api";
import {
  clearAuthStorage,
  getAccessToken,
  getAuthSession,
  saveAccessToken,
  saveAuthSession,
} from "@/lib/auth/auth-storage";
import type { AuthSession, LoginRequest } from "@/types/auth/auth.types";

type AuthContextValue = {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (payload: LoginRequest) => Promise<void>;
  signOut: () => void;
  refreshSession: () => Promise<void>;
  hasPermission: (permissionCode: string) => boolean;
  hasAnyPermission: (permissionCodes: string[]) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    const token = getAccessToken();

    if (!token) {
      setSession(null);
      setIsLoading(false);
      return;
    }

    const cachedSession = getAuthSession();
    if (cachedSession) {
      setSession(cachedSession);
    }

    try {
      const authenticatedSession = await fetchAuthenticatedSession();
      saveAuthSession(authenticatedSession);
      setSession(authenticatedSession);
    } catch {
      clearAuthStorage();
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const signIn = useCallback(
    async (payload: LoginRequest) => {
      const response = await loginUser(payload);

      saveAccessToken(response.accessToken);

      const authenticatedSession: AuthSession = {
        user: response.user,
        roles: response.roles,
        permissions: response.permissions,
        modules: response.modules,
      };

      saveAuthSession(authenticatedSession);
      setSession(authenticatedSession);

      router.replace("/dashboard");
    },
    [router]
  );

  const signOut = useCallback(() => {
    clearAuthStorage();
    setSession(null);
    router.replace("/auth/login");
  }, [router]);

  const hasPermission = useCallback(
    (permissionCode: string) => {
      if (!session) return false;

      return session.permissions.some(
        (permission) => permission.code === permissionCode
      );
    },
    [session]
  );

  const hasAnyPermission = useCallback(
    (permissionCodes: string[]) => {
      if (!session) return false;

      return permissionCodes.some((permissionCode) =>
        session.permissions.some((permission) => permission.code === permissionCode)
      );
    },
    [session]
  );

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      isLoading,
      signIn,
      signOut,
      refreshSession,
      hasPermission,
      hasAnyPermission,
    }),
    [session, isLoading, signIn, signOut, refreshSession, hasPermission, hasAnyPermission]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext debe usarse dentro de AuthProvider.");
  }

  return context;
}