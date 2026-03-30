import { apiClient } from "@/lib/http/api-client";
import type {
  AppointmentItem,
  AppointmentListResponse,
  AppointmentResponse,
  AppointmentTypeOption,
  AppointmentTypeListResponse,
  AvailableTimeOption,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
  VeterinarianOption,
  VeterinarianListResponse,
} from "@/types/appointments/appointment-type";

export async function fetchAppointments(): Promise<AppointmentItem[]> {
  const response = await apiClient<AppointmentListResponse>("/appointments", {
    method: "GET",
    auth: true,
  });

  return response.data;
}

export async function createAppointment(
  payload: CreateAppointmentPayload,
): Promise<AppointmentItem> {
  const response = await apiClient<AppointmentResponse>("/appointments", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateAppointment(
  appointmentId: string,
  payload: UpdateAppointmentPayload,
): Promise<AppointmentItem> {
  const response = await apiClient<AppointmentResponse>(
    `/appointments/${appointmentId}`,
    {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    },
  );

  return response.data;
}

export async function cancelAppointment(
  appointmentId: string,
  cancelReason?: string,
): Promise<AppointmentItem> {
  const response = await apiClient<AppointmentResponse>(
    `/appointments/${appointmentId}`,
    {
      method: "DELETE",
      auth: true,
      body: JSON.stringify({
        cancelReason: cancelReason?.trim() || undefined,
      }),
    },
  );

  return response.data;
}

export async function fetchVeterinarians(): Promise<VeterinarianOption[]> {
  const response = await apiClient<VeterinarianListResponse>("/veterinarians", {
    method: "GET",
    auth: true,
  });

  return response.data;
}

export async function fetchAppointmentTypes(): Promise<AppointmentTypeOption[]> {
  const response = await apiClient<AppointmentTypeListResponse>(
    "/appointment-types",
    {
      method: "GET",
      auth: true,
    },
  );

  return response.data;
}

export async function fetchAvailableAppointmentTimes(params: {
  veterinarianId: string;
  appointmentDate: string;
}): Promise<AvailableTimeOption[]> {
  const query = new URLSearchParams({
    veterinarianId: params.veterinarianId,
    appointmentDate: params.appointmentDate,
  });

  const response = await apiClient<{ success: boolean; message: string; data: AvailableTimeOption[] }>(
    `/public/guest-appointments/available-times?${query.toString()}`,
    {
      method: "GET",
      auth: false,
    },
  );

  return response.data;
}