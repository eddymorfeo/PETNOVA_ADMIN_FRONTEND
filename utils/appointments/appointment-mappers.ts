import type {
  AppointmentFormValues,
  AppointmentItem,
  AppointmentTypeOption,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from "@/types/appointments/appointment-type";

function splitIsoDateTime(value: string | null | undefined): {
  date: string;
  time: string;
} {
  if (!value) {
    return { date: "", time: "" };
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return { date: "", time: "" };
  }

  const year = parsed.getFullYear();
  const month = `${parsed.getMonth() + 1}`.padStart(2, "0");
  const day = `${parsed.getDate()}`.padStart(2, "0");
  const hours = `${parsed.getHours()}`.padStart(2, "0");
  const minutes = `${parsed.getMinutes()}`.padStart(2, "0");

  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`,
  };
}

function buildIsoDateTime(date: string, time: string): string {
  return `${date}T${time}:00`;
}

function resolveDurationMinutes(
  appointmentTypeId: string,
  appointmentTypeOptions: AppointmentTypeOption[],
): number {
  const matchedType = appointmentTypeOptions.find(
    (item) => item.id === appointmentTypeId,
  );

  if (!matchedType?.duration_minutes || matchedType.duration_minutes <= 0) {
    return 30;
  }

  return matchedType.duration_minutes;
}

function buildEndsAt(date: string, time: string, durationMinutes: number): string {
  const startsAt = new Date(`${date}T${time}:00`);
  const endsAt = new Date(startsAt.getTime() + durationMinutes * 60000);

  const year = endsAt.getFullYear();
  const month = `${endsAt.getMonth() + 1}`.padStart(2, "0");
  const day = `${endsAt.getDate()}`.padStart(2, "0");
  const hours = `${endsAt.getHours()}`.padStart(2, "0");
  const minutes = `${endsAt.getMinutes()}`.padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:00`;
}

export function mapAppointmentToFormValues(
  appointment: AppointmentItem,
): AppointmentFormValues {
  const startsAt = splitIsoDateTime(appointment.starts_at);

  return {
    veterinarianId: appointment.veterinarian_id ?? "",
    appointmentTypeId: appointment.appointment_type_id ?? "",
    clientId: appointment.client_id ?? "",
    clientLabel: appointment.client_name ?? "",
    petId: appointment.pet_id ?? "",
    petLabel: appointment.pet_name ?? "",
    appointmentDate: startsAt.date,
    appointmentTime: startsAt.time,
    status: appointment.status ?? "SCHEDULED",
    reason: appointment.reason ?? "",
    bookedSource: appointment.booked_source ?? "",
    cancelReason: appointment.cancel_reason ?? "",
  };
}

export function mapCreateAppointmentFormToPayload(
  values: AppointmentFormValues,
  appointmentTypeOptions: AppointmentTypeOption[],
): CreateAppointmentPayload {
  const durationMinutes = resolveDurationMinutes(
    values.appointmentTypeId,
    appointmentTypeOptions,
  );

  return {
    veterinarianId: values.veterinarianId,
    appointmentTypeId: values.appointmentTypeId || undefined,
    clientId: values.clientId || undefined,
    petId: values.petId || undefined,
    startsAt: buildIsoDateTime(values.appointmentDate, values.appointmentTime),
    endsAt: buildEndsAt(values.appointmentDate, values.appointmentTime, durationMinutes),
    status: values.status || undefined,
    reason: values.reason.trim() || undefined,
    bookedSource: values.bookedSource || undefined,
  };
}

export function mapUpdateAppointmentFormToPayload(
  values: AppointmentFormValues,
  appointmentTypeOptions: AppointmentTypeOption[],
): UpdateAppointmentPayload {
  const payload: UpdateAppointmentPayload = {};

  if (values.veterinarianId) payload.veterinarianId = values.veterinarianId;
  if (values.appointmentTypeId) payload.appointmentTypeId = values.appointmentTypeId;
  if (values.clientId) payload.clientId = values.clientId;
  if (values.petId) payload.petId = values.petId;

  if (values.appointmentDate && values.appointmentTime) {
    const durationMinutes = resolveDurationMinutes(
      values.appointmentTypeId,
      appointmentTypeOptions,
    );

    payload.startsAt = buildIsoDateTime(values.appointmentDate, values.appointmentTime);
    payload.endsAt = buildEndsAt(values.appointmentDate, values.appointmentTime, durationMinutes);
  }

  if (values.status) payload.status = values.status;
  if (values.reason.trim()) payload.reason = values.reason.trim();
  if (values.bookedSource) payload.bookedSource = values.bookedSource;
  if (values.cancelReason.trim()) payload.cancelReason = values.cancelReason.trim();

  return payload;
}

export function formatAppointmentStatus(status: string): string {
  const labels: Record<string, string> = {
    SCHEDULED: "Agendada",
    CONFIRMED: "Confirmada",
    CHECKED_IN: "Recepcionada",
    IN_PROGRESS: "En curso",
    COMPLETED: "Terminada",
    CANCELLED: "Cancelada",
    NO_SHOW: "No asistió",
  };

  return labels[status] ?? status;
}