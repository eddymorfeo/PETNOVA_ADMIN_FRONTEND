import { apiClient } from "@/lib/http/api-client";
import type {
  CreateWorkingHourPayload,
  UpdateWorkingHourPayload,
  VeterinarianOption,
  VeterinarianOptionsResponse,
  WorkingHourItem,
  WorkingHourListResponse,
  WorkingHourResponse,
} from "@/types/working-hours/working-hour.type";

export async function fetchWorkingHours(): Promise<WorkingHourItem[]> {
  const response = await apiClient<WorkingHourListResponse>("/working-hours", {
    method: "GET",
    auth: true,
  });

  return response.data;
}

export async function fetchWorkingHourVeterinarians(): Promise<VeterinarianOption[]> {
  const response = await apiClient<VeterinarianOptionsResponse>("/veterinarians", {
    method: "GET",
    auth: true,
  });

  return response.data;
}

export async function createWorkingHour(
  payload: CreateWorkingHourPayload,
): Promise<WorkingHourItem> {
  const response = await apiClient<WorkingHourResponse>("/working-hours", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateWorkingHour(
  workingHourId: string,
  payload: UpdateWorkingHourPayload,
): Promise<WorkingHourItem> {
  const response = await apiClient<WorkingHourResponse>(
    `/working-hours/${workingHourId}`,
    {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    },
  );

  return response.data;
}

export async function deleteWorkingHour(
  workingHourId: string,
): Promise<WorkingHourItem> {
  const response = await apiClient<WorkingHourResponse>(
    `/working-hours/${workingHourId}`,
    {
      method: "DELETE",
      auth: true,
    },
  );

  return response.data;
}