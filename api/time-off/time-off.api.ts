import { apiClient } from "@/lib/http/api-client";
import type {
  CreateTimeOffPayload,
  TimeOffItem,
  TimeOffListResponse,
  TimeOffResponse,
  UpdateTimeOffPayload,
  VeterinarianOption,
  VeterinarianOptionsResponse,
} from "@/types/time-off/time-off.type";

export async function fetchTimeOff(): Promise<TimeOffItem[]> {
  const response = await apiClient<TimeOffListResponse>("/time-off", {
    method: "GET",
    auth: true,
  });

  return response.data;
}

export async function fetchTimeOffVeterinarians(): Promise<VeterinarianOption[]> {
  const response = await apiClient<VeterinarianOptionsResponse>("/veterinarians", {
    method: "GET",
    auth: true,
  });

  return response.data;
}

export async function createTimeOff(
  payload: CreateTimeOffPayload,
): Promise<TimeOffItem> {
  const response = await apiClient<TimeOffResponse>("/time-off", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateTimeOff(
  timeOffId: string,
  payload: UpdateTimeOffPayload,
): Promise<TimeOffItem> {
  const response = await apiClient<TimeOffResponse>(`/time-off/${timeOffId}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function deleteTimeOff(timeOffId: string): Promise<TimeOffItem> {
  const response = await apiClient<TimeOffResponse>(`/time-off/${timeOffId}`, {
    method: "DELETE",
    auth: true,
  });

  return response.data;
}