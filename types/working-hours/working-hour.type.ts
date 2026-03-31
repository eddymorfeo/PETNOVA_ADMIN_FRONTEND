export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type WorkingHourItem = {
  id: string;
  veterinarian_id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  slot_minutes: number;
  is_active: boolean;
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

export type WorkingHourFormValues = {
  veterinarianId: string;
  weekdays: string[];
  startTime: string;
  endTime: string;
  slotMinutes: string;
  isActive: boolean;
};

export type CreateWorkingHourPayload = {
  veterinarianId: string;
  weekday: number;
  startTime: string;
  endTime: string;
  slotMinutes: number;
};

export type UpdateWorkingHourPayload = {
  veterinarianId?: string;
  weekday?: number;
  startTime?: string;
  endTime?: string;
  slotMinutes?: number;
  isActive?: boolean;
};

export type UpsertWorkingHoursPayload = {
  veterinarianId: string;
  weekdays: number[];
  startTime: string;
  endTime: string;
  slotMinutes: number;
  isActive: boolean;
};

export type WorkingHourListResponse = ApiResponse<WorkingHourItem[]>;
export type WorkingHourResponse = ApiResponse<WorkingHourItem>;
export type VeterinarianOptionsResponse = ApiResponse<VeterinarianOption[]>;