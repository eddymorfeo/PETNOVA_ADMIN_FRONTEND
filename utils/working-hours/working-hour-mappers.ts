import type {
  CreateWorkingHourPayload,
  UpsertWorkingHoursPayload,
  WorkingHourFormValues,
  WorkingHourItem,
} from "@/types/working-hours/working-hour.type";

export const WEEKDAY_OPTIONS = [
  { value: "1", label: "Lunes" },
  { value: "2", label: "Martes" },
  { value: "3", label: "Miércoles" },
  { value: "4", label: "Jueves" },
  { value: "5", label: "Viernes" },
  { value: "6", label: "Sábado" },
  { value: "0", label: "Domingo" },
];

export const HOUR_OPTIONS = [
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
  "24:00",
];

export function getWeekdayLabel(weekday: number): string {
  const match = WEEKDAY_OPTIONS.find((item) => Number(item.value) === weekday);
  return match?.label ?? `Día ${weekday}`;
}

export function formatWorkingHourDate(date: string | null) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function normalizeTimeValue(value: string | null | undefined): string {
  if (!value) return "";
  return value.slice(0, 5);
}

export function mapWorkingHourToFormValues(
  item: WorkingHourItem,
): WorkingHourFormValues {
  return {
    veterinarianId: item.veterinarian_id,
    weekdays: [String(item.weekday)],
    startTime: normalizeTimeValue(item.start_time),
    endTime: normalizeTimeValue(item.end_time),
    slotMinutes: String(item.slot_minutes),
    isActive: item.is_active,
  };
}

export function mapWorkingHourFormToUpsertPayload(
  values: WorkingHourFormValues,
): UpsertWorkingHoursPayload {
  return {
    veterinarianId: values.veterinarianId,
    weekdays: values.weekdays.map((weekday) => Number(weekday)),
    startTime: values.startTime,
    endTime: values.endTime,
    slotMinutes: Number(values.slotMinutes),
    isActive: values.isActive,
  };
}

export function buildCreateWorkingHourPayloads(
  payload: UpsertWorkingHoursPayload,
): CreateWorkingHourPayload[] {
  return payload.weekdays.map((weekday) => ({
    veterinarianId: payload.veterinarianId,
    weekday,
    startTime: payload.startTime,
    endTime: payload.endTime,
    slotMinutes: payload.slotMinutes,
  }));
}

export function buildWorkingHourStats(items: WorkingHourItem[]) {
  return {
    totalSchedules: items.length,
    activeSchedules: items.filter((item) => item.is_active).length,
  };
}