import { Badge } from "@/components/ui/badge";

type UserRoleStatusBadgeProps = {
  isActive: boolean;
};

export function UserRoleStatusBadge({
  isActive,
}: UserRoleStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={
        isActive
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-100 text-slate-600"
      }
    >
      {isActive ? "Activo" : "Inactivo"}
    </Badge>
  );
}