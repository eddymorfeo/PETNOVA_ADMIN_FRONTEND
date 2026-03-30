import { apiClient } from "@/lib/http/api-client";
import type {
  ConsultationItem,
  ConsultationListResponse,
  ConsultationResponse,
  CreateConsultationPayload,
  UpdateConsultationPayload,
} from "@/types/medical-records/medical-record.type";

export async function fetchConsultations(): Promise<ConsultationItem[]> {
  const response = await apiClient<ConsultationListResponse>("/consultations", {
    method: "GET",
    auth: true,
  });

  return response.data;
}

export async function createConsultation(
  payload: CreateConsultationPayload,
): Promise<ConsultationItem> {
  const response = await apiClient<ConsultationResponse>("/consultations", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function updateConsultation(
  consultationId: string,
  payload: UpdateConsultationPayload,
): Promise<ConsultationItem> {
  const response = await apiClient<ConsultationResponse>(
    `/consultations/${consultationId}`,
    {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    },
  );

  return response.data;
}

export async function deleteConsultation(
  consultationId: string,
): Promise<ConsultationItem> {
  const response = await apiClient<ConsultationResponse>(
    `/consultations/${consultationId}`,
    {
      method: "DELETE",
      auth: true,
    },
  );

  return response.data;
}