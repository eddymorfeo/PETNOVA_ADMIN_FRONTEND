import { Badge } from "@/components/ui/badge";
import { formatAppointmentStatus } from "@/utils/appointments/appointment-mappers";

type AppointmentsStatusBadgeProps = {
  status: string;
};

export function AppointmentsStatusBadge({
  status,
}: AppointmentsStatusBadgeProps) {
  const statusClassMap: Record<string, string> = {
    SCHEDULED: "border-blue-200 bg-blue-50 text-blue-700",
    CONFIRMED: "border-cyan-200 bg-cyan-50 text-cyan-700",
    CHECKED_IN: "border-amber-200 bg-amber-50 text-amber-700",
    IN_PROGRESS: "border-violet-200 bg-violet-50 text-violet-700",
    COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    CANCELLED: "border-rose-200 bg-rose-50 text-rose-700",
    NO_SHOW: "border-slate-200 bg-slate-100 text-slate-700",
  };

  return (
    <Badge
      variant="outline"
      className={statusClassMap[status] ?? "border-slate-200 bg-slate-100 text-slate-700"}
    >
      {formatAppointmentStatus(status)}
    </Badge>
  );
}