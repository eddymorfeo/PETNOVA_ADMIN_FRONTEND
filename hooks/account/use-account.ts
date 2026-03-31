"use client";

import { useCallback, useEffect, useState } from "react";

import {
  fetchAuthenticatedAccount,
  updateAuthenticatedAccount,
} from "@/api/account/account.api";
import {
  ADMIN_SESSION_STORAGE_KEY,
  getAdminSessionFromStorage,
} from "@/lib/auth/admin-session";
import type {
  AccountUser,
  AuthenticatedAccountSession,
  UpdateAccountPayload,
} from "@/types/account/account.type";

export function useAccount() {
  const [account, setAccount] = useState<AccountUser | null>(null);
  const [roles, setRoles] = useState<AuthenticatedAccountSession["roles"]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  const loadAccount = useCallback(async () => {
    setIsLoading(true);

    try {
      const session = await fetchAuthenticatedAccount();

      setAccount(session.user);
      setRoles(session.roles ?? []);

      syncAccountToStorage(session.user, session.roles ?? []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAccount();
  }, [loadAccount]);

  const handleUpdateAccount = useCallback(
    async (payload: UpdateAccountPayload) => {
      if (!account) {
        return;
      }

      setIsMutating(true);

      try {
        const updatedAccount = await updateAuthenticatedAccount(account.id, payload);

        const mergedAccount: AccountUser = {
          ...account,
          ...updatedAccount,
        };

        setAccount(mergedAccount);
        syncAccountToStorage(mergedAccount, roles);
      } finally {
        setIsMutating(false);
      }
    },
    [account, roles],
  );

  return {
    account,
    roles,
    isLoading,
    isMutating,
    handleUpdateAccount,
  };
}

function syncAccountToStorage(
  account: AccountUser,
  roles: AuthenticatedAccountSession["roles"],
): void {
  if (typeof window === "undefined") {
    return;
  }

  const storedSession = getAdminSessionFromStorage();

  if (!storedSession) {
    return;
  }

  const nextSession = {
    ...storedSession,
    user: {
      ...storedSession.user,
      id: account.id,
      username: account.username,
      email: account.email,
      fullName: account.fullName,
      phone: account.phone ?? null,
      isActive: account.isActive,
      createdBy: account.createdBy ?? null,
      updatedBy: account.updatedBy ?? null,
      createdAt: account.createdAt ?? null,
      updatedAt: account.updatedAt ?? null,
    },
    roles,
  };

  window.localStorage.setItem(
    ADMIN_SESSION_STORAGE_KEY,
    JSON.stringify(nextSession),
  );
}