import type {
  CreateUserRolePayload,
  UserRoleFormValues,
  UserRoleItem,
} from "@/types/user-role/user-role-type";

export function formatUserRoleDate(date: string | null) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function mapCreateUserRoleFormToPayload(
  values: UserRoleFormValues,
): CreateUserRolePayload {
  return {
    userId: values.userId,
    roleId: values.roleId,
  };
}

export function buildUserRoleStats(items: UserRoleItem[]) {
  const uniqueUsers = new Set(items.map((item) => item.user_id));

  return {
    totalAssignments: items.length,
    totalUsersWithRoles: uniqueUsers.size,
  };
}