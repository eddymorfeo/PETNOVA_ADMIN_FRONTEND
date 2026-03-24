export const routePermissions: Record<string, string[] | undefined> = {
  "/dashboard": undefined,
  "/users": ["USERS_VIEW"],
  "/clients": ["CLIENTS_VIEW"],
  "/pets": ["PETS_VIEW"],
  "/appointments": ["APPOINTMENTS_VIEW"],
  "/medical-records": ["CONSULTATIONS_VIEW"],
};

export function getRequiredPermissions(pathname: string) {
  return routePermissions[pathname];
}