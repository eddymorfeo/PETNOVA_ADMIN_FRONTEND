"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createUserRoleAssignment,
  deleteUserRoleAssignment,
  fetchAssignableRoles,
  fetchAssignableUsers,
  fetchUserRoles,
} from "@/api/user-role/user-roles.api";
import type {
  CreateUserRolePayload,
  UserRoleItem,
  UserRoleOption,
  UserRoleUserOption,
} from "@/types/user-role/user-role-type";
import { buildUserRoleStats } from "@/utils/user-role/user-role-mappers";

export function useUserRole() {
  const [userRoles, setUserRoles] = useState<UserRoleItem[]>([]);
  const [users, setUsers] = useState<UserRoleUserOption[]>([]);
  const [roles, setRoles] = useState<UserRoleOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  const loadUserRoleData = useCallback(async () => {
    setIsLoading(true);

    try {
      const [userRolesResponse, usersResponse, rolesResponse] =
        await Promise.all([
          fetchUserRoles(),
          fetchAssignableUsers(),
          fetchAssignableRoles(),
        ]);

      setUserRoles(userRolesResponse);
      setUsers(usersResponse.filter((item) => item.is_active));
      setRoles(rolesResponse.filter((item) => item.is_active));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUserRoleData();
  }, [loadUserRoleData]);

  const handleCreateUserRole = useCallback(
    async (payload: CreateUserRolePayload) => {
      setIsMutating(true);

      try {
        await createUserRoleAssignment(payload);
        await loadUserRoleData();
      } finally {
        setIsMutating(false);
      }
    },
    [loadUserRoleData],
  );

  const handleDeleteUserRole = useCallback(
    async (userRole: UserRoleItem) => {
      setIsMutating(true);

      try {
        await deleteUserRoleAssignment({
          userId: userRole.user_id,
          roleId: userRole.role_id,
        });

        await loadUserRoleData();
      } finally {
        setIsMutating(false);
      }
    },
    [loadUserRoleData],
  );

  const stats = useMemo(() => buildUserRoleStats(userRoles), [userRoles]);

  return {
    userRoles,
    users,
    roles,
    isLoading,
    isMutating,
    totalAssignments: stats.totalAssignments,
    totalUsersWithRoles: stats.totalUsersWithRoles,
    handleCreateUserRole,
    handleDeleteUserRole,
  };
}