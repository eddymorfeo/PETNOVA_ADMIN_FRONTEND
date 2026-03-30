export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type ConsultationItem = {
  id: string;
  appointment_id: string;
  pet_id: string;
  client_id: string;
  veterinarian_id: string;
  chief_complaint: string | null;
  anamnesis: string | null;
  physical_exam: string | null;
  assessment: string | null;
  plan: string | null;
  weight_kg: number | null;
  temperature_c: number | null;
  diagnosis: string | null;
  summary: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  pet_name?: string | null;
  client_name?: string | null;
  veterinarian_name?: string | null;
};

export type MedicalRecordFormValues = {
  appointmentId: string;
  appointmentLabel: string;
  petId: string;
  petLabel: string;
  clientId: string;
  clientLabel: string;
  veterinarianId: string;
  chiefComplaint: string;
  anamnesis: string;
  physicalExam: string;
  assessment: string;
  plan: string;
  weightKg: string;
  temperatureC: string;
  diagnosis: string;
  summary: string;
};

export type CreateConsultationPayload = {
  appointmentId: string;
  petId: string;
  clientId: string;
  veterinarianId: string;
  chiefComplaint?: string;
  anamnesis?: string;
  physicalExam?: string;
  assessment?: string;
  plan?: string;
  weightKg?: number;
  temperatureC?: number;
  diagnosis?: string;
  summary?: string;
};

export type UpdateConsultationPayload = Partial<{
  appointmentId: string;
  petId: string;
  clientId: string;
  veterinarianId: string;
  chiefComplaint: string;
  anamnesis: string;
  physicalExam: string;
  assessment: string;
  plan: string;
  weightKg: number;
  temperatureC: number;
  diagnosis: string;
  summary: string;
}>;

export type ConsultationResponse = ApiResponse<ConsultationItem>;
export type ConsultationListResponse = ApiResponse<ConsultationItem[]>;