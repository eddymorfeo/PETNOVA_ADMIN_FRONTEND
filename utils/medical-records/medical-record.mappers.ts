import type {
  ConsultationItem,
  CreateConsultationPayload,
  MedicalRecordFormValues,
  UpdateConsultationPayload,
} from "@/types/medical-records/medical-record.type";

export function mapConsultationToFormValues(
  consultation: ConsultationItem,
): MedicalRecordFormValues {
  return {
    appointmentId: consultation.appointment_id ?? "",
    appointmentLabel: consultation.appointment_id ?? "",
    petId: consultation.pet_id ?? "",
    petLabel: consultation.pet_name ?? "",
    clientId: consultation.client_id ?? "",
    clientLabel: consultation.client_name ?? "",
    veterinarianId: consultation.veterinarian_id ?? "",
    chiefComplaint: consultation.chief_complaint ?? "",
    anamnesis: consultation.anamnesis ?? "",
    physicalExam: consultation.physical_exam ?? "",
    assessment: consultation.assessment ?? "",
    plan: consultation.plan ?? "",
    weightKg:
      consultation.weight_kg !== null && consultation.weight_kg !== undefined
        ? String(consultation.weight_kg)
        : "",
    temperatureC:
      consultation.temperature_c !== null &&
      consultation.temperature_c !== undefined
        ? String(consultation.temperature_c)
        : "",
    diagnosis: consultation.diagnosis ?? "",
    summary: consultation.summary ?? "",
  };
}

export function mapCreateMedicalRecordFormToPayload(
  values: MedicalRecordFormValues,
): CreateConsultationPayload {
  return {
    appointmentId: values.appointmentId,
    petId: values.petId,
    clientId: values.clientId,
    veterinarianId: values.veterinarianId,
    chiefComplaint: values.chiefComplaint.trim() || undefined,
    anamnesis: values.anamnesis.trim() || undefined,
    physicalExam: values.physicalExam.trim() || undefined,
    assessment: values.assessment.trim() || undefined,
    plan: values.plan.trim() || undefined,
    weightKg: values.weightKg ? Number(values.weightKg) : undefined,
    temperatureC: values.temperatureC ? Number(values.temperatureC) : undefined,
    diagnosis: values.diagnosis.trim() || undefined,
    summary: values.summary.trim() || undefined,
  };
}

export function mapUpdateMedicalRecordFormToPayload(
  values: MedicalRecordFormValues,
): UpdateConsultationPayload {
  const payload: UpdateConsultationPayload = {};

  if (values.appointmentId) payload.appointmentId = values.appointmentId;
  if (values.petId) payload.petId = values.petId;
  if (values.clientId) payload.clientId = values.clientId;
  if (values.veterinarianId) payload.veterinarianId = values.veterinarianId;
  if (values.chiefComplaint.trim()) payload.chiefComplaint = values.chiefComplaint.trim();
  if (values.anamnesis.trim()) payload.anamnesis = values.anamnesis.trim();
  if (values.physicalExam.trim()) payload.physicalExam = values.physicalExam.trim();
  if (values.assessment.trim()) payload.assessment = values.assessment.trim();
  if (values.plan.trim()) payload.plan = values.plan.trim();
  if (values.weightKg) payload.weightKg = Number(values.weightKg);
  if (values.temperatureC) payload.temperatureC = Number(values.temperatureC);
  if (values.diagnosis.trim()) payload.diagnosis = values.diagnosis.trim();
  if (values.summary.trim()) payload.summary = values.summary.trim();

  return payload;
}