import type {
  CreateTimeOffPayload,
  TimeOffFormValues,
  TimeOffItem,
  UpdateTimeOffPayload,
} from "@/types/time-off/time-off.type";

export function formatTimeOffDate(date: string | null) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function normalizeDateValue(value: string | null | undefined): string {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export function normalizeTimeValue(value: string | null | undefined): string {
  if (!value) return "";
  return new Date(value).toISOString().slice(11, 16);
}

export function buildDateTimeString(date: string, time: string): string {
  return new Date(`${date}T${time}:00`).toISOString();
}

export function mapTimeOffToFormValues(item: TimeOffItem): TimeOffFormValues {
  return {
    veterinarianId: item.veterinarian_id,
    startDate: normalizeDateValue(item.starts_at),
    startTime: normalizeTimeValue(item.starts_at),
    endDate: normalizeDateValue(item.ends_at),
    endTime: normalizeTimeValue(item.ends_at),
    reason: item.reason ?? "",
  };
}

export function mapCreateTimeOffFormToPayload(
  values: TimeOffFormValues,
): CreateTimeOffPayload {
  return {
    veterinarianId: values.veterinarianId,
    startsAt: buildDateTimeString(values.startDate, values.startTime),
    endsAt: buildDateTimeString(values.endDate, values.endTime),
    reason: values.reason.trim() || undefined,
  };
}

export function mapUpdateTimeOffFormToPayload(
  values: TimeOffFormValues,
): UpdateTimeOffPayload {
  return {
    veterinarianId: values.veterinarianId,
    startsAt: buildDateTimeString(values.startDate, values.startTime),
    endsAt: buildDateTimeString(values.endDate, values.endTime),
    reason: values.reason.trim() || undefined,
  };
}

export function buildTimeOffStats(items: TimeOffItem[]) {
  const uniqueVeterinarians = new Set(items.map((item) => item.veterinarian_id));

  return {
    totalBlocks: items.length,
    totalVeterinariansWithBlocks: uniqueVeterinarians.size,
  };
}