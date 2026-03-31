import { apiClient } from "@/lib/http/api-client";
import type {
  CreateVeterinarianPayload,
  UpdateVeterinarianPayload,
  VeterinarianItem,
  VeterinarianListResponse,
  VeterinarianResponse,
  VeterinarianSpecialtiesResponse,
  VeterinarianSpecialtyOption,
  VeterinarianUsersResponse,
  VeterinarianUserOption,
} from "@/types/veterinarian/veterinarian.type";

export async function fetchVeterinarians(): Promise<VeterinarianItem[]> {
  const response = await apiClient<VeterinarianListResponse>("/veterinarians", {
    method: "GET",
    auth: true,
  });

  return response.data;
}

export async function fetchVeterinarianUsers(): Promise<VeterinarianUserOption[]> {
  const response = await apiClient<VeterinarianUsersResponse>("/users", {
    method: "GET",
    auth: true,
  });

  return response.data;
}

export async function fetchVeterinarianSpecialties(): Promise<VeterinarianSpecialtyOption[]> {
  const response = await apiClient<VeterinarianSpecialtiesResponse>("/specialties", {
    method: "GET",
    auth: true,
  });

  return response.data;
}

export async function createVeterinarian(
  payload: CreateVeterinarianPayload,
): Promise<VeterinarianItem> {
  const response = await apiClient<VeterinarianResponse>("/veterinarians", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateVeterinarian(
  veterinarianId: string,
  payload: UpdateVeterinarianPayload,
): Promise<VeterinarianItem> {
  const response = await apiClient<VeterinarianResponse>(
    `/veterinarians/${veterinarianId}`,
    {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    },
  );

  return response.data;
}

export async function deleteVeterinarian(
  veterinarianId: string,
): Promise<VeterinarianItem> {
  const response = await apiClient<VeterinarianResponse>(
    `/veterinarians/${veterinarianId}`,
    {
      method: "DELETE",
      auth: true,
    },
  );

  return response.data;
}