export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type AppointmentStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type VeterinarianOption = {
  id: string;
  user_id?: string;
  full_name?: string;
  email?: string | null;
};

export type AppointmentTypeOption = {
  id: string;
  name: string;
  description?: string | null;
  duration_minutes?: number | null;
};

export type AppointmentItem = {
  id: string;
  veterinarian_id: string;
  appointment_type_id: string | null;
  client_id: string | null;
  pet_id: string | null;
  starts_at: string;
  ends_at: string;
  status: AppointmentStatus | string;
  reason: string | null;
  booked_source: string | null;
  booked_by_user_id: string | null;
  cancel_reason: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  veterinarian_name?: string | null;
  client_name?: string | null;
  pet_name?: string | null;
  appointment_type_name?: string | null;
};

export type AppointmentFormValues = {
  veterinarianId: string;
  appointmentTypeId: string;
  clientId: string;
  clientLabel: string;
  petId: string;
  petLabel: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  reason: string;
  bookedSource: string;
  cancelReason: string;
};

export type CreateAppointmentPayload = {
  veterinarianId: string;
  appointmentTypeId?: string;
  clientId?: string;
  petId?: string;
  startsAt: string;
  endsAt: string;
  status?: string;
  reason?: string;
  bookedSource?: string;
};

export type UpdateAppointmentPayload = Partial<{
  veterinarianId: string;
  appointmentTypeId: string;
  clientId: string;
  petId: string;
  startsAt: string;
  endsAt: string;
  status: string;
  reason: string;
  bookedSource: string;
  cancelReason: string;
}>;

export type AvailableTimeOption = {
  value: string;
  label: string;
};

export type AppointmentResponse = ApiResponse<AppointmentItem>;
export type AppointmentListResponse = ApiResponse<AppointmentItem[]>;
export type VeterinarianListResponse = ApiResponse<VeterinarianOption[]>;
export type AppointmentTypeListResponse = ApiResponse<AppointmentTypeOption[]>;