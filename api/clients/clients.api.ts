import { apiClient } from "@/lib/http/api-client";
import type {
  ClientItem,
  ClientListResponse,
  ClientResponse,
  CreateClientPayload,
  UpdateClientPayload,
} from "@/types/clients/client.type";

export async function fetchClients(): Promise<ClientItem[]> {
  const response = await apiClient<ClientListResponse>("/clients", {
    method: "GET",
    auth: true,
  });

  return response.data;
}

export async function createClient(
  payload: CreateClientPayload,
): Promise<ClientItem> {
  const response = await apiClient<ClientResponse>("/clients", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateClient(
  clientId: string,
  payload: UpdateClientPayload,
): Promise<ClientItem> {
  const response = await apiClient<ClientResponse>(`/clients/${clientId}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function deleteClient(clientId: string): Promise<ClientItem> {
  const response = await apiClient<ClientResponse>(`/clients/${clientId}`, {
    method: "DELETE",
    auth: true,
  });

  return response.data;
}