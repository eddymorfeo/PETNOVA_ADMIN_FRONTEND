export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type TimeOffItem = {
  id: string;
  veterinarian_id: string;
  starts_at: string;
  ends_at: string;
  reason: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  username: string;
  email: string;
  full_name: string;
};

export type VeterinarianOption = {
  id: string;
  user_id: string;
  license_number: string | null;
  specialty_id: string | null;
  is_active: boolean;
  created_by: string | null;
  updated_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  username: string;
  email: string;
  full_name: string;
  phone: string | null;
  specialty_code: string | null;
  specialty_name: string | null;
  specialty_description: string | null;
};

export type TimeOffFormValues = {
  veterinarianId: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  reason: string;
};

export type CreateTimeOffPayload = {
  veterinarianId: string;
  startsAt: string;
  endsAt: string;
  reason?: string;
};

export type UpdateTimeOffPayload = {
  veterinarianId?: string;
  startsAt?: string;
  endsAt?: string;
  reason?: string;
};

export type TimeOffListResponse = ApiResponse<TimeOffItem[]>;
export type TimeOffResponse = ApiResponse<TimeOffItem>;
export type VeterinarianOptionsResponse = ApiResponse<VeterinarianOption[]>;